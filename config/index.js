let config = {
    production: {
        port: 8080,
        database: 'mongodb://localhost/node-rest'
    },
    test: {
        port: 8081,
        database: 'mongodb://localhost/node-rest-test'
    },
    development: {
        port: 8082,
        database: 'mongodb://localhost/node-rest-dev'
    }
}

exports.get = function get(env) {
    return config[env] || config.development;
}