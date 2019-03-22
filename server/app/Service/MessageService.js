'use strict';

/**
 * @author Wei Zheng
 * @description message service used to send email and handle insite messages
 */

const Message = use('App/Models/Message');

class MessageService {
  /**
   * Create new message
   */
  async createMultiMessage(receiverList) {
    for (let receiveData of receiverList) {
      if ((await Message.isValidate(receiveData)) === 'pass') {
        await Message.create(receiveData);
      }
    }
    return receiverList;
  }

  /**
   * Update Message
   */
  async updateMessage(id, request) {
    var message = await Message.find(id);
    if (!message) return null;
    var data = request.only(['isRead', 'isArchived', 'isBookmark']);
    message.merge(data);
    return await message.save();
  }

  /**
   * Get message detail
   */
  async getMessage(user, id) {
    return await Message.queryFirst(user, id);
  }

  /**
   * Get message list by type. Inbox, sent, or archived
   */
  async getMessageList(user, request) {
    const filter = request.all();
    const list = await Message.queryList(user, filter);

    //calculate page start and page end
    const pageMax = filter.page * filter.limit;
    list.pages.end = pageMax > list.pages.total ? list.pages.total : pageMax;
    list.pages.start = pageMax + 1 - filter.limit;
    return list;
  }

  /**
   * clear new messages
   */
  async clearNewMessages(user) {
    return await Message.queryClearNew(user);
  }

  /**
   * archive message
   */
  async archiveMessage(user, request) {
    const data = request.only(['list', 'isArchived']);
    if (!data.list || data.list.length <= 0) {
      return null;
    }

    return await Message.queryArchive(user, data);
  }

  /**
   * get unread and bookmarked messages
   * @returns {array}
   */
  async getMenuMsgList(user) {
    const unread = await Message.queryUnreadList(user);
    const bookmark = await Message.queryBookMarkList(user);
    const totalMsg = await Message.queryTotalActive(user);
    return {
      unread,
      bookmark,
      totalMsg
    };
  }
}

module.exports = MessageService;
