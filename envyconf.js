let isNode
let ENV
try {
    ENV = window
    isNode = false
} catch (e) {
    ENV = process.env
    isNode = true
}

function _determinePrefix(PREFIX) {
    if (!PREFIX) {
        if (ENV.ENVYCONF_PREFIX) {
            PREFIX = ENV.ENVYCONF_PREFIX
        } else {
            throw new Error("Need to set prefix")
        }
    }
    if (!ENV.ENVYCONF_PREFIX) ENV.ENVYCONF_PREFIX = PREFIX
    return PREFIX
}

function envyConf(PREFIX, localDefaults={}) {
    if (typeof PREFIX === 'object') [localDefaults, PREFIX] = [PREFIX, null]
    PREFIX = _determinePrefix(PREFIX)
    const PREFIX_RE = new RegExp(`^${PREFIX}_`)
    const DEFAULTS = {
        DEBUG: 'false',
    }

    const CONFIG = JSON.parse(JSON.stringify(DEFAULTS))
    Object.assign(CONFIG, JSON.parse(JSON.stringify(localDefaults)))

    Object.keys(ENV)
        .filter(k => k.match(PREFIX_RE))
        .forEach(k => CONFIG[k.replace(PREFIX_RE, '')] = ENV[k])

    Object.keys(CONFIG)
        .forEach(k => {
            if (typeof CONFIG[k] === 'string' && CONFIG[k].match(/^true|false$/))
                CONFIG[k] = CONFIG[k] !== 'false'
            ENV[`${PREFIX}_${k}`] = CONFIG[k]
        })

    return CONFIG
}

function envyLog(PREFIX, category='') {
    const config = envyConf(PREFIX, {
        LOGLEVEL: '',
    })
    const format = function format(level, message) {
        // console.log(message)
        if (typeof message !== 'string') message = JSON.stringify(message)
        const timestamp = new Date().toISOString().substr(11).substr(0, 11)
        return `# ${level} [${timestamp}] ${category} - ${message}`
    }
    const logEnabled = function logEnabled(level, cb) {
        if (level.match(/debug/i) && config.LOGLEVEL.match(/(silly|debug)/i)) return cb()
        if (level.match(/SILLY/i) && config.LOGLEVEL.match(/silly/i)) return cb()
    }
    if (isNode && config.LOGFILE) {
        // HACK XXX webpack
        const fs = require('fs')
        return {
            silly: (...msgs) => logEnabled('silly', () => msgs.forEach(msg =>
                fs.appendFile(config.LOGFILE, format('SILLY', msg+'\n'), ()=>{}))),
            debug: (...msgs) => logEnabled('debug', () => msgs.forEach(msg =>
                fs.appendFile(config.LOGFILE, format('DEBUG', msg+'\n'), ()=>{}))),
        }
    }
    return {
        silly: (...msgs) => logEnabled('SILLY', () => msgs.forEach(msg =>
            console[isNode ? 'log' : 'debug'](format('SILLY', msg)))),
        debug: (...msgs) => logEnabled('DEBUG', () => msgs.forEach(msg =>
            console.log(format('DEBUG', msg)))),
    }
}

Object.assign(envyConf, {envyLog, envyConf})

module.exports = envyConf
