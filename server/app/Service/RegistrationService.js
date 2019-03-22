'use strict';

/**
 * @author Wei Zheng
 * @description registration code method used across multiple controller
 */

const RegistrationCode = use('App/Models/RegistrationCode');
const User = use('App/Models/User');
const MessageService = use('App/Service/MessageService');
const NotificationService = use('App/Service/NotificationService');
const RegistCodeNotExistException = use(
  'App/Exceptions/RegistCodeNotExistException'
);

class RegistrationService {
  // Get registrationCode from data that match with input code
  async getMatchCode({ code }) {
    const RegistrationCodes = await RegistrationCode.findBy('code', code);
    //if code not exist throw registration code not exist exception
    if (!RegistrationCodes) {
      throw new RegistCodeNotExistException();
    }
    return RegistrationCodes;
  }

  async createRegistrationCode(user, data) {
    //genreate random number
    data.code = Math.round(
      (1 + Math.random() * 999) * (1 + Math.random() * 999)
    );
    data.creator_email = user.email;
    data.creator_name = user.full_name;

    const registrationCode = await RegistrationCode.create(data);

    // send notification
    NotificationService.newRegisterCode(registrationCode);
    // send email message
    MessageService.sendRegistrationCodeMessage(registrationCode);

    return {
      code: registrationCode.code
    };
  }

  //remove used code
  async removeCode(id) {
    const code = await RegistrationCode.find(id);
    await code.delete();
    return code;
  }

  //create new user from register information
  async createNewUser(userInfo, code) {
    //create user
    const user = await User.create(userInfo);
    //create welcome message
    MessageService.sendWelcomeMessage(user);
    //remove used code
    this.removeCode(code.id);
    // notify new registerd user
    NotificationService.newUser(user);
    return user;
  }
}

module.exports = new RegistrationService();
