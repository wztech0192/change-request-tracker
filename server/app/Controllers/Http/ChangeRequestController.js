'use strict'


const ChangeRequest = use('App/Models/ChangeRequest')
const AuthorizationService = use('App/Service/AuthorizationService')
const CrudHelper = use('App/Helper/CrudHelper');

class ChangeRequestController {

    /**
     * Get all change request belongs to this user
     * @returns {ChangeRequest[]}
     */
    async index({auth}){
        const user= await auth.getUser();
        return user.change_requests().fetch();
    }
    
    /**
     * Get all change request belongs to this user
     * @returns {ChangeRequest[]}
     */
    async getAll({auth}){
        const user= await auth.getUser();
        return CrudHelper.getAll('change_requests',{
            verify:()=>AuthorizationService.verifyRole(user, ['Developer','Admin'])
        });
    }

    /**
     * Create a change request that owns by current user
     * @returns {ChangeRequest}
     */
    async create({auth, request}){
        const {title, details} = request.all();
        return CrudHelper.create(auth, ChangeRequest, {
            work: async (user, changeRequest)=>{
                //fill in data then save to its creator
                changeRequest.fill({title, details});  
                await user.change_requests().save(changeRequest);
            }
        });
    }

    /**
     * delete target change request
     * @returns {ChangeRequest}
     */
    async destroy({auth, params}){
        return CrudHelper.destroy(auth, params, ChangeRequest, {
            verify: (user, changeRequest) => AuthorizationService.verifyPermission(changeRequest, user, ['Developer','Admin']) 
        });
    }


    /**
     * delete target change request
     * @returns {ChangeRequest}
     */
    async update({auth, request, params}){
        return CrudHelper.update(auth, params, ChangeRequest, {
            verify: (user, changeRequest) => (AuthorizationService.verifyPermission(changeRequest, user, ['Developer','Admin'], true)),
            work: (changeRequest) => changeRequest.merge(request.only(['title','details']))
        });
    }

}

module.exports = ChangeRequestController
