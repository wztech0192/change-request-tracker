'use strict';

/**
 * @author Wei Zheng
 * @description reusable method used to map data
 */

class MapHelper {
  /**
   * map datatabse json
   * @return {Object}
   * @param {Object} table
   * @param {Func} queryCB call back function to retrieve query
   */
  static async mapDatatableFrom(table, queryCB) {
    //table page
    const page = table.start / table.length + 1;

    // filter search
    const search = table.search.value;

    //callback query function
    const queryList = await queryCB(table, page, search);

    return {
      recordsTotal: queryList.pages.total,
      recordsFiltered: queryList.pages.total,
      data: queryList.rows
    };
  }

  /**
   *  capitalize the first letter of the word and lowercase the rest
   *  remove all special character or number
   * @param {String} string
   */
  static formatString(string) {
    if (string) {
      return (
        string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
      ).replace(/[\W\d]*/g, '');
    }

    return string;
  }

  /**
   * map receiver list into data
   * @return {Object[]}
   * @param {User} user
   * @param {Object} request
   */
  static mapReceiveData(user, request) {
    const { receiver, title, content } = request.all();

    return new Array(receiver.length).fill().map((a, i) => ({
      receiverEmail: receiver[i].substring(
        receiver[i].indexOf('(') + 1,
        receiver[i].lastIndexOf(')')
      ),
      senderEmail: user.email,
      senderName: user.full_name,
      title: title,
      content: content
    }));
  }

  /**
   * map user information
   * @return {Object}
   * @param {Object} userInfo
   * @param {RegistrationCode} code
   */
  static mapUserInfo(userInfo, code) {
    // if not allow edit, map user info from code
    if (code && code.allowEdit == false) {
      userInfo.first_name = code.first_name;
      userInfo.last_name = code.last_name;
      userInfo.mid_initial = code.mid_initial;
    }

    //format user data
    if (userInfo.mid_initial) {
      userInfo.mid_initial = this.formatString(userInfo.mid_initial) + '.';
    }
    userInfo.role = code ? code.role : 'Client';
    if (userInfo.role === 'Developer') {
      userInfo.isDev = true;
    }

    if (code) {
      userInfo.email = code.email;
    }
    userInfo.email = userInfo.email.toLowerCase();
    userInfo.last_name = this.formatString(userInfo.last_name);
    userInfo.first_name = this.formatString(userInfo.first_name);

    userInfo.full_name = `${userInfo.first_name} ${userInfo.mid_initial ||
      ''} ${userInfo.last_name}`;

    return userInfo;
  }

  /**
   * map change request history type and content
   * @return {Object} change request data
   * @param {Object} requestData change request data
   * @param {User} user client user
   */
  static mapCRHistory(requestData, user) {
    let type, content;
    // history for status update
    if (requestData.status) {
      type = `New Status: ${requestData.status.toUpperCase()}`;
      content = `The status was updated to ${requestData.status.toUpperCase()} by ${
        user.full_name
      }`;
    } else {
      //history for content modify
      type = 'Edit Content';
      content = `Change Request content was modified by ${user.full_name}`;
    }

    return {
      type,
      content
    };
  }

  /**
   * map change request
   * @return {ChangeRequest}
   * @param {ChangeRequest} changeRequest
   * @param {Object} data
   * @param {User} client
   */
  static mapChangeRequest(changeRequest, data, client) {
    data.totalMessage = 0;
    data.totalHistory = 0;
    data.clientName = client.full_name;
    //fill in data
    changeRequest.fill(data);

    return changeRequest;
  }

  /**
   * filter change requests by status ratio
   * @return {Object} JSON for ChartJS
   * @param {ChangeRequest[]}
   */
  static mapChartDataFrom(CRList) {
    //chart data JSON format
    const chartData = {
      pie: [0, 0, 0, 0],
      line: [
        new Array(7).fill(0),
        new Array(7).fill(0),
        new Array(7).fill(0),
        new Array(7).fill(0)
      ]
    };

    let total = 0;
    let i = 0;
    //loop through each change request and fill chart data.
    for (let data of CRList.rows) {
      //if date is different change to filling data to next day

      switch (data.status) {
        case 'Cancelled':
          i = 0;
          break;
        case 'To Do':
          i = 1;
          break;
        case 'In Progress':
          i = 2;
          break;
        case 'Complete':
          i = 3;
          break;
      }
      chartData.pie[i]++;
      chartData.line[i][data.created_at.getDay()]++;
      total++;
    }

    return {
      total,
      chartData
    };
  }

  /**
   * Sanitize string
   * @return {String}
   * @param {String} string
   */
  static sanitize(string) {
    //replace < and > with unique character
    string = string.replace(/([\<])/g, '&#60;');
    string = string.replace(/([\>])/g, '&#62;');

    return string;
  }
}

module.exports = MapHelper;
