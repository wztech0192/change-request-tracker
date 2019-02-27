'use strict';

/**
 * @author Wei Zheng
 * @description message method used across multiple controllers
 */

const Message = use('App/Models/Message');
const AuthorizationService = use('App/Service/AuthorizationService');
const CrudService = use('App/Service/CrudService');
const Mail = use('Mail');

class MessageService {
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

  //send mail
  static async returnMail(receiver, subject, content) {
    //send returning email
    await Mail.raw(content, message => {
      message.subject(subject);
      message.from('CRTracker <no-reply@rsicrt.com>');
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
