# pgbull

Collection of helpers over package `pg` for most common use-cases.

## Install

NPM:

```sh
npm install pgbull
```

## Usage

Create pool of connections:

```js
import { getPool } from 'pgbull'
const pool = getPool({
    // Client options
    connectionString: process.env.DATABASE_URL,
    applicationName: 'pgbull',
    queryTimeoutMillis: 0,
    statementTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    // Pool options
    maxNumClients: 10,
    idleTimeoutMillis: 0,
    // Extended options
    techBreakMillis: 10000,
})
```

Get a client from pool:

```js
const client = await pool.connect()
// ...
client.release()
```

The pool goes into `Technical break` mode when it got a problem
with a connection to database server. It wait for `techBreakMillis`
milliseconds to allow to try finish queries of active clients, then
drains itself (closes all active connections) to restore a service.

Make a queries:

```js
const result = await client.query(
    `select $1::int as id, $2::text as name`,
    [ 123, 'Albert Einstein' ]
)
```

Some helpers for manipulating the result:

```js
import { fetchAllRows, fetchFirstRow, fetchFirstColumn } from 'pgbull'
const rows = fetchAllRows(result)
const firstRow = fetchFirstRow(result)
const firstColumn = fetchFirstColumn(result)
```

Using transactions:

```js
const result = await transactional(client, async () => {
    let result
    // ...
    return result
})
```

Enable logging:

```js
import { verbose, getPool } from 'pgbull'
const logger = ... // your favorite logger on wrapper over it
const pool = verbose(logger, getPool({
    connectionString: process.env.DATABASE_URL,
    // ... omit options ...
}))
```

Escaping identifiers:

```js
import { encodeId } from 'pgbull'
const tableName = ... // 
const safeTableName = encodeId(tableName) // prevent SQL injection
const result = await client.query(
    `select * from ${safeTableName}` // safe SQL
)
```

## List of functions

- `verbose`
- `transactional`
- `fetchAllRows`
- `fetchFirstColumn`
- `fetchFirstRow`
- `encodeId`

## License

MIT
