'use strict';

const { LogicalException } = require('@adonisjs/generic-exceptions');

/**
 * Child of Logical Exception
 */
class InvalidAccessException extends LogicalException {
  /**
   *  Handle Invalid User Access exceptions
   */

  handle(error, { response }) {
    return response.status(403).json({
      error: 'Invalid access to ' + (error.message || 'target')
    });
  }
}

module.exports = InvalidAccessException;
