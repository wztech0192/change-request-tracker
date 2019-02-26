'use strict';

/**
 * @author Wei Zheng
 * @description dev tools
 */

const User = use('App/Models/User');
const MyHelper = use('App/Helper/MyHelper');
const ltr = 'abcdefghijklmnopqrstuvwxyz';
const ChangeRequestHistory = use(
  'App/Models/ChangeRequest/ChangeRequestHistory'
);

const ChangeRequest = use('App/Models/ChangeRequest/ChangeRequest');

class DevToolService {
  //generate random letter by length
  _getLTR(length) {
    let str = '';
    for (let i = 0; i < length; i++) {
      str += ltr.charAt(Math.round(Math.random() * (ltr.length - 1)));
    }
    return str;
  }

  /**
   * Generate number of users, for testing purpose
   */
  static async generateUsers(num) {
    if (num > 0) {
      const usersList = new Array(num);
      for (let i = 0; i < num; i++) {
        let email = this._getLTR(6) + '@' + this._getLTR(4) + '.com';

        let password = this._getLTR(8);
        let role = 'Client';
        let first_name = this._getLTR(6);
        let mid_initial = 'T.';
        let last_name = this._getLTR(6);
        let full_name = `${first_name} ${mid_initial || ''} ${last_name}`;
        usersList[i] = {
          email,
          full_name,
          password,
          role,
          first_name,
          mid_initial,
          last_name
        };
      }
      await User.createMany(usersList);
      return 'OK';
    }
  }

  /**
   * Adjust change request data, for dev
   */
  static async adjustChangeRequest() {
    const CRList = await ChangeRequest.all();

    for (let cr of CRList.rows) {
      cr.totalHistory = await cr.histories().getCount();
      cr.totalMessage = await cr.messages().getCount();
      let client = await cr.user().fetch();
      cr.clientName = `${client.full_name}`;
      cr.save();
    }
  }

  /**
   * gennerate dummy change request, for dev
   */
  static async generateChangeRequest(num, user) {
    let users = await User.all();
    users = users.rows;
    let randUser = null;
    for (let i = 0; i < num; i++) {
      randUser = users[Math.round(Math.random() * (users.length - 1))];

      const changeRequest = new ChangeRequest();
      //fill in data then save to its creator
      changeRequest.fill({
        totalMessage: 0,
        totalHistory: 0,
        clientName: `${randUser.full_name}`,
        title: 'This is random generated change request #' + i,
        details: 'g.'
      });

      await randUser.change_requests().save(changeRequest);

      //create change request history
      await MyHelper.createCRHistory(ChangeRequestHistory, changeRequest, {
        type: 'Create',
        content: `Change Request ID ${changeRequest.id} has been posted by ${
          user.full_name
        } in ${changeRequest.created_at}`
      });
    }
  }
}

module.exports = DevToolService;
