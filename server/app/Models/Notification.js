'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Notification extends Model {
  /**
   * return the belonging user
   */
  user() {
    return this.belongsTo('App/Models/User');
  }

  /**
   * return list for datatabse
   */
  static queryForDatatable(table, page, search, user_id) {
    return this.query()
      .where('user_id', user_id)
      .andWhere(function() {
        this.where('created_at', 'like', `%${search}%`).orWhere(
          'content',
          'like',
          `%${search}%`
        );
      })
      .orderBy(table.columns[table.order[0].column].data, table.order[0].dir)
      .paginate(page, table.length);
  }

  /**
   * return last 10 notification
   */
  static queryForLastTen(user) {
    return this.query()
      .where('user_id', user.id)
      .where('isNew', false)
      .orderBy('created_at', 'desc')
      .limit(10)
      .fetch();
  }

  /**
   * return new notification
   */
  static queryForNew(user) {
    return this.query()
      .where('user_id', user.id)
      .where('isNew', true)
      .orderBy('created_at', 'desc')
      .fetch();
  }

  /**
   * set all unread notification to read
   */
  static queryToClearAllNew(user) {
    return this.query()
      .where('user_id', user.id)
      .where('isNew', true)
      .update({ isNew: false });
  }

  /**
   * set notification to read
   */
  static queryToClearNew(user, target) {
    return this.query()
      .where('user_id', user.id)
      .where('id', target)
      .update({ isNew: false });
  }
}

module.exports = Notification;
