'use strict';

/**
 * @author Wei Zheng
 * @description create, read, upload, and delete messages
 */

const VerificationHelper = use('App/Helper/VerificationHelper');
const MessageService = use('App/Service/MessageService');
const MapHelper = use('App/Helper/MapHelper');

class MessageController {
  constructor() {
    this.messageService = new MessageService();
  }

  /**
   * Create new message
   */
  async createMessage({ auth, request }) {
    const user = await auth.getUser();
    // map receive list data
    const receiverList = MapHelper.mapReceiveData(user, request);
    const result = await this.messageService.createMultiMessage(receiverList);
    return result;
  }

  /**
   * Get message detail
   */
  async getMessage({ auth, params }) {
    const user = await auth.getUser();
    const message = await this.messageService.getMessage(user, params.id);
    VerificationHelper.verifyExistance(message, 'message');
    return message;
  }

  /**
   * Get message list by type. Inbox, sent, or archived
   */
  async getMessageList({ auth, request }) {
    const user = await auth.getUser();
    const result = await this.messageService.getMessageList(user, request);
    return result;
  }

  /**
   * clear new messages
   * @returns {String}
   */
  async clearNewMessages({ auth }) {
    const user = await auth.getUser();
    const result = await this.messageService.clearNewMessages(user);
    return result;
  }

  /**
   * archive message
   */
  async archiveMessage({ auth, request }) {
    const user = await auth.getUser();
    const result = await this.messageService.archiveMessage(user, request);
    return result;
  }
  /**
   * update target
   * @returns {message}
   */
  async updateMessage({ auth, request, params }) {
    var message = await this.messageService.updateMessage(params.id, request);
    VerificationHelper.verifyExistance(message);
    return message;
  }

  /**
   * get unread and bookmarked messages
   * @returns {array}
   */
  async getMenuMsgList({ auth }) {
    const user = await auth.getUser();
    const result = await this.messageService.getMenuMsgList(user);
    return result;
  }
}

module.exports = MessageController;
