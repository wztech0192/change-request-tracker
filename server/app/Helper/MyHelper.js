'use strict';

/**
 * @author Wei Zheng
 * @description reusable method
 */

class MyHelper {
  /**
   * map datatabse json
   */
  static async mapDatatableFrom(request, queryCB) {
    const table = request.all();

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
   * map user information
   */
  static mapUserInfo(userInfo, code) {
    // if not allow edit, map user info from code
    if (code.allowEdit == false) {
      userInfo.first_name = code.first_name;
      userInfo.last_name = code.last_name;
      userInfo.mid_initial = code.mid_initial;
    }

    //format user data
    if (userInfo.mid_initial) {
      userInfo.mid_initial = this.formatString(userInfo.mid_initial) + '.';
    }
    userInfo.role = code.role;
    userInfo.email = code.email.toLowerCase();
    userInfo.last_name = this.formatString(userInfo.last_name);
    userInfo.first_name = this.formatString(userInfo.first_name);

    userInfo.full_name = `${userInfo.first_name} ${userInfo.mid_initial ||
      ''} ${userInfo.last_name}`;
    return userInfo;
  }

  /**
   * save history of change request
   */
  static async createCRHistory(crHistory, changeRequest, data) {
    crHistory.fill(data);
    changeRequest.histories().save(crHistory);
    changeRequest.totalHistory++;
    await changeRequest.save();
  }

  /**
   * map change request history type and content
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
   * Convert crlist into chart data
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
}

module.exports = MyHelper;
