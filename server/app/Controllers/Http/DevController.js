'use strict'

/**
 * @author Wei Zheng
 * @description create, read, update, and delete for developer todo, developer task, and developer reference
 */

const DevRef = use('App/Models/Dev/DevRef')
const DevTask = use('App/Models/Dev/DevTask')
const DevTodo = use('App/Models/Dev/DevTodo')
const AuthorizationService = use('App/Service/AuthorizationService')
const CrudHelper = use('App/Helper/CrudHelper');

class DevController {
    /**
     * Get all change request belongs to this user
     * @returns {Object}
     */
    async index({auth}){
        const user= await auth.getUser();
        AuthorizationService.verifyRole(user, ['Developer']); 

        return CrudHelper.getAll(DevTodo, {
            work: async (parentList)=>{
                for( let i in parentList){
                    var p = parentList[i];
                    var tasks= await p.devTask().fetch();
                    p.tasks=tasks.rows;
                }
            }
        });
        
    }
    
    /*----------------------Dev Todo CRUD--------------------------
     *
     *
     * Create a dev Todo
     * @returns {devTask}
     */
    async createTodo({auth, request}){
        const {title}=request.all();
        return CrudHelper.create(auth, DevTodo, {
            verify: (user) => AuthorizationService.verifyRole(user, ['Developer']),
            work: async (devTodo) => {
                devTodo.title=title;
                await devTodo.save();
            }     
        });
    }

    /**
     * delete target
     * @returns {devTodo}
     */
    async destroyTodo({auth, params}){
        return CrudHelper.destroy(auth, params, DevTodo, {
            verify:(user, devTodo)=>AuthorizationService.verifyPermission(devTodo, user, ['Developer'])
        });
    }


    /**
     * update target 
     * @returns {devTodo}
     */
    async updateTodo({auth, request, params}){
        return CrudHelper.update(auth, params, DevTodo, {
            verify:(user, devTodo)=>AuthorizationService.verifyPermission(devTodo, user, ['Developer']),
            work: (devTodo) => devTodo.merge(request.only(['title','percentage']))
        });
    }


    /*----------------------Dev Task CRUD--------------------------
     *
     *
     * Create a dev task own by devTodo
     * @returns {devTask}
     */
    async createTask({auth, request, params}){
        const {detail} = request.all();
        const devTodo = await DevTodo.find(params.id);
        return CrudHelper.create(auth, DevTask, {
            verify: (user) => AuthorizationService.verifyPermission(devTodo, user, ['Developer']),
            work: async (devTask) => {
                 //fill in data then save to its parent
                devTask.fill({detail});  
                await devTodo.devTask().save(devTask);
            }
        });
    }

    /**
     * delete target
     * @returns {devTask}
     */
    async destroyTask({auth, params}){
        return CrudHelper.destroy(auth, params, DevTask, {
            verify: (user, devTask) => AuthorizationService.verifyPermission(devTask, user, ['Developer'])
        });
    }


    /**
     * update target 
     * @returns {devTask}
     */
    async updateTask({auth, request, params}){
        const item= CrudHelper.update(auth, params, DevTask, {
            verify: ( user, devTask) =>AuthorizationService.verifyPermission(devTask,user, ['Developer']),
            work: (devTask) => devTask.merge(request.only(['detail','status']))           
        });
        return item;
    }

    /*----------------------Dev Reference CRUD--------------------------
     *
     *
     * Create a dev Reference
     * @returns {devRef}
     */
    async createRef({auth, request}){
        const {description,link} = request.all();
        return CrudHelper.create(auth, DevRef,{
            verify: (user) => AuthorizationService.verifyRole(user, ['Developer']),
            work: async (devRef) => {
                devRef.fill({description,link});
                await devRef.save();
            }
        });
    }

    /**
     * Get target list
     */
    async getRef({auth}){
        const user= await auth.getUser();
        return CrudHelper.getAll(DevRef,{
            verify: ()=>AuthorizationService.verifyRole(user, ['Developer']) 
        });
    }

    /**
     * delete target
     * @returns {devRef}
     */
    async destroyRef({auth, params}){
        return CrudHelper.destroy(auth, params, DevRef, {
            verify:(user, devRef)=>AuthorizationService.verifyPermission(devRef, user, ['Developer']) 
        });
    }


    /**
     * update target 
     * @returns {devRef}
     */
    async updateRef({auth, request, params}){
        return CrudHelper.update(auth, params, DevRef, {  
            verify:(user, devRef)=>AuthorizationService.verifyPermission(devRef, user, ['Developer']) ,
            work: (devRef) => devRef.merge(request.only(['description','link']))
        });
    }
}

module.exports = DevController
