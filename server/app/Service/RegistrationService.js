'use strict';

/**
 * @author Wei Zheng
 * @description Any methods that involved in registration process
 */

const RegistrationCode = use('App/Models/RegistrationCode');
const User = use('App/Models/User');
const MailService = use('App/Service/MailService');
const NotificationService = use('App/Service/NotificationService');
const RegistCodeNotExistException = use(
  'App/Exceptions/RegistCodeNotExistException'
);

class RegistrationService {
  constructor() {
    this.mailService = new MailService();
    this.notificationService = new NotificationService();
  }

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
    this.notificationService.newRegisterCode(registrationCode);
    // send email message
    this.mailService.sendRegistrationCodeMail(registrationCode);

    return {
      code: registrationCode.code
    };
  }

  /**
   * Validate registration code
   */
  isCodeValidate(data) {
    return RegistrationCode.isValidate(data);
  }

  //remove used code
  async removeCode(id) {
    const code = await RegistrationCode.find(id);
    code.delete();
    return code;
  }

  /**
   * Validate user information
   */
  isUserValidate(userInfo) {
    return User.isValidate(userInfo);
  }

  //create new user from register information
  async createNewUser(userInfo, code) {
    //create user
    const user = await User.create(userInfo);
    //create welcome message
    this.mailService.sendWelcomeMail(user);
    //remove used code
    this.removeCode(code.id);
    // notify new registerd user
    this.notificationService.newUser(user);
    return user;
  }
}

module.exports = RegistrationService;
