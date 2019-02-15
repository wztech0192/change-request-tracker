'use strict';

/**
 * @author Wei Zheng
 * @description create, read, upload, and delete messages
 */

const Message = use('App/Models/Message');
const AuthorizationService = use('App/Service/AuthorizationService');
const MessageService = use('App/Service/MessageService');
const CrudService = use('App/Service/CrudService');
const Database = use('Database');

class MessageController {
  /**
   * Create new message
   */
  async createMessage({ auth, request }) {
    const user = await auth.getUser();
    const data = request.only(['title', 'content', 'receiverEmail']);
    data.senderEmail = user.email;
    data.senderName = `${user.first_name} ${user.last_name}`;
    return MessageService.createMessage(data);
  }

  /**
   * Get message list belongs to the user
   */
  async getMessage({ auth }) {
    const user = await auth.getUser();
    const messages = await Database.table('messages')
      .where('senderEmail', user.email)
      .orderBy('created_at', 'asc');
    return messages;
  }

  /**
   * delete target
   * @returns {message}
   */
  async deleteMessage({ auth, params }) {
    return MessageService.deleteMessage(auth, params);
  }

  /**
   * update target
   * @returns {message}
   */
  async updateMessage({ auth, request, params }) {
    return CrudService.update(auth, params, Message, {
      verify: (user, message) =>
        AuthorizationService.verifyMessageOwnership(message, user),
      work: message => message.merge(request.only(['isRead', 'isArchived']))
    });
  }
}

module.exports = MessageController;
