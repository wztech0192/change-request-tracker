'use strict';

/**
 * @author Wei Zheng
 * @description service used to send and handle all insite messages
 */

const Message = use('App/Models/Message');

class MessageService {
  /**
   * Create new message for all receivers
   * @return {Message[]}
   * @param {String[]} receiverList array of receiver email
   */
  async createMultiMessage(receiverList) {
    for (let receiveData of receiverList) {
      if ((await Message.isValidate(receiveData)) === 'pass') {
        Message.create(receiveData);
      }
    }

    return receiverList;
  }

  /**
   * Update Message
   * @return {Message}
   * @param {int} id  message id
   * @param {Object} data {'isRead', 'isArchived', 'isBookmark'}
   * @param {User} user current user
   */
  async updateMessage(id, data, user) {
    var message = await Message.find(id);
    if (!message || message.receiverEmail !== user.email) return null;
    message.merge(data);
    await message.save();

    return message;
  }

  /**
   * Get message detail
   * @return {Message}
   * @param {User} user Current User
   * @param {int} id Message id
   */
  getMessage(user, id) {
    return Message.queryForFirst(user, id);
  }

  /**
   * Get message list by type. Inbox, sent, or archived
   * @return {Message[]}
   * @param {User} user current user
   * @param {Object} filter filter data
   */
  async getMessageList(user, filter) {
    const list = await Message.queryForList(user, filter);
    //calculate page start and page end
    const pageMax = filter.page * filter.limit;
    list.pages.end = pageMax > list.pages.total ? list.pages.total : pageMax;
    list.pages.start = pageMax + 1 - filter.limit;

    return list;
  }

  /**
   * clear new messages
   * @return {Message[]}
   * @param {User} user current user
   */
  clearNewMessages(user) {
    return Message.queryToClearNew(user);
  }

  /**
   * archive message
   * @return {Message[]}
   * @param {User} user current user
   * @param {Objecct} data {'list', 'isArchived'}
   */
  archiveMessage(user, data) {
    if (!data.list || data.list.length <= 0) {
      return null;
    }

    return Message.queryToArchive(user, data);
  }

  /**
   * get unread and bookmarked messages
   * @returns {Message[], Message[], int}
   * @param {User} user current user
   */
  async getMenuMsgList(user) {
    const unread = await Message.queryForUnreadList(user);
    const bookmark = await Message.queryForBookMarkList(user);
    const totalMsg = await Message.queryForTotalActive(user);

    return {
      unread,
      bookmark,
      totalMsg
    };
  }
}

module.exports = MessageService;
