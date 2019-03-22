'use strict';

/**
 * @author Wei Zheng
 * @description repositary used to store some complicated query involved Message Model
 */

const Message = use('App/Models/Message');

class MessageRepo {
  //query for the first matching message
  async queryMsg() {
    return await Message.query({ email }, id)
      .where('senderEmail', email)
      .andWhere('id', id)
      .first()
      .fetch();
  }

  //query message list by type: Inbox, sent, search, page, or archived
  async queryMsgList(user, { type, page, limit, search }) {
    const searchData = search || '';
    return await Message.query()
      .where(function() {
        switch (type) {
          case 'sent':
            this.where('senderEmail', user.email);
            break;
          case 'inbox':
            this.where('receiverEmail', user.email).andWhere(
              'isArchived',
              false
            );
            break;
          case 'archive':
            this.where('receiverEmail', user.email).andWhere(
              'isArchived',
              true
            );
            break;
        }
      })
      .where(function() {
        this.where('senderEmail', 'like', `%${searchData}%`)
          .orWhere(function() {
            const splitSearch = searchData.split(' ');
            for (let split of splitSearch) {
              // split the string and search each splitted item
              this.where('senderName', 'like', `%${split || 'N/A'}%`);
            }
          })
          .orWhere('receiverEmail', 'like', `%${searchData}%`)
          .orWhere('title', 'like', `%${searchData}%`)
          .orWhere('created_at', 'like', `%${searchData}%`)
          .orWhere(
            'isBookmark',
            `${
              searchData ? (search.toLowerCase().includes('mark') ? 1 : -1) : ''
            }`
          );
      })
      .orderBy('created_at', 'desc')
      .paginate(page, limit);
  }

  //clear all new message of the target
  async queryClearNew({ email }) {
    return await Message.query()
      .where('receiverEmail', email)
      .andWhere('isRead', false)
      .update({ isRead: true });
  }
}

module.exports = MessageRepo;
