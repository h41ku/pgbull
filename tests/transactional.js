import verbose from '../src/verbose.js'
import getPool from '../src/getPool.js'
import fetchFirstColumn from '../src/fetchFirstColumn.js'
import transactional from '../src/transactional.js'
import logger from './logger.js'

const pool = verbose(logger, getPool())

async function main() {
    const client = await pool.connect()
    const result = await transactional(client, async () => {
        return fetchFirstColumn(await client.query(`select now()`))
    })
    console.log(result)
    client.release()
    console.log(logger.dump())
}

main().then(() => {
    console.log('DONE')
    process.exit(0)
}).catch(error => {
    console.error(error)
    process.exit(1)
})
