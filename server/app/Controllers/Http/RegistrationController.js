'use strict';

/**
 * @author Wei Zheng
 * @description Create / validate registration code and register new user
 */

const VerificationHelper = use('App/Helper/VerificationHelper');
const RegistrationService = use('App/Service/RegistrationService');
const MapHelper = use('App/Helper/MapHelper');

class RegistrationController {
  constructor() {
    this.registrationService = new RegistrationService();
  }

  /**
   * Take email and password then create a user and save into database. If success call return user token
   * @return {token}
   */
  async register({ request, auth }) {
    //verify registration code, throw exceptions if failed
    const code = await this.registrationService.getMatchCode(
      request.only('code')
    );
    //map user information
    const userInfo = MapHelper.mapUserInfo(
      request.except(['code', 'password_retype']),
      code
    );

    //validate, return message if fails
    const validation = await this.registrationService.isUserValidate(userInfo);
    if (validation !== 'pass') {
      return validation;
    } else {
      //create new user
      await this.registrationService.createNewUser(userInfo, code);
      //pass arguments from this method to login
      const result = await auth.attempt(userInfo.email, userInfo.password);
      return result;
    }
  }

  /**
   * Create new registrationCode
   */
  async createRegistrationCode({ auth, request }) {
    let data = request.all();
    //validate data
    const validation = await this.registrationService.isCodeValidate(data);
    if (validation !== 'pass') {
      return validation;
    }
    //authenticate user
    const user = await auth.getUser();
    VerificationHelper.verifyRole(user, ['Developer', 'Admin']);
    // create code and return code
    const result = await this.registrationService.createRegistrationCode(
      user,
      data
    );
    return result;
  }

  /**
   * Get registrationCode from data that match with input code
   */
  async verifyRegistrationCode({ request }) {
    const result = await this.registrationService.getMatchCode(
      request.only('code')
    );
    return result;
  }
}

module.exports = RegistrationController;
