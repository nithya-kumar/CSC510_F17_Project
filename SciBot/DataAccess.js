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

    // Method to run select queries, pass rowCount to match the number of rows affected by the query
    select(query, callback){
        this.pool.query(query, function(err, res){
            callback(err, res);
        })
    }

    // Method to run insert queries, pass rowCount to match the number of rows affected by the query
    insert(query, callback, rowCount){
        this.pool.query(query, function(err, res){
            callback(err, res, rowCount);
        })
    }
}

var dataAccess = new DataAccess();

Object.freeze(dataAccess);

module.exports.DataAccess = dataAccess;
