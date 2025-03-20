import pg from 'pg'

export default function encodeId(id) {
    return pg.escapeIdentifier(id)
}
