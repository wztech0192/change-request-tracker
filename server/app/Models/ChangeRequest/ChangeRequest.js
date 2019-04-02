'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ChangeRequest extends Model {
  /**
   * return the belonging user
   */
  user() {
    return this.belongsTo('App/Models/User');
  }

  /**
   * return all messages in this change request
   */
  messages() {
    return this.hasMany('App/Models/ChangeRequest/ChangeRequestMessage');
  }

  /**
   * return all history in this change request
   */
  histories() {
    return this.hasMany('App/Models/ChangeRequest/ChangeRequestHistory');
  }

  /**
   * return change request list for active change request
   */
  static queryForActive(id) {
    return this.query()
      .select(
        'id',
        'user_id',
        'title',
        'status',
        'created_at',
        'updated_at',
        'totalMessage',
        'totalHistory',
        'clientName'
      )
      .whereNotIn('status', ['Cancelled', 'Complete'])
      .where(function() {
        if (id) {
          this.where('user_id', id);
        }
      })
      .orderBy('created_at', 'desc')
      .fetch();
  }

  /**
   * return change request list filtered by status
   */
  static queryByStatus(tab, id) {
    return this.query()
      .select(
        'id',
        'user_id',
        'title',
        'status',
        'created_at',
        'updated_at',
        'totalMessage',
        'totalHistory',
        'clientName'
      )
      .where('status', tab)
      .where(function() {
        if (id) {
          this.where('user_id', id);
        }
      })
      .orderBy('created_at', 'desc')
      .fetch();
  }

  /**
   * return change request list owned by this user
   */
  static queryForOwned(id) {
    return this.query()
      .select(
        'id',
        'user_id',
        'title',
        'status',
        'created_at',
        'updated_at',
        'totalMessage',
        'totalHistory',
        'clientName'
      )
      .where('user_id', id)
      .orderBy('created_at', 'desc')
      .fetch();
  }

  /**
   * return change request filtered by search input
   */
  static queryForSearch({ status, clientsName, date }) {
    return this.query()
      .select(
        'id',
        'user_id',
        'title',
        'status',
        'created_at',
        'updated_at',
        'totalMessage',
        'totalHistory',
        'clientName'
      )
      .where(function() {
        if (clientsName) {
          //if data has clients name, query all clients
          this.whereIn('clientName', clientsName);
        }
        if (date) {
          //if data has date range, query date range
          this.whereBetween('created_at', date.split('/'));
        }
      })
      .where('status', 'like', `%${status || ''}%`)
      .orderBy('created_at', 'desc')
      .fetch();
  }

  /**
   * return change request filtered by page
   */
  static queryForPaginate(term, target, page) {
    return this.query()
      .select(
        'id',
        'user_id',
        'title',
        'status',
        'created_at',
        'updated_at',
        'totalMessage',
        'totalHistory',
        'clientName'
      )
      .where(function() {
        this.where('status', 'like', `%${term}%`)
          .orWhere('id', term)
          .orWhere(function() {
            const splitSearch = term.split(' ');
            for (let split of splitSearch) {
              // split the string and search each splitted item
              this.where('clientName', 'like', `%${split || 'N/A'}%`);
            }
          });
      })
      .andWhere('user_id', 'like', target === 'all' ? '%%' : target)
      .orderBy('created_at', 'desc')
      .paginate(page, 10);
  }

  /**
   * return change request between date
   */
  static queryByDateRange(dateRange) {
    return this.query()
      .select(
        'id',
        'user_id',
        'title',
        'status',
        'created_at',
        'updated_at',
        'totalMessage',
        'totalHistory',
        'clientName'
      )
      .whereBetween('created_at', [
        `${dateRange[0]} 00:00:01`,
        `${dateRange[1]} 23:59:59`
      ])
      .orderBy('created_at', 'asc')
      .fetch();
  }

  /**
   * return change request list for email
   */
  static queryForEmail(user, subject) {
    let query = this.query();

    if (user.role !== 'Admin' && user.role !== 'Developer') {
      query = query.where('user_id', user.id);
    }
    //if subject is track
    if (subject.toLowerCase() !== 'track') {
      // -1 if subject is not a number
      return query.where('id', isNaN(subject) ? -1 : subject).first();
    } else {
      return query
        .orderBy('created_at', 'desc')
        .limit(10)
        .fetch();
    }
  }
}

module.exports = ChangeRequest;
