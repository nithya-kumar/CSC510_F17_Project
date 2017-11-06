'use strict'

const { Pool } = require('pg');
var { config } = require('./config');

class DataAccess {

    constructor() {
        var dbOptions = {
            user: 'postgres',
            host: 'localhost',
            database: 'scibot',
            port: 5432
        };

        this.pool = new Pool(dbOptions);
    }

    select(query, callback){
        this.pool.query(query, function(err, res){
            callback(err, res);
        })
    }
}

var dataAccess = new DataAccess();

Object.freeze(dataAccess);

module.exports.DataAccess = dataAccess;