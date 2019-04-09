'use strict';

/**
 * @author Wei Zheng
 * @description Helper class that provide all type of verification, authorization, and validation methods
 *              All method will throw exception and return respond 404 if failed
 */

const InvalidAccessException = use('App/Exceptions/InvalidAccessException');
const ResourceNotExistException = use(
  'App/Exceptions/ResourceNotExistException'
);

class VerificationHelper {
  /**
   * verify if the user has permission to handle this resource
   * @param {Object} resource
   * @param {User} user
   * @param {String[]} allowRoles
   * @param {Boolean} allowSelf
   */
  static verifyPermission(resource, user, allowRoles, allowSelf) {
    //throw a ResourceNotExistException if resource do not exist
    this.verifyExistance(resource, 'resource');

    //if not allow self update or resource owner is not current user, do a role check
    if (!resource || !allowSelf || resource.user_id != user.id) {
      //if role was defined, throw a InvalidAccessException if the current user's role is not contained in allowed roles list
      if (
        allowRoles &&
        allowRoles.length > 0 &&
        allowRoles.indexOf(user.role) == -1
      ) {
        throw new InvalidAccessException('resource');
      }
    }
  }

  /**
   * verify if user is the owner of the message
   * @param {String} message
   * @param {User} owner
   */
  static verifyMessageOwnership(message, owner) {
    //throw a ResourceNotExistException if resource do not exist
    this.verifyExistance(message, 'message');
    if (message.receiverEmail !== owner.email) {
      throw new InvalidAccessException('message');
    }
  }

  /**
   * verify if user has permission to view the entire list
   * @param {User} user
   * @param {String[]} allowRoles
   */
  static verifyRole(user, allowRoles) {
    //if role was defined, throw a InvalidAccessException if the current user's role is not contained in allowed roles list
    if (
      allowRoles &&
      allowRoles.length > 0 &&
      allowRoles.indexOf(user.role) == -1
    ) {
      throw new InvalidAccessException('resource');
    }
  }

  /**
   * verify if the user has permission to handle data of the target user
   * @param {User} targetUser
   * @param {User} user
   * @param {String[]} allowRoles
   * @param {Boolean} allowSelf
   */
  static verifyPermissionForUser(targetUser, user, allowRoles, allowSelf) {
    //throw a ResourceNotExistException if targetUser do not exist
    this.verifyExistance(targetUser, 'user');

    // allow developer to ignore this rule
    if (!user.isDev) {
      //if not allow self update or target is not current user, do a role check
      if (!allowSelf || targetUser.id != user.id) {
        //throw a InvalidAccessException if the current user's role is not in allowed roles list
        //or target user has equal authority level as current user
        if (
          allowRoles &&
          (allowRoles.indexOf(targetUser.role) != -1 ||
            allowRoles.indexOf(user.role) == -1)
        ) {
          throw new InvalidAccessException('user');
        }
      }
    }
  }

  /**
   * Verify if the user has the permission to delete target user
   * @param {User} targetUser
   * @param {User} user
   * @param {String[]} allowRoles
   */
  static verifyPermissionForDeleteUser(targetUser, user, allowRoles) {
    //throw a ResourceNotExistException if targetUser do not exist
    this.verifyExistance(targetUser, 'user');

    if (targetUser.id == user.id) {
      throw new InvalidAccessException('user. Self deleting is not allowed');
    } else if (targetUser.isDev) {
      throw new InvalidAccessException('user. The target user is a Developer');
    } else if (!user.isDev) {
      //throw a InvalidAccessException if the current user's role is not in allowed roles list
      //or target user has equal authority level as current user
      if (
        allowRoles.indexOf(targetUser.role) != -1 ||
        allowRoles.indexOf(user.role) == -1
      ) {
        throw new InvalidAccessException('user');
      }
    }
  }

  /**
   * verify if resource exists
   * @param {Object} resource
   * @param {String} message
   */
  static verifyExistance(resource, message) {
    if (!resource) {
      throw new ResourceNotExistException(message);
    }
  }

  /**
   * verify change request data
   * @param {ChangeRequest} param0
   * @param {String} message
   */
  static verifyRequest({ title, details }, message) {
    if (!title || !details) {
      throw new InvalidAccessException(message);
    }
  }
}

module.exports = VerificationHelper;
