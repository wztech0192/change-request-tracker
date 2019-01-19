'use strict'

const InvalidAccessException = use('App/Exceptions/InvalidAccessException');
const ResourceNotExistException = use('App/Exceptions/ResourceNotExistException');

class AuthorizationService{

    /**
     * verify if user has permission to handle this resource
     */
    verifyPermission(resource, user, allowRoles, allowSelf){

        //throw a ResourceNotExistException if resource do not exist
        if(!resource){
            throw new ResourceNotExistException();
        }

        //if not allow self update or resource owner is not current user, do a role check
        if(!allowSelf || resource.user_id != user.id){
            //if role was defined, throw a InvalidAccessException if the current user's role is not contained in allowed roles list
            if(allowRoles && allowRoles.length > 0 && allowRoles.indexOf(user.role)==-1){
                throw new InvalidAccessException();
            }
        }
    }

    verifyPermissionForUser(targetUser, user, allowRoles, allowSelf){

        //throw a ResourceNotExistException if targetUser do not exist
        if(!targetUser){
            throw new ResourceNotExistException();
        }
        
        if(user.isDev){
            //if not allow self update or target is not current user, do a role check
            if(!allowSelf || targetUser.id != user.id){
                //throw a InvalidAccessException if the current user's role is not in allowed roles list 
                //or target user's role is in allowed roles list
                if(allowRoles.indexOf(targetUser.role)!=-1  || allowRoles.indexOf(user.role)==-1){
                    throw new InvalidAccessException();
                }
            }
        }
    }
}

module.exports = new AuthorizationService();