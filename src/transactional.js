export default async function transactional(connection, task, mode = 'isolation level serializable') {
    await connection.query(`start transaction ${mode}`)
    const result = await task()
    await connection.query('commit')
    return result
}
