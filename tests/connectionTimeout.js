import getPool from '../src/getPool.js'
import fetchFirstColumn from '../src/fetchFirstColumn.mjs'

const pool = getPool({
    connectionTimeoutMillis: 2000
})

async function main() {
    const client = await pool.connect()
    console.log(fetchFirstColumn(await client.query(`select now()`)))
    client.release()
}

main().then(() => {
    console.log('DONE')
    process.exit(0)
}).catch(error => {
    console.error(error)
    process.exit(1)
})
