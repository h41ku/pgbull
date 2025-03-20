import getPool from '../src/getPool.js'
import fetchFirstRow from '../src/fetchFirstRow.js'
import sleep from './sleep.js'

const pool = getPool({
    maxNumClients: 90,
    connectionTimeoutMillis: 5000
})

const stat = {
    queue: 0,
    200: 0,
    500: 0,
    503: 0
}

function printStat() {
    console.log(stat)
}

setInterval(printStat, 1000)

async function request(i) {
    let status
    stat.queue ++
    try {
        const client = await pool.connect()
        try {
            await sleep(45)
            const row = fetchFirstRow(await client.query(`select now(), $1 as result_index`, [ i ]))
            status = 200
        } catch (error) {
            // console.error(error)
            status = 500
        } finally {
            client.release()
        }
    } catch (error) {
        // console.error(error)
        status = 503
    }
    stat[status] ++
    stat.queue --
}

async function main() {
    const n = 5000
    for (let i = 0; ; i += n) {
        const promises = []
        for (let j = 0; j < n; j ++)
            promises.push(request(i + j))
        await sleep(3000)
        // await Promise.all(promises)
    }
}

main().then(() => {
    console.log('DONE')
    process.exit(0)
}).catch(error => {
    console.error(error)
    process.exit(1)
})

