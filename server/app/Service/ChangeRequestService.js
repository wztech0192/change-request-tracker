'use strict';

/**
 * @author Wei Zheng
 * @description handle change request method
 */

const ChangeRequest = use('App/Models/ChangeRequest/ChangeRequest');
const ChangeRequestHistory = use(
  'App/Models/ChangeRequest/ChangeRequestHistory'
);
const ChangeRequestMessage = use(
  'App/Models/ChangeRequest/ChangeRequestMessage'
);
const MyHelper = use('App/Helper/MyHelper');
const NotificationService = use('App/Service/NotificationService');

class ChangeRequestService {
  /**
   * Create a change request
   * @returns {ChangeRequest}
   */
  async create(data, client, issuer, message) {
    //map change request using helper
    const changeRequest = MyHelper.mapChangeRequest(
      new ChangeRequest(),
      data,
      client
    );
    //increase client total request
    client.totalRequest++;
    client.save();
    await client.change_requests().save(changeRequest);

    //create change request history
    await this.createCRHistory(changeRequest, {
      type: 'Create',
      content: `Change Request ID ${changeRequest.id} has been posted by ${
        issuer.full_name
      } in ${changeRequest.created_at}`
    });

    await NotificationService.newChangeRequest(changeRequest);

    //save change request message is message exist
    if (message) {
      // replace < and > to html code &#60; and &#62 for security
      message = MyHelper.sanitize(message);
      await this.createCRMessage(changeRequest, `<p>${message}</p>`);
    }

    return changeRequest;
  }

  /**
   * create message of change request
   */
  async createCRMessage(changeRequest, content) {
    // replace < and > to html code &#60; and &#62 for security
    content = MyHelper.sanitize(content);
    await ChangeRequestMessage.create({
      change_request_id: changeRequest.id,
      content: content,
      user_id: user.id,
      senderEmail: user.email,
      senderName: user.full_name
    });
    change_request.totalMessage++;
    await change_request.save();
  }

  /**
   * create history of change request
   */
  async createCRHistory(changeRequest, data) {
    data.change_request_id = changeRequest.id;
    await ChangeRequestHistory.create(data);
    changeRequest.totalHistory++;
    await changeRequest.save();
  }

  /**
   * Adjust change request data, for dev
   */
  async adjustChangeRequest() {
    const CRList = await ChangeRequest.all();
    for (let cr of CRList.rows) {
      cr.totalHistory = await cr.histories().getCount();
      cr.totalMessage = await cr.messages().getCount();
      let client = await cr.user().fetch();
      cr.clientName = `${client.full_name}`;
      cr.save();
    }
  }
}

module.exports = new ChangeRequestService();
