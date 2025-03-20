export default function fetchFirstRow(result) {
    if (result && result.rows.length > 0) {
        return result.rows[0]
    }
    return null
}
