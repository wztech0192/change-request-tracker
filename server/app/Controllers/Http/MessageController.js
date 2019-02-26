'use strict';

/**
 * @author Wei Zheng
 * @description create, read, upload, and delete messages
 */

const Message = use('App/Models/Message');
const AuthorizationService = use('App/Service/AuthorizationService');
const MailService = use('App/Service/MailService');
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
    data.senderName = user.full_name;
    return MailService.createMessage(data);
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
    return MailService.deleteMessage(auth, params);
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

  /**
   * retrieve change request submission from mailgun store
   */
  async _retrieveMailRequest({ request }) {
    const content = request.only(['title', 'detail']);
    const { sender } = request.only('from');
    // validate title and detial is not empty
    if (!content.title || !content.detail) {
      throw new Exception('Title and Detail must no be empty');
    }

    //get user and verify
    sender = await User.findBy('email', sender);
    AuthorizationService.verifyExistance(sender, ' user.');

    //create change request
    MailService.createRequestFromMail(content, sender);
  }
}

module.exports = MessageController;
