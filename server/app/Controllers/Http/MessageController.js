'use strict'

/**
 * @author Wei Zheng
 * @description create, read, upload, and delete messages
 */

const Message = use('App/Models/Message')
const AuthorizationService = use('App/Service/AuthorizationService')
const CrudHelper = use('App/Helper/CrudHelper');
const Database = use('Database');

class MessageController {

    /**
     * Create new message 
     */
    async createMessage({auth, request}){
        const data= request.only(['title','content','receiverEmail'])
        return CrudHelper.create(auth, Message, {
            work: async (message, user) => {
                data.senderEmail = user.email;
                data.senderName = `${user.first_name} ${user.last_name}`
                message.fill(data);
                await message.save();
            }
        });
    }

    /**
     * Create new message 
     */
    async _createMessage(data){
        var message = new Message();
        message.fill(data);
        await message.save();
    }

    /**
     * Get message list belongs to the user
     */
    async getMessage({auth}){
        const user= await auth.getUser();
        const messages = await Database
        .table('messages')
        .where('senderEmail', user.email)
        .orderBy('created_at', 'asc')
        return messages
    }

    /**
     * delete target
     * @returns {message}
     */
    async deleteMessage({auth, params}){
        return CrudHelper.destroy(auth, params, Message, {
            verify:(user, message)=>AuthorizationService.verifyMessageOwnership(message, user) 
        });
    }


    /**
     * update target 
     * @returns {message}
     */
    async updateMessage({auth, request, params}){
        return CrudHelper.update(auth, params, Message, {  
            verify:(user, message)=>AuthorizationService.verifyMessageOwnership(message, user) ,
            work: (message) => message.merge(request.only(['isRead','isArchived']))
        });
    }

}

module.exports = MessageController