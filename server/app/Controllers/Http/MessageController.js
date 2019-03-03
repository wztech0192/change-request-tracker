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
    const { receiver, title, content } = request.only([
      'receiver',
      'title',
      'content'
    ]);

    const receiverList = new Array(receiver.length).fill().map((a, i) => ({
      receiverEmail: receiver[i].substring(
        receiver[i].indexOf('(') + 1,
        receiver[i].lastIndexOf(')')
      ),
      senderEmail: user.email,
      senderName: user.full_name,
      title: title,
      content: content
    }));
    const { isReply } = request.only('isReply');

    for (let rl of receiverList) {
      AuthorizationService.validateMessage(rl);
      if (isReply) {
        await MessageService.createMessage(rl);
      } else {
        await MessageService.createReplyMessage(rl);
      }
    }

    return receiverList;
  }

  /**
   * Get message detail
   */
  async getMessage({ auth, params }) {
    const user = await auth.getUser();
    const message = await Message.query()
      .where('senderEmail', user.email)
      .andWhere('id', params.id)
      .fetch();

    AuthorizationService.verifyExistance(message.rows[0], 'message');
    return message.rows[0];
  }

  /**
   * Get message list by type. Inbox, sent, or archived
   */
  async getMessageList({ auth, request }) {
    const user = await auth.getUser();
    const { type, page, limit, search } = request.all();

    // const search = `%${table.search.value}%`;
    const messages = await Message.query()
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
        this.where('id', 'like', `%${search}%`)
          .orWhere('senderEmail', 'like', `%${search || ''}%`)
          .orWhere('senderName', 'like', `%${search || ''}%`)
          .orWhere('receiverEmail', 'like', `%${search || ''}%`)
          .orWhere('title', 'like', `%${search || ''}%`)
          .orWhere('created_at', 'like', `%${search || ''}%`)
          .orWhere(
            'isStar',
            'like',
            `%${
              search ? (search.toLowerCase().includes('star') ? 1 : -1) : ''
            }%`
          );
      })
      .orderBy('created_at', 'desc')
      .paginate(page, limit);

    const pageMax = page * limit;
    messages.pages.end =
      pageMax > messages.pages.total ? messages.pages.total : pageMax;
    messages.pages.start = pageMax + 1 - limit;
    // console.log(messages);
    return messages;
  }

  /**
   * delete target
   * @returns {message}
   */
  async deleteMessage({ auth, params }) {
    return CrudService.destroy(auth, params, Message, {
      verify: (user, message) =>
        AuthorizationService.verifyMessageOwnership(message, user)
    });
  }

  /**
   * update target
   * @returns {message}
   */
  async updateMessage({ auth, request, params }) {
    return CrudService.update(auth, params, Message, {
      verify: (user, message) =>
        AuthorizationService.verifyMessageOwnership(message, user),
      work: message =>
        message.merge(request.only(['isRead', 'isArchived', 'isStar']))
    });
  }

  /**
   * archive message
   */
  async archiveMessage({ auth, request }) {
    const user = await auth.getUser();
    const { list, isArchived } = request.only(['list', 'isArchived']);

    if (!list || list.length <= 0) {
      throw Exception('Empty List');
    }

    const mail = await Message.query()
      .where('receiverEmail', user.email)
      .whereIn('id', list)
      .update({ isArchived });
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
    MessageService.createRequestFromMail(content, sender);
  }
}

module.exports = MessageController;
