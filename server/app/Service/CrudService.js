'use strict';

/**
 * Use to simplify Create, Read, Update, and Destroy method
 */
class CrudService {
  /**
   * get all resource from database
   * @returns {Model[]}
   */
  static async getAll(Model, callback) {
    const resourceQuery = await Model.all();
    //call back function
    if (callback) {
      //verification
      if (callback.verify) callback.verify(resourceQuery.rows);
      //work
      if (callback.work) await callback.work(resourceQuery.rows);
    }
    return resourceQuery.rows;
  }

  /**
   * Create a change request that owns by current user
   * @returns {Model}
   */
  static async create(auth, Model, callback) {
    const user = await auth.getUser();
    const resource = new Model();
    //call back function
    if (callback) {
      //verification
      if (callback.verify) callback.verify(user, resource);
      //work
      if (callback.work) await callback.work(resource, user);

      if (callback.after) {
        await callback.after(resource, user);
      }
    }
    return resource;
  }

  /**
   * delete target change request
   * @returns {Model}
   */
  static async destroy(auth, params, Model, callback) {
    const user = await auth.getUser();
    const resource = await Model.find(params.id);
    //call back function
    if (callback) {
      //verification
      if (callback.verify) callback.verify(user, resource);
      //work
      if (callback.work) await callback.work(resource, user);
    }
    await resource.delete();

    // call after function after resource is deleted
    if (callback && callback.after) {
      await callback.after(resource, user);
    }

    return resource;
  }

  /**
   * delete target change request
   * @returns {Model}
   */
  static async update(auth, params, Model, callback) {
    const user = await auth.getUser();
    const resource = await Model.find(params.id);

    //call back function
    if (callback) {
      //verification
      if (callback.verify) callback.verify(user, resource);
      //work
      if (callback.work) await callback.work(resource, user);
    }
    await resource.save();

    // call after method after resource is saved
    if (callback && callback.after) {
      await callback.after(resource, user);
    }

    return resource;
  }
}

module.exports = CrudService;
