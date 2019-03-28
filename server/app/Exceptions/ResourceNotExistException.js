'use strict';

const { LogicalException } = require('@adonisjs/generic-exceptions');

/**
 * Child of Logical Exception
 */
class ResourceNotExistException extends LogicalException {
  /**
   *  Handle Not Exist Resource exceptions
   */

  handle(error, { response }) {
    return response.status(403).json({
      error: (error.message || 'target') + ' do not exist'
    });
  }
}

module.exports = ResourceNotExistException;
