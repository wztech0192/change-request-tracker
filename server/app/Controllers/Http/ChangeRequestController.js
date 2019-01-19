'use strict'

const Database = use('Database')
const ChangeRequest = use('App/Models/ChangeRequest')
const AuthorizationService = use('App/Service/AuthorizationService')

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
     * Create a change request that owns by current user
     * @returns {ChangeRequest}
     */
    async create({auth, request}){
        const user=await auth.getUser();
        const {title, details} = request.all();
        const changeRequest=new ChangeRequest();

        changeRequest.fill({title, details});
        await user.change_requests().save(changeRequest);
        
        return changeRequest;
    }

    /**
     * delete target change request
     * @returns {ChangeRequest}
     */
    async destroy({auth, params}){
        const user=await auth.getUser();
        const {id}=params;
        const changeRequest =await ChangeRequest.find(id);

        AuthorizationService.verifyPermission(changeRequest, user, ['Developer','Admin'])

        await changeRequest.delete();
        return changeRequest;
    }


    /**
     * delete target change request
     * @returns {ChangeRequest}
     */
    async update({auth, request, params}){
        const user=await auth.getUser();
        const {id}=params;
        const changeRequest =await ChangeRequest.find(id);

        AuthorizationService.verifyPermission(changeRequest, user, ['Developer','Admin'], true)
        
        changeRequest.merge(request.only(['title','details']));
        await changeRequest.save()
        return changeRequest;
    }

}

module.exports = ChangeRequestController
