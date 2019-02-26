'use strict';

/**
 * @author Wei Zheng
 * @description message method used across multiple controllers
 */

const Message = use('App/Models/Message');
const AuthorizationService = use('App/Service/AuthorizationService');
const CrudService = use('App/Service/CrudService');
const Mail = use('Mail');
const ChangeRequestHistory = use(
  'App/Models/ChangeRequest/ChangeRequestHistory'
);
const ChangeRequest = use('App/Models/ChangeRequest/ChangeRequest');
const Notification = use('App/Service/NotificationService');
const MyHelper = use('App/Helper/MyHelper');
const Database = use('Database');

class MessageService {
  /**
   * create change request from incoming email
   */
  static async createRequestFromMail(content, sender) {
    //map change request using helper
    const changeRequest = MyHelper.mapChangeRequest(
      new ChangeRequest(),
      content,
      sender
    );

    await sender.change_requests().save(changeRequest);

    //create change request history
    await MyHelper.createCRHistory(new ChangeRequestHistory(), changeRequest, {
      type: 'Create',
      content: `Change Request ID ${changeRequest.id} has been posted by ${
        sender.full_name
      } in ${changeRequest.created_at}`
    });

    await Notification.newChangeRequest(changeRequest);

    return changeRequest;
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
   * delete message
   * @returns {message}
   */
  static async deleteMessage(auth, params) {
    return CrudService.destroy(auth, params, Message, {
      verify: (user, message) =>
        AuthorizationService.verifyMessageOwnership(message, user)
    });
  }

  //create a welcome message when user register
  static async sendWelcomeMessage() {}

  //create a message for Registration code
  static async sendRegistrationCodeMessage(code) {
    const senderMessage = code.content
      ? `
      <label>Message From ${code.creator_name}: </label>
      ${code.content}
    `
      : '';

    const url =
      process.env.NODE_ENV === 'production'
        ? 'http://129.252.199.132/~weiZ/crt/public/register'
        : 'http://localhost:8080/register';

    const template = `
      <div style='font-size:110%;'>
      <p>You have been invited to access CRTracker with a <b><i>${code.role.toLowerCase()}</i></b> account!</p>
      
      <hr>
      <p>Click the following link to complete the registration: <a href='${url}?code=${
      code.code
    }'>CLICK ME!</a></p>
     
       
      <p><small>or</small></p>
      <p>Use the following code under <i>CRTracker/login registration link</i>: <i><b>${
        code.code
      }</b></i></p>

    
      <hr>
      <br>
      ${senderMessage}
      </div>
    `;

    const data = {
      receiverEmail: code.email,
      senderEmail: code.creator_email,
      senderName: code.creator_name,
      title: 'Welcome to CRTracker!',
      content: template
    };
    //send email through mailgun driver
    await Mail.raw(template, message => {
      message.subject('Welcome to CRTracker!');
      message.from('CRTracker <no-reply@rsicrt.com>');
      message.to(code.email);
    });

    return await this.createMessage(data);
  }
}

module.exports = MessageService;
