export default (() => {
    const records = []
    const log = (level, message, detail) => records.push({ level, message, detail })
    const debug = (message, detail) => log('DEBUG', message, detail)
    const verbose = (message, detail) => log('VERBOSE', message, detail)
    const info = (message, detail) => log('INFO', message, detail)
    const warning = (message, detail) => log('WARNING', message, detail)
    const error = (message, detail) => log('ERROR', message, detail)
    return {
        debug,
        verbose,
        info,
        warning,
        error,
        dump: () => records
    }
})()
