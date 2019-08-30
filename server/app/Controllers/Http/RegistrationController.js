'use strict';

/**
 * @author Wei Zheng
 * @description This controller serves as the entry & exist point to all registration related data. The controller
 *              uses RegistrationService to create and validate registration code and register a new user.
 */

const VerificationHelper = use('App/Helper/VerificationHelper');
const RegistrationService = use('App/Service/RegistrationService');
const MapHelper = use('App/Helper/MapHelper');

class RegistrationController {
  /**
   * Delcare service used in the controller
   */
  constructor() {
    this.registrationService = new RegistrationService();
  }

  /**
   * Take email and password then create a user and save into database. If success call return user token
   * @return {Token} jwt token
   */
  async register({ request, auth }) {
    let { code } = request.only('code');
    if (code) {
      //verify registration code, throw exceptions if failed
      code = await this.registrationService.getMatchCode(code);
      //map user information
    }

    const userInfo = MapHelper.mapUserInfo(
      request.except(['code', 'password_retype']),
      code
    );
    //validate, return message if fails
    const validation = await this.registrationService.isUserValidate(userInfo);
    if (validation !== 'pass') {
      return validation;
    }
    //create new user
    await this.registrationService.createNewUser(userInfo, code);
    //pass arguments from this method to login
    const result = await auth.attempt(userInfo.email, userInfo.password);

    return result;
  }

  /**
   * Create new registrationCode
   * @return {String} registration code
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
   * @return {Boolean}
   */
  async verifyRegistrationCode({ params }) {
    const result = await this.registrationService.getMatchCode(params.code);

    return result;
  }
}

module.exports = RegistrationController;
