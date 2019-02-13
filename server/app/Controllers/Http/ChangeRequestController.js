'use strict'

/**
 * @author Wei Zheng
 * @description create, read, update, and delete for change requests
 */


const ChangeRequest = use('App/Models/ChangeRequest/ChangeRequest')
const User=use('App/Models/User');
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
     * Get change request list by filter
     * @returns {ChangeRequest[]}
     */
    async getRequestList({auth, request}){
        
        const user= await auth.getUser();
        AuthorizationService.verifyRole(user, ['Developer','Admin'])
        const filter = request.all();
    //    console.log(filter);
        //filter by type
        if(filter.method === "tab"){
            switch(filter.tab){
            case "all":
                return await ChangeRequest.all();
            case "active":
                //return all change request except the one with cancelled status
                return await ChangeRequest.query().whereNot('status', 'Cancelled').fetch();
            default:
                return await ChangeRequest.query().where('status', filter.tab).fetch();
            }
        }
        else{
            //fiter by search input
        }
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

        let {message, client} = request.only(['message', 'client']);
        const user=await auth.getUser();
        //get client if current user is a admin. Else client is current user.
        if(user.role === "Admin" || user.role === "Developer"){
            client = await User.find(client);
            if(!client){
                throw new Exception("Something is wrong"); 
            }
        }else{
            client = user;
        }
        
        const changeRequest=new ChangeRequest();
        data.totalMessage = 0;
        data.totalHistory = 0;
        data.clientName = `${client.first_name} ${client.mid_initial||""} ${client.last_name}`
        //fill in data then save to its creator
        changeRequest.fill(data);  
        
        await client.change_requests().save(changeRequest);
     
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
            changeRequest.totalMessage++;
        }  
        //create change request history
        this._createCRHistory(changeRequest, 
            'Create',
            `Change Request ID ${changeRequest.id} has been posted by ${user.first_name+" "+user.last_name} in ${changeRequest.created_at}`
            );

        return changeRequest;
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
        const requestData = request.only(['title','details','status']);
        return CrudService.update(auth, params, ChangeRequest, {
            verify: (user, changeRequest) => (AuthorizationService.verifyPermission(changeRequest, user, ['Developer','Admin'], true)),
            work: (changeRequest) => changeRequest.merge(requestData),
            after: (changeRequest, user) =>{
                
            let type, content;
            // history for status update
            if(requestData.status){
                type =`New Status: ${requestData.status.toUpperCase()}`;
                content = `The status has been updated to ${requestData.status.toUpperCase()} by ${user.first_name+" "+user.last_name}`
            }
            else{
                //history for content modify
                type = 'Edit Content';
                content = `Change Request Content has been modified by ${user.first_name+" "+user.last_name}`
            }
            //create change request history
            this._createCRHistory(changeRequest, type, content);
            }
        });
    }

    /**
     * Get all messages belongs to this change request
     * @returns {ChangeRequestMessage[]}
     */
    async getCRMessage({auth, params}){
        const user= await auth.getUser();
        const changeRequest = await ChangeRequest.find(params.id);
        AuthorizationService.verifyPermission(changeRequest, user, ['Developer','Admin'], true);
        const message = await ChangeRequestMessage.query()
        .where('change_request_id', changeRequest.id)
        .orderBy('created_at', 'desc')
        .limit(params.num).fetch();
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
                data.senderEmail= user.email;
                data.senderName= user.first_name+" "+user.last_name;
                message.fill(data);  
                await change_request.messages().save(message);
                change_request.totalMessage++;
                change_request.save();
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
    _createCRHistory(changeRequest, type, content){
        var crHistory = new ChangeRequestHistory();
        crHistory.fill({ type, content });
        changeRequest.histories().save(crHistory);
        changeRequest.totalHistory++;
        changeRequest.save();
    }

    /**
     * Get all histories belongs to this change request
     * @returns {ChangeRequestMessage[]}
     */
    async getCRHistory({auth, params}){
        const user= await auth.getUser();
        const changeRequest = await ChangeRequest.find(params.id);
        AuthorizationService.verifyPermission(changeRequest, user, ['Developer','Admin'], true);
        let histories = await ChangeRequestHistory.query()
            .where('change_request_id', changeRequest.id)
            .orderBy('created_at', 'desc').fetch();
        return histories;
    }

    /**
     * Adjust change request data, for dev
     */
    async adjustChangeRequest({auth}){
        const user= await auth.getUser();
        AuthorizationService.verifyRole(user, ['Developer']);
        const CRList = await ChangeRequest.all();
    
        for ( let cr of CRList.rows){
            cr.totalHistory = await cr.histories().getCount();
            cr.totalMessage = await cr.messages().getCount();
            let client = await cr.user().fetch();
            cr.clientName = `${client.first_name} ${client.mid_initial||""} ${client.last_name}`
            cr.save();
        }
    }

}

module.exports = ChangeRequestController
