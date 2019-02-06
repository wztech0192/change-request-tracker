'use strict'

/**
 * @author Wei Zheng
 * @description create, read, update, and delete for change requests
 */


const ChangeRequest = use('App/Models/ChangeRequest/ChangeRequest')
const ChangeRequestMessage = use('App/Models/ChangeRequest/ChangeRequestMessage')
const ChangeRequestHistory = use('App/Models/ChangeRequest/ChangeRequestHistory')
const AuthorizationService = use('App/Service/AuthorizationService')
const CrudService = use('App/Service/CrudService');

class ChangeRequestController {

    /**
     * display change request detail
     * @returns {ChangeRequest}
     */
    async detail({auth, params}){
        const user= await auth.getUser();
        const changeRequest = await ChangeRequest.find(params.id);

        //only allow dev, admin, and request submitter to receive the data
        AuthorizationService.verifyPermission(changeRequest, user, ['Developer','Admin'], true) 

        //set request message and history
        changeRequest.messages = await changeRequest.messages().fetch();
        changeRequest.history = await changeRequest.history().fetch();
        changeRequest.client = await changeRequest.user().fetch();
        return changeRequest;
    }


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

        //throw error if title or details is empty
        if(!data.title || !data.details){
            throw new Exception("Something is wrong"); 
        }

        let {message} = request.only(['message']);
        return await CrudService.create(auth, ChangeRequest, {
            work: async (changeRequest, user)=>{
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
                        content : `<p>${message}</p>`,
                        user_id : user.id,
                        senderEmail: user.email,
                        senderName: user.first_name+" "+user.last_name
                    });
                    changeRequest.messages().save(crmsg);
                }

                //create change request history
                this._createCRHistory(changeRequest, 
                    `Change Request ID ${changeRequest.id} has been posted by ${user.first_name+" "+user.last_name} in ${changeRequest.created_at}`
                );
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
     * @returns {ChangeRequestMessage[]}
     */
    async getCRMessage({auth, params}){
        const user= await auth.getUser();
        const message = await ChangeRequestMessage.find(params.id);
        AuthorizationService.verifyPermission(message, user, ['Developer','Admin'], true);
        return message;
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
     * @returns {ChangeRequestMessage}
     */
    async destroyCRMessage({auth, params}){
        return CrudService.destroy(auth, params, ChangeRequestMessage, {
            verify: (user, message) => AuthorizationService.verifyPermission(message, user, ['Developer','Admin'], true) 
        });
    }


    /**
     * delete target change request message
     * @returns {ChangeRequestMessage}
     */
    async updateCRMessage({auth, request, params}){
        return CrudService.update(auth, params, ChangeRequestMessage, {
            verify: (user, message) => (AuthorizationService.verifyPermission(message, user, ['Developer','Admin'], true)),
            work: (message) => message.merge(request.only('content'))
        });
    }

    /**
     * private method to save history of change request
     */
    _createCRHistory(changeRequest, content){
        var crHistory = new ChangeRequestHistory();
        crHistory.fill({ content });
        changeRequest.history().save(crHistory);
    }

}

module.exports = ChangeRequestController
