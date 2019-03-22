'use strict';

/**
 * @author Wei Zheng
 * @description Any methods that involved in registration process
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

  /**
   * Validate registration code
   */
  async isCodeValidate(data) {
    return await RegistrationCode.isValidate(data);
  }

  //remove used code
  async removeCode(id) {
    const code = await RegistrationCode.find(id);
    await code.delete();
    return code;
  }

  /**
   * Validate user information
   */
  async isUserValidate(userInfo) {
    return await User.isValidate(userInfo);
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
