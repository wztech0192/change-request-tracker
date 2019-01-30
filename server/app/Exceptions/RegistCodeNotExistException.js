'use strict'

const {LogicalException} = require('@adonisjs/generic-exceptions')

/**
 * Child of Logical Exception
 */
class RegistCodeNotExistException extends LogicalException{
    /**
     *  Handle Not Exist Registration Code Exceptions
     */

     handle (error , {response}){
         return response.status(403).json({
             error:'Invalid Registration Code!'
         });
     }
}

module.exports = RegistCodeNotExistException