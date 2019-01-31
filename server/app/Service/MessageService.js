'use strict'

/**
 * @author Wei Zheng
 * @description message method used across multiple controllers
 */

const Message = use('App/Models/Message')
const AuthorizationService = use('App/Service/AuthorizationService')
const CrudService = use('App/Service/CrudService');
const Database = use('Database');


class MessageService{

    /**
     * Create new message 
     * @returns {message}
     */
    async createMessage(msgData){
        var message = new Message();
        message.fill(msgData);
        await message.save();
        return message;
    }

    /**
     * delete message
     * @returns {message}
     */
    async deleteMessage(auth, params){
        return CrudService.destroy(auth, params, Message, {
            verify:(user, message)=>AuthorizationService.verifyMessageOwnership(message, user) 
        });
    }

    //create a message for Registration code
    async addRegistrationCodeMessage(code, receiver){ 
        const data={
            content : code.content,
            receiverEmail : receiver.email,
            senderEmail : code.creator_email,
            senderName : code.creator_name,
            title: "Welcome to CRTracker!"
        }
        return await this.createMessage(data);
    }
    
}

module.exports = new MessageService();