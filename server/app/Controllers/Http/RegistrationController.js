'use strict';

/**
 * @author Wei Zheng
 * @description create, read, upload, and delete RegistrationCode
 */

const RegistrationCode = use('App/Models/RegistrationCode');
const AuthorizationService = use('App/Service/AuthorizationService');
const RegistrationService = use('App/Service/RegistrationService');
const User = use('App/Models/User');
const MyHelper = use('App/Helper/MyHelper');

class RegistrationController {
  /**
   * Take email and password then create a user and save into database. If success call return user token
   * @return {token}
   */
  async register({ request, auth }) {
    //verify registration code, throw exceptions if failed
    const code = await RegistrationService.getMatchCode(request.only('code'));

    //map user information
    const userInfo = MyHelper.mapUserInfo(
      request.except(['code', 'password_retype']),
      code
    );

    //validate, return message if fails
    const validation = await User.isValidate(userInfo);
    if (validation !== 'pass') {
      return validation;
    } else {
      //create new user
      await RegistrationService.createNewUser(userInfo, code);

      //pass arguments from this method to login
      return await auth.attempt(userInfo.email, userInfo.password);
    }
  }

  /**
   * Create new registrationCode
   */
  async createRegistrationCode({ auth, request }) {
    let data = request.all();

    //validate data
    const validation = await RegistrationCode.isValidate(data);
    if (validation !== 'pass') {
      return validation;
    }

    //authenticate user
    const user = await auth.getUser();
    AuthorizationService.verifyRole(user, ['Developer', 'Admin']);

    // create code and return code
    return await RegistrationService.createRegistrationCode(user, data);
  }

  /**
   * Get registrationCode from data that match with input code
   */
  async verifyRegistrationCode({ request }) {
    return RegistrationService.getMatchCode(request.only('code'));
  }
}

module.exports = RegistrationController;
