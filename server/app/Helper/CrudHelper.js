'use strict'

const Database = use('Database');
const {LogicalException} = require('@adonisjs/generic-exceptions')

/**
 * Use to simplify Create, Read, Update, and Destroy method
 */
class CrudHelper{

    /**
     * get all resource from database
     * @returns {Model[]}
     */
    async getAll(Model,callback){
        const resourceQuery=await Model.query().fetch();
        //call back function
        if(callback){
            //verification
            if(callback.verify)
                callback.verify(resourceQuery.rows);
            //work
            if(callback.work)
                callback.work(resourceQuery.rows);
        }
        return resourceQuery.rows;
    }

    /**
     * Create a change request that owns by current user
     * @returns {Model}
     */
    async create(auth, Model, callback){
        const user=await auth.getUser();
        const resource=new Model();
        //call back function
        if(callback){
            //verification
            if(callback.verify)
                callback.verify(user,resource);
            //work
            if(callback.work)
                callback.work(resource);
        }
        return resource;
    }

    /**
     * delete target change request
     * @returns {Model}
     */
    async destroy(auth, params, Model, callback){
        const user=await auth.getUser();
        const resource =await Model.find(params.id);
        //call back function
        if(callback){
            //verification
            if(callback.verify)
                callback.verify(user,resource);
            //work
            if(callback.work)
                callback.work(resource);
        }
        await resource.delete();
        return resource;
    }


    /**
     * delete target change request
     * @returns {Model}
     */
    async update(auth, params, Model, callback){
        const user=await auth.getUser();
        const resource =await Model.find(params.id);
     
        //call back function
        if(callback){
            //verification
            if(callback.verify)
                callback.verify(user,resource);
            //work
            if(callback.work)
                callback.work(resource);
        }
        await resource.save()
        return resource;
    }


}

module.exports = new CrudHelper();