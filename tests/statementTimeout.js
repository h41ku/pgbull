import getPool from '../src/getPool.js'
import fetchFirstColumn from '../src/fetchFirstColumn.js'

const pool = getPool({
    statementTimeoutMillis: 2500
})

async function main() {
    const client = await pool.connect()
    console.log(fetchFirstColumn(await client.query(`select now(), pg_sleep(1.0)`)))
    console.log(fetchFirstColumn(await client.query(`select now(), pg_sleep(2.0)`)))
    console.log(fetchFirstColumn(await client.query(`select now(), pg_sleep(3.0)`)))
    client.release()
}

main().then(() => {
    console.log('DONE')
    process.exit(0)
}).catch(error => {
    console.error(error)
    process.exit(1)
})
