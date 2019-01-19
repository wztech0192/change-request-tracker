'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ChangeRequest extends Model {
    
    /**
     * return the belonging user
    */
    user(){
        return this.belongsTo('App/Models/User');
    }

}

module.exports = ChangeRequest
