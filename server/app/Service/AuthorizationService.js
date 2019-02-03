'use strict'

/**
 * @author Wei Zheng
 * @description handles all verification
 */

const InvalidAccessException = use('App/Exceptions/InvalidAccessException');
const ResourceNotExistException = use('App/Exceptions/ResourceNotExistException');

class AuthorizationService{

    /**
     * verify if user has permission to handle this resource
     */
    verifyPermission(resource, user, allowRoles, allowSelf){

        //throw a ResourceNotExistException if resource do not exist
        this.verifyExistance(resource,'resource');

        //if not allow self update or resource owner is not current user, do a role check
        if(!resource || !allowSelf || resource.user_id != user.id){
            //if role was defined, throw a InvalidAccessException if the current user's role is not contained in allowed roles list
            if(allowRoles && allowRoles.length > 0 && allowRoles.indexOf(user.role)==-1){
                throw new InvalidAccessException('resource');
            }
        }
    }

    /**
     * verify if user is the owner of the message
     */
    verifyMessageOwnership(message, owner){

        //throw a ResourceNotExistException if resource do not exist
        this.verifyExistance(message, 'message');
        if(message.receiverEmail !== owner.email){
            throw new InvalidAccessException('message');
        }
    }


    /**
     * verify if user has permission to view the entire list
     */
    verifyRole(user, allowRoles){
        //if role was defined, throw a InvalidAccessException if the current user's role is not contained in allowed roles list
        if(allowRoles && allowRoles.length > 0 && allowRoles.indexOf(user.role)==-1){
            throw new InvalidAccessException('resource');
        }
    }

    verifyPermissionForUser(targetUser, user, allowRoles, allowSelf){

        //throw a ResourceNotExistException if targetUser do not exist
        this.verifyExistance(targetUser,'user');
        
        // allow developer to ignore this rule
        if(!user.isDev){
            //if not allow self update or target is not current user, do a role check
            if(!allowSelf || targetUser.id != user.id){
                //throw a InvalidAccessException if the current user's role is not in allowed roles list 
                if(allowRoles.indexOf(user.role)==-1){
                    throw new InvalidAccessException('user');
                }
            }
        }
    }

    verifyPermissionForDeleteUser(targetUser, user, allowRoles){
        //throw a ResourceNotExistException if targetUser do not exist
        this.verifyExistance(targetUser,'user');

        if (targetUser.id == user.id){
            throw new InvalidAccessException("user due to self deleting");
        }
        else if(targetUser.isDev){
            throw new InvalidAccessException("user due to the user is a developer");
        }
        else if(!user.isDev){
            //throw a InvalidAccessException if the current user's role is not in allowed roles list 
            //or target user's role is in allowed roles list
            if(allowRoles.indexOf(targetUser.role)!=-1  || allowRoles.indexOf(user.role)==-1){
                throw new InvalidAccessException('user');
            }
        }
    }

    //verify if resource exists
    verifyExistance(resource,message){
        if(!resource){
            throw new ResourceNotExistException(message);
        }
    }    

}

module.exports = new AuthorizationService();