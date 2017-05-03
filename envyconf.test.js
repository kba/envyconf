const tap = require('tap')

const {envyConf, envyLog} = require('./envyconf')

tap.test('loadConfig', t => {
    var PREFIX = 'ANNO'

    t.equals(process.env.ENVYCONF_PREFIX, undefined, 'No ENVYCONF_PREFIX yet')
    var config = envyConf(PREFIX)
    t.equals(process.env.ENVYCONF_PREFIX, PREFIX, 'first load set ENVYCONF_PREFIX envvar')

    const expected = 'not secret'
    process.env.ANNO_XYZ = expected
    config = envyConf(PREFIX)
    t.equals(config.XYZ, expected, 'reloading from env works')

    process.env.ANNO_FOO = expected
    config = envyConf(PREFIX)
    t.equals(config.FOO, expected, 'picking up unknown vars works')

    config = envyConf(PREFIX, {BLA: expected})
    t.equals(config.BLA, expected, 'localDefaults works')

    process.env.ANNO_BLA = '42'
    config = envyConf(PREFIX, {BLA: expected})
    t.equals(config.BLA, '42', 'env overrides localDefaults')

    config = envyConf(PREFIX, {XYZ: expected})
    t.equals(process.env.ANNO_XYZ, expected, 'config vars are exported to env')

    config = envyConf(PREFIX, {BOOL: 'false'})
    t.equals(typeof config.BOOL, 'boolean', 'strings "true"/"false" parsed as boolean')
    t.equals(typeof process.env.ANNO_BOOL, 'string', 'strings "true"/"false" still strings in process.env')

    t.end()
})

// tap.test('getLogger', t => {
//     // process.env.ANNO_LOGFILE = '/tmp/anno.log'
//     process.env.ANNO_LOGFILE = ''
//     process.env.ANNO_DEBUG = true
//     process.env.ANNO_SILLY = true
//     const log = getLogger('test')
//     log.debug("bar")
//     log.silly("foo")
//     log.silly('blo', {foo:'bar'})
//     t.end()
// })
