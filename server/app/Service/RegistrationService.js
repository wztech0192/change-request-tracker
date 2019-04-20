'use strict';

/**
 * @author Wei Zheng
 * @description Service used to handle data used in registration process
 */

const RegistrationCode = use('App/Models/RegistrationCode');
const User = use('App/Models/User');
const MailService = use('App/Service/MailService');
const NotificationService = use('App/Service/NotificationService');
const RegistCodeNotExistException = use(
  'App/Exceptions/RegistCodeNotExistException'
);

class RegistrationService {
  /**
   * declare services used in this class
   */
  constructor() {
    this.mailService = new MailService();
    this.notificationService = new NotificationService();
  }

  /**
   * Get registrationCode from data that match with input code
   * @return {RegistrationCode}
   * @param {String} code
   */
  async getMatchCode(code) {
    const registrationCodes = await RegistrationCode.findBy('code', code);
    //if code not exist throw registration code not exist exception
    if (!registrationCodes) {
      throw new RegistCodeNotExistException();
    }

    return registrationCodes;
  }

  /**
   * Create registration code
   * @param {User} user current user
   * @param {Object} data {code, creator_email, creator_name}
   */
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
   * @return {Object || String} error message or "pass" string
   * @param {Object} data code data
   */
  isCodeValidate(data) {
    return RegistrationCode.isValidate(data);
  }

  /**
   * remove used code
   * @param {int} id registration code id
   * @return {RegistrationCode}
   */
  async removeCode(id) {
    const code = await RegistrationCode.find(id);
    code.delete();

    return code;
  }

  /**
   * Validate user information
   * @param {Object} userInfo user data object
   * @return {Object || String} error message or "pass" string
   */
  isUserValidate(userInfo) {
    return User.isValidate(userInfo);
  }

  /**
   * create new user from register information
   * @return {User}
   * @param {Object} userInfo user data object
   * @param {RegistrationCode} code registration code used to create user
   */
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
