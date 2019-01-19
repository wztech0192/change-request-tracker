'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DevTask extends Model {

    /**
    * return the belonging user
    */
    devTodo(){
        return this.belongsTo('App/Models/Dev/DevTodo');
    }
}

module.exports = DevTask
