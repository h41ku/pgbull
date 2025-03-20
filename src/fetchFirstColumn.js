export default function fetchFirstColumn(result) {
    if (result && result.rows.length > 0) {
        return result.rows[0][result.fields[0].name]
    }
    return null
}
