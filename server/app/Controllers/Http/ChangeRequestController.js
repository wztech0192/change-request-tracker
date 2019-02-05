'use strict'

/**
 * @author Wei Zheng
 * @description create, read, update, and delete for change requests
 */


const ChangeRequest = use('App/Models/ChangeRequest')
const ChangeRequestMessage = use('App/Models/ChangeRequestMessage')
const AuthorizationService = use('App/Service/AuthorizationService')
const CrudService = use('App/Service/CrudService');

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
     * Get all change request
     * @returns {ChangeRequest[]}
     */
    async getAll({auth}){
        const user= await auth.getUser();
        return CrudService.getAll(ChangeRequest,{
            verify:()=>AuthorizationService.verifyRole(user, ['Developer','Admin'])
        });
    }

    /**
     * Create a change request
     * @returns {ChangeRequest}
     */
    async create({auth, request}){
        const data = request.only(['title','details']);
        let uid;

        //throw error if title or details is empty
        if(!data.title || !data.details){
            throw new Exception("Something is wrong"); 
        }

        let {message} = request.only(['message']);
        return await CrudService.create(auth, ChangeRequest, {
            work: async (changeRequest, user)=>{
                uid=user.id;
                //fill in data then save to its creator
                changeRequest.fill(data);  
                await user.change_requests().save(changeRequest);
            },
            after: (changeRequest, user) =>{
                //save change request message is message exist
                if(message){
                    // replace < and > to html code &#60; and &#62 for security
                    message = message.replace(/([\<])/g,'&#60;');
                    message = message.replace(/([\>])/g,'&#62');
                    var crmsg = new ChangeRequestMessage();
                    crmsg.fill({
                        content : message,
                        user_id : user.id
                    });
                    changeRequest.messages().save(crmsg);
                }
            }
        });        
    }

    /**
     * delete target change request
     * @returns {ChangeRequest}
     */
    async destroy({auth, params}){
        return CrudService.destroy(auth, params, ChangeRequest, {
            verify: (user, changeRequest) => AuthorizationService.verifyPermission(changeRequest, user, ['Developer','Admin']) 
        });
    }


    /**
     * delete target change request
     * @returns {ChangeRequest}
     */
    async update({auth, request, params}){
        return CrudService.update(auth, params, ChangeRequest, {
            verify: (user, changeRequest) => (AuthorizationService.verifyPermission(changeRequest, user, ['Developer','Admin'], true)),
            work: (changeRequest) => changeRequest.merge(request.only(['title','details']))
        });
    }

    /**
     * Get all messages belongs to this change request
     * @returns {ChangeRequest[]}
     */
    async getCRMessages({auth, params}){
        const user= await auth.getUser();
        const change_request = await ChangeRequest.find(params.id);
        AuthorizationService.verifyPermission(change_request, user, ['Developer','Admin'], true);
        return await change_request.messages().fetch();

    }

    /**
     * Create a change request message
     * @returns {ChangeRequest}
     */
    async createCRMessage({auth, request, params}){
        const data = request.only('content');
        const change_request = await ChangeRequest.find(params.id);

        return await CrudService.create(auth, ChangeRequestMessage, {
            verify: (user) => AuthorizationService.verifyPermission(change_request, user, ['Developer','Admin'], true),
            work: async (message, user)=>{
                //fill in data then save to its owner
                data.user_id = user.id;
                message.fill(data);  
                await change_request.messages().save(message);
            }
        });
    }

    /**
     * delete target change request message
     * @returns {ChangeRequest}
     */
    async destroyCRMessage({auth, params}){
        return CrudService.destroy(auth, params, ChangeRequestMessage, {
            verify: (user, message) => AuthorizationService.verifyPermission(message, user, ['Developer','Admin'], true) 
        });
    }


    /**
     * delete target change request message
     * @returns {ChangeRequest}
     */
    async updateCRMessage({auth, request, params}){
        return CrudService.update(auth, params, ChangeRequestMessage, {
            verify: (user, message) => (AuthorizationService.verifyPermission(message, user, ['Developer','Admin'], true)),
            work: (message) => message.merge(request.only('content'))
        });
    }

}

module.exports = ChangeRequestController
