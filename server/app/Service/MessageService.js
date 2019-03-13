'use strict';

/**
 * @author Wei Zheng
 * @description message service used to send email and handle insite messages
 */

const Message = use('App/Models/Message');
const Mail = use('Mail');
const url =
  process.env.NODE_ENV === 'production'
    ? 'http://129.252.199.132/~weiZ/crt/public'
    : 'http://localhost:8080';
const noReplyEmail = 'no-reply@rsicrt.com';
const submitEmail = 'submit-request@rsicrt.com';
const infoEmail = 'cr-track@rsicrt.com';

class MessageService {
  /**
   * return notification list
   * @return {String}
   */
  static async clearNewMessages(user) {
    await Message.query()
      .where('receiverEmail', user.email)
      .andWhere('isRead', false)
      .update({ isRead: true });

    return 'ok';
  }

  /**
   * get unread and bookmarked messages
   * @returns {array}
   */
  static async getMenuMsgList(user) {
    const unread = await Message.query()
      .where('receiverEmail', user.email)
      .andWhere('isRead', false)
      .orderBy('created_at', 'desc')
      .fetch();
    const bookmark = await Message.query()
      .where('receiverEmail', user.email)
      .andWhere('isBookmark', true)
      .orderBy('created_at', 'desc')
      .fetch();

    const totalMsg = await Message.query()
      .where('receiverEmail', user.email)
      .where('isArchived', false)
      .getCount();

    return {
      unread,
      bookmark,
      totalMsg
    };
  }

  /**
   * Create new message
   * @returns {message}
   */
  static async createMessage(msgData) {
    var message = new Message();
    message.fill(msgData);
    await message.save();
    return message;
  }

  /**
   * Create reply message
   * @returns {message}
   */
  static async createReplyMessage(msgData) {
    var message = new Message();
    message.fill(msgData);
    await message.save();
    return message;
  }

  // check if the request email and user is valid. Return denied message if fails.
  static requestMailDenied(client, mailJSON) {
    if (!client || !mailJSON['subject'] || !mailJSON['body-plain']) {
      this._sendEmail(
        mailJSON['sender'],
        'Submission Denied',
        '<p>You do not have a client account in our system. Please contact the admin to register a client account.</p>'
      );
      return true;
    }
    return false;
  }

  // return submission approved message
  static requestMailApproved(receiver, crID) {
    //send a success message
    this._sendEmail(
      receiver,
      'Submission Success!',
      `<p>Your change request has been received! The Request ID is <b>${crID}</b>.
      <br>
      You can track your status by:
      <ol>
      <li>
      visiting the CRTracker website <a href="${url}/change-request/${crID}/content"><b>${url}/change-request/${crID}/content</b></a>
      </li>
      <li>
      send a email to <a href='mailto:${infoEmail}'><b>${infoEmail}</b></a> with subject:
      <ul>
      <li>
      <b><i>'track'</i></b> to track the newest 10 change request.
      </li>
       <li>
        <b><i>'${crID}'</i></b> to track individual change request.
      </li>
      </ul>
      </li>
      </ol>
      </p>`
    );
  }

  // send change request list to requester by email
  static trackCRList(receiver, crList) {
    let table =
      '<table style="font-size:115%" border="1"><thead><tr><th>ID</th><th>Client</th><th>Status</th>' +
      '<th>Creation</th><th>Messages</th><th>Histories</th></tr></thead><tbody>';
    for (let cr of crList) {
      table += `<tr>
      <th><a href='${url}/change-request/${cr.id}/content'>${cr.id}</a></th>
      <td>${cr.clientName}</td>
      <td>${cr.status}</td>
      <td>${cr.created_at.toLocaleString()}</td>
      <td>${cr.totalMessage}</td>
      <td>${cr.totalHistory}</td>
      </tr>`;
    }
    table += `</tbody></table><br><p>For more information please visit ${url}</p>`;
    this._sendEmail(receiver, 'Change Request Table - Newest 10', table);
  }

  // send change request to requester by email
  static trackCRID(receiver, cr) {
    if (cr) {
      //send a success message
      this._sendEmail(
        receiver,
        'Change Request ID: ' + cr.id,
        `
      <table border='1' style="font-size:115%;">
      <thead></thead>
      <tbody>
        <tr>
            <th>ID:</th><td>${cr.id}</td>
        </tr>
        <tr>
            <th>Client:</th> <td>${cr.clientName}</td>
        </tr>
          <tr>
            <th>Status:</th> <td>${cr.status}</td>
        </tr>
          <tr>
            <th>Created Date:</th> <td>${cr.created_at.toLocaleString()}</td>
        </tr>
          <tr>
            <th>Updated Date:</th> <td>${cr.updated_at.toLocaleString()}</td>
        </tr>
        <tr>
            <th>Title:</th> <td >${cr.title}</td>
        </tr>
        <tr >
            <th>Detail:</th> <td>${cr.details}</td>
        </tr>
      </tbody>
      </table>
      <br>
      <p>View More details by visit <a href='${url}/change-request/${
          cr.id
        }/content'>${url}/change-request/${cr.id}/content</a></p>
      `
      );
    } else {
      this._sendEmail(
        receiver,
        'Access Failed',
        'Resource does not exist or you do not have authority to access the resource.'
      );
    }
  }

  // return denied message
  static trackCRDenied(receiver, subject) {
    if (!receiver || !subject) {
      //send a denied message
      this._sendEmail(
        mailJSON['sender'],
        'Action Denied',
        '<p>You are not listed in our system. Please register first.</p>'
      );
      return true;
    }
    return false;
  }

  //send email
  static async _sendEmail(receiver, subject, content) {
    //send returning email
    await Mail.raw(`<p>${content}</p>`, message => {
      message.subject(subject);
      message.from(`CRTracker <${noReplyEmail}>`);
      message.to(receiver);
    });
  }

  //create a message for Registration code
  static async sendRegistrationCodeMessage(code) {
    const senderMessage =
      code.content && code.content != '<p>&nbsp;</p>'
        ? `
      <label>Message From ${code.creator_name} &#60;${
            code.creator_email
          }&#62;: </label>
      ${code.content}
      `
        : '';
    const template = `
      <div style='font-size:110%;'>
      <p>You have been invited to access the Change Request Tracking System with a <b><i>${code.role.toLowerCase()}</i></b> account!</p>
      <hr>
      <p>Click the following link to complete the registration: <a href='${url}/register?code=${
      code.code
    }'>${url}/register</a></p>
      <p><small>or</small></p>
      <p>Enter the CRTracker <a href="${url}/login">login page</a> and click register a new membership, then enter the following registration code: <i><b>${
      code.code
    }</b></i></p>
      <hr>
      <br>
      ${senderMessage}
      </div>
    `;
    //send email through mailgun driver
    await Mail.raw(template, message => {
      message.subject('CRTracker Invitation!');
      message.from(`CRTracker <${noReplyEmail}>`);
      message.to(code.email);
    });
  }

  //create a welcome message when user register
  static async sendWelcomeMessage(user) {
    if (user) {
      const title = 'Welcome to CRTracker!';
      const content = `
      <div style="font-size:115%;">
      <p>${user.full_name}, welcome to CRTracker!</p>
      <p>As a ${
        user.role
      } you has the ability to access the following features</p>
      <ul>
      <li><a href="${url}">Enter CRTracker Website.</a></li>
      <li>Use CRTracker notification system to track your action.</li>
      <li>Use CRTracker message system to communicate with anyone in our system.</li>
      <li>Submit Change Request.</li>
      <li>(Client Only) Submit Change Request via email. <a href="mailto:${submitEmail}">${submitEmail}</a></li>
      <li>Track Change Request.</li>
      <li>Track Change Request via email: <a href="mailto:${infoEmail}">${infoEmail}</a> - with the subject: </li>
      <ul>
      <li><b>'track'</b> - track the newest 10 change requests</li>
      <li><b>'#id'</b> - track change request by id</li>
      </ul>
      </ul>
      </div>
      `;

      this._sendEmail(
        user.email,
        title,
        content +
          `
        <br>
        <br>
        <a href="${url}"><i><b>Visit CRTracker website!</b></i></a>
        `
      );

      //create insite message
      return await this.createMessage({
        receiverEmail: user.email,
        senderEmail: 'no-reply@rsicrt.com',
        senderName: '~ CRTracker ~',
        title,
        content
      });
    }
  }
}

module.exports = MessageService;
