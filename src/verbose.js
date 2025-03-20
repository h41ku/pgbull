function getVerboseConnection(logger, connection) {
    const { query: silentQuery, release: silentRelease, ...rest } = connection
    const query = async (sql, parameters) => {
        try {
            logger.verbose(`Preparing query.`, { sql, parameters })
            const result = await silentQuery(sql, parameters)
            logger.debug(`Query executed.`, { sql, parameters })
            return result
        } catch (error) {
            logger.error(`Error while querying database.`, { sql, parameters, error })
            throw error
        }
    }
    const release = () => {
        logger.verbose(`Releasing connection.`)
        silentRelease()
        logger.debug(`Connection released.`)
    }
    return { query, release, ...rest }
}

export default function verbose(logger, pool) {
    const { connect: silentConnect, ...rest } = pool
    const connect = async () => {
        try {
            logger.verbose(`Fetching connection from pool.`)
            const connection = await silentConnect()
            logger.debug(`Fetched connection from pool.`)
            return getVerboseConnection(logger, connection)
        } catch (error) {
            logger.error(`Couldn't get connection with database.`, { error })
            throw error
        }
    }
    return { connect, ...rest }
}
