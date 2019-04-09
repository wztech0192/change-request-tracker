'use strict';

/**
 * @author Wei Zheng
 * @description This controller serves as the entry & exist point to all message related data.
 *              The controller uses MessageService to provide read, add, update, as well as
 *              other message related features.
 */

const VerificationHelper = use('App/Helper/VerificationHelper');
const MessageService = use('App/Service/MessageService');
const MapHelper = use('App/Helper/MapHelper');

class MessageController {
  /**
   * Delclare service used in this controller
   */
  constructor() {
    this.messageService = new MessageService();
  }

  /**
   * Create new message to all receivers
   * @return {Message[]}
   */
  async createMessage({ auth, request, response }) {
    const user = await auth.getUser();
    // map receive list data
    try {
      const receiverList = MapHelper.mapReceiveData(user, request);
      if (receiverList.length > 0) {
        const result = await this.messageService.createMultiMessage(
          receiverList
        );
        return result;
      }
    } catch (e) {}
    return response.status(406).send('Wrong Format');
  }

  /**
   * Get message detail
   * @return {Message}
   */
  async getMessage({ auth, params }) {
    const user = await auth.getUser();

    const message = await this.messageService.getMessage(user, params.id);

    VerificationHelper.verifyExistance(message, 'message');
    return message;
  }

  /**
   * Get message list by type. Inbox, sent, or archived
   * @return {Message[]}
   */
  async getMessageList({ auth, request }) {
    const user = await auth.getUser();
    const filter = request.all();
    const result = await this.messageService.getMessageList(user, filter);

    return result;
  }

  /**
   * clear new messages
   * @returns {Message[]}
   */
  async clearNewMessages({ auth }) {
    const user = await auth.getUser();
    const result = await this.messageService.clearNewMessages(user);
    return result;
  }

  /**
   * archive message
   * @returns {Message[]}
   */
  async archiveMessage({ auth, request }) {
    const user = await auth.getUser();
    const data = request.only(['list', 'isArchived']);
    const result = await this.messageService.archiveMessage(user, data);
    return result;
  }
  /**
   * update target
   * @returns {Message}
   */
  async updateMessage({ auth, request, params }) {
    const user = await auth.getUser();
    var data = request.only(['isRead', 'isArchived', 'isBookmark']);
    var message = await this.messageService.updateMessage(
      params.id,
      data,
      user
    );
    VerificationHelper.verifyExistance(message, ' message');
    return message;
  }
}

module.exports = MessageController;
