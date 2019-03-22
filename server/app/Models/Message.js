'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Validator = use('Validator');

class Message extends Model {
  /**
   * set require rules for validator
   */
  static get messageRules() {
    return {
      receiverEmail: 'required|email',
      title: 'required',
      content: 'required'
    };
  }

  /**
   * validate message
   */
  static async isValidate(msgInfo) {
    const validation = await Validator.validateAll(msgInfo, this.messageRules);

    if (validation.fails()) {
      return validation.messages();
    } else {
      return 'pass';
    }
  }

  //query for the first matching message
  static async queryFirst() {
    return await this.queryFirst({ email }, id)
      .where('senderEmail', email)
      .andWhere('id', id)
      .first()
      .fetch();
  }

  //query message list by type: Inbox, sent, search, page, or archived
  static async queryList(user, { type, page, limit, search }) {
    const searchData = search || '';
    return await this.query()
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
  static async queryClearNew({ email }) {
    return await this.query()
      .where('receiverEmail', email)
      .andWhere('isRead', false)
      .update({ isRead: true });
  }

  //archive or un-archive the selected list
  static async queryArchive(user, { list, isArchived }) {
    return await this.query()
      .where('receiverEmail', user.email)
      .whereIn('id', list)
      .update({ isArchived });
  }

  //get unread message list of the user
  static async queryUnreadList(user) {
    return await this.query()
      .where('receiverEmail', user.email)
      .andWhere('isRead', false)
      .orderBy('created_at', 'desc')
      .fetch();
  }

  //get bookmarked message list of the user
  static async queryBookMarkList(user) {
    return await this.query()
      .where('receiverEmail', user.email)
      .andWhere('isBookmark', true)
      .orderBy('created_at', 'desc')
      .fetch();
  }

  //get total number of active message
  static async queryTotalActive(user) {
    return await this.query()
      .where('receiverEmail', user.email)
      .where('isArchived', false)
      .getCount();
  }
}

module.exports = Message;
