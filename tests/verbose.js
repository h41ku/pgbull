import verbose from '../src/verbose.js'
import getPool from '../src/getPool.js'
import fetchFirstColumn from '../src/fetchFirstColumn.js'
import logger from './logger.js'

const pool = verbose(logger, getPool())

async function main() {
    const client = await pool.connect()
    console.log(fetchFirstColumn(await client.query(`select now(), $1::bigint`, [ Date.now() ])))
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
