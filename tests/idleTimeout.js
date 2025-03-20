import getPool from '../src/getPool.js'
import fetchFirstColumn from '../src/fetchFirstColumn.js'
import sleep from './sleep.js'

const n = 5

const pool = getPool({
    maxNumClients: n,
    idleTimeoutMillis: 5000
})

async function main() {
    const clients = []
    for (let i = 0; i < n; i ++) {
        clients.push(await pool.connect())
    }
    console.log(pool.stat())
    await sleep(1000)
    console.log(fetchFirstColumn(await clients[0].query(`select now()`)))
    console.log(fetchFirstColumn(await clients[1].query(`select now()`)))
    await sleep(2000)
    console.log(pool.stat())
    clients.forEach(client => client.release())
    console.log(pool.stat())
    await sleep(3000)
    console.log(pool.stat())
}

main().then(() => {
    console.log('DONE')
    process.exit(0)
}).catch(error => {
    console.error(error)
    process.exit(1)
})
