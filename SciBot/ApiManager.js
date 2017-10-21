'use strict'

class ApiManager{
    constructor(token){
        this.token = token;
    }

    getToken(){
        return this.token;
    }
}

module.exports.ApiManager = ApiManager;