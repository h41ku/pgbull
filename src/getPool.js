import pg from 'pg'

pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, value => value === null ? value : value.replace(/ /, 'T') + 'Z')

const defaults = {
    // Client options
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/postgres',
    applicationName: 'pgbull',
    queryTimeoutMillis: 0,
    statementTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    // Pool options
    maxNumClients: 10,
    idleTimeoutMillis: 0,
    // Extended options
    techBreakMillis: 10000,
}

function getClient(pgClient) { // wrap pgClient
    if (!pgClient.__ext) {
        pgClient.__ext = {}
        pgClient.on('error', () => {}) // disable process termination when connection is lost
    }
    const query = async (sql, parameters = []) => await pgClient.query(sql, parameters)
    const release = () => pgClient.release()
    return { query, release }
}

export default function getPool(options = {}) { // wrap pgPool
    const opts = { ...defaults, ...options }
    let techBreakUntil = 0
    let techBreakEnded = true
    const {
        connectionString, applicationName, queryTimeoutMillis, statementTimeoutMillis, connectionTimeoutMillis,
        maxNumClients, idleTimeoutMillis,
        techBreakMillis
    } = opts
    const pgPool = new pg.Pool({
        connectionString, application_name: applicationName, query_timeout: queryTimeoutMillis, statement_timeout: statementTimeoutMillis, connectionTimeoutMillis,
        max: maxNumClients, idleTimeoutMillis
    })
    const clients = new Set()
    pgPool.on('acquire', client => { clients.add(client) })
    pgPool.on('release', (err, client) => { if (!err) clients.delete(client) })
    pgPool.on('remove', client => { clients.delete(client) })
    pgPool.on('error', () => {}) // disable process termination when connection is lost
    const drain = () => {
        for (let client of clients.values())
            client.release(true)
        clients.clear()
    }
    const connect = async () => {
        if (Date.now() >= techBreakUntil) {
            try {
                if (!techBreakEnded) {
                    techBreakEnded = true
                    drain() // shutdown rest of clients after technical break
                }
                const pgClient = await pgPool.connect()
                return getClient(pgClient)
            } catch (error) {
                techBreakUntil = Date.now() + techBreakMillis
                techBreakEnded = false
                throw error
            }
        }
        throw new Error(`Technical break.`) // give a breath to system to allow to start postgresql server (if it is located on the same machine)
    }
    const stat = () => ({
        totalCount: pgPool.totalCount,
        idleCount: pgPool.idleCount,
        waitingCount: pgPool.waitingCount
    })
    return { connect, stat, drain }
}
