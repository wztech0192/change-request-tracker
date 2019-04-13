'use strict';

/**
 * @author Wei Zheng
 * @description service that handle incoming and outgoing emails
 */

const Mail = use('Mail');
const User = use('App/Models/User');
const Message = use('App/Models/Message');

// if production, use public url in env file, else use local address
const url =
  process.env.NODE_ENV === 'production'
    ? process.env.PUBLIC_URL
    : 'http://localhost:8080';

/** refers to the value inside env */

// no-reply service email address
const noReplyEmail = `${process.env.NO_REPLY_REC}@${
  process.env.MAILGUN_DOMAIN
}`;

//submit change request email address
const submitEmail = `${process.env.SUBMIT_REC}@${process.env.MAILGUN_DOMAIN}`;

//track change request email address
const infoEmail = `${process.env.INFO_REC}@${process.env.MAILGUN_DOMAIN}`;

class MessageService {
  /**
   * retrieve client from mail json, return null if sender is not a client ordoes not exist
   * @param {Object} mailJSON
   */
  async getClientFromMail(mailJSON) {
    return User.queryFromMail(mailJSON['sender'].toLowerCase());
  }

  /**
   * get user from email address
   * @return {User}
   * @param {String} sender email adress
   */
  async getUserFromMail(sender) {
    return User.findBy('email', sender.toLowerCase());
  }

  /**
   * verify if the request email, user, and api key is valid. Return a denied email if failed.
   * @return {Boolean}
   * @param {User} client
   * @param {Object} mailJSON
   * @param {String} key secret key from mailgun service
   */
  requestMailDenied(client, mailJSON, key) {
    if (
      key !== process.env.MAILGUN_API_KEY ||
      !client ||
      !mailJSON['subject'] ||
      !mailJSON['body-plain']
    ) {
      this._sendEmail(
        mailJSON['sender'],
        'Submission Denied',
        '<p>Missing contet or you do not have a client account in our system. Please contact the admin to register a client account.</p>'
      );
      return true;
    }
    return false;
  }

  /**
   * return change request submission approved email to sender
   * @param {User} receiver
   * @param {int} crID
   */
  requestMailApproved(receiver, crID) {
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
      send a email to <a href='mailto:${infoEmail}?subject=track || ${crID}'><b>${infoEmail}</b></a> with subject:
      <ul>
      <li>
      <a href="mailto:${infoEmail}?subject=track"><b>'track'</b></a> - track the newest 10 change requests.
      </li>
       <li>
        <a href="mailto:${infoEmail}?subject=${crID}"><b>'${crID}'</b></a> - track individual change request.
      </li>

      </ul>
      </li>
      </ol>
      </p>`
    );
  }

  /**
   * email requested change request list table to the sender
   * @param {User} receiver
   * @param {ChangeRequest[]} crList
   */
  trackCRList(receiver, crList) {
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

  /**
   * email requested change request to the sender
   * @param {User} receiver
   * @param {ChangeRequest} cr
   */
  trackCRID(receiver, cr) {
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
      <p>View more details by visit <a href='${url}/change-request/${
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

  // valid if api key, receiver, and subject is valid

  /**
   * verify if the sender, subject and api key is valid. Return a denied email if failed.
   * @return {Boolean}
   * @param {String} sender
   * @param {String} subject
   * @param {String} key secret key from mailgun service
   */
  trackCRDenied(sender, subject, key) {
    if (key !== process.env.MAILGUN_API_KEY || !sender || !subject) {
      //send a denied message
      this._sendEmail(
        sender,
        'Action Denied',
        '<p>Wrong formatting or you are not listed in our system. Please register first.</p>'
      );
      return true;
    }
    return false;
  }

  /**
   * send email from CRTracker
   * @param {String} receiver email
   * @param {String} subject
   * @param {String} content
   */
  async _sendEmail(receiver, subject, content) {
    //send returning email
    await Mail.raw(`<p>${content}</p>`, message => {
      message.subject(subject);
      message.from(`CRTracker <${noReplyEmail}>`);
      message.to(receiver);
    });
  }

  /**
   * email registration code to receiver
   * @param {RegistrationCode} code
   */
  async sendRegistrationCodeMail(code) {
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

  //
  /**
   * create a welcome message for new registered user
   * @param {User} user
   */
  async sendWelcomeMail(user) {
    if (user) {
      const title = 'Welcome to CRTracker!';
      const content = `
      <div style="font-size:115%;">
      <p>${user.full_name}, welcome to CRTracker!</p>
      <p>As a ${
        user.role
      } you has the ability to access the following features</p>
      <ul>
      <li><a href="${url}">Click Me to Enter CRTracker Website.</a></li>
      <li>Use CRTracker notification service to track your action.</li>
      <li>Use CRTracker internal message service to communicate with anyone in our system.</li>
      <li>Submit Change Request through CRTracker website.</li>
      <li>(Client Only) Submit Change Request via email. <a href="mailto:${submitEmail}">${submitEmail}</a></li>
      <li>Track Change Request.</li>
      <li>Track Change Request via email: <a href="mailto:${infoEmail}?subject=track || id">${infoEmail}</a> - with the subject: </li>
      <ul>
      <li><a href="mailto:${infoEmail}?subject=track"><b>'track'</b></a> - track the newest 10 change requests</li>
      <li><a href="mailto:${infoEmail}?subject=id"><b>'id'</b></a> - track change request by id</li>
      </ul>
      </ul>
      <hr>
      <p>Read user manual for more information about CRTracker: <a href="${url}/document/manual">User Manual</a></p>
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
      const message = await Message.create({
        receiverEmail: user.email,
        senderEmail: 'no-reply@rsicrt.com',
        senderName: '~ CRTracker ~',
        title,
        content
      });
      return message;
    }
  }
}

module.exports = MessageService;
