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
     * Get all dev ToDo and its task
     * @returns {Object}
     */
    async index({auth}){
        //authorize
        const user= await auth.getUser();
        AuthorizationService.verifyRole(user, ['Developer']); 
       
        //get all todoList from database
        const todoList= await DevTodo.all();

        //get all children task of each todo
         for(let todo of todoList.rows){
            const task= await todo.devTask().fetch();
            todo.tasks= task;
        }
        return todoList.rows;
    }
    
    /*----------------------Dev Todo CRUD--------------------------
     *
     *
     * Create a dev Todo
     * @returns {devTask}
     */
    async createTodo({auth, request}){
        const {content}=request.all();
        return CrudHelper.create(auth, DevTodo, {
            verify: (user) => AuthorizationService.verifyRole(user, ['Developer']),
            work: async (devTodo) => {
                devTodo.content=content;
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
            work: (devTodo) => devTodo.merge(request.only(['content','percentage','isFlagged']))
        });
    }


    /*----------------------Dev Task CRUD--------------------------
     *
     *
     * Create a dev task own by devTodo
     * @returns {devTask}
     */
    async createTask({auth, request, params}){
        const {content} = request.all();
        const devTodo = await DevTodo.find(params.id);
        return CrudHelper.create(auth, DevTask, {
            verify: (user) => AuthorizationService.verifyPermission(devTodo, user, ['Developer']),
            work: async (devTask) => {
                 //fill in data then save to its parent
                devTask.fill({content});  
                await devTodo.devTask().save(devTask);

                let old_task_num = devTodo.task_num;
                devTodo.task_num++;
                // total of completed divide by new total of task
                devTodo.percentage = Math.round((old_task_num*devTodo.percentage)/devTodo.task_num);
                await devTodo.save();
            }
        });
    }

    /**
     * delete target
     * @returns {devTask}
     */
    async destroyTask({auth, params}){
    
        const item = await CrudHelper.destroy(auth, params, DevTask, {
            verify: (user, devTask) => AuthorizationService.verifyPermission(devTask, user, ['Developer']),
            work: async (devTask) => {
                const parent = await devTask.devTodo().fetch();
                const old_task_num = parent.task_num;
                //is devtask is completed then decrease total percetange
                if(devTask.isCompleted){
                    let dPercent = (1/old_task_num) * 100;
                    parent.percentage -= dPercent;
                }
                //determine percetange after item is deleted
                parent.task_num --;
                // total of completed divide by new total of task
                parent.percentage = Math.round((old_task_num*parent.percentage)/parent.task_num);
                await parent.save();
            }
        });

        return item;
    }


    /**
     * update target 
     * @returns {devTask}
     */
    async updateTask({auth, request, params}){
        const item= await CrudHelper.update(auth, params, DevTask, {
            verify: ( user, devTask) =>AuthorizationService.verifyPermission(devTask,user, ['Developer']),
            work: (devTask) => devTask.merge(request.only('content'))           
        });
        return item;
    }


     /**
     * update task completion 
     * @returns {devTask}
     */
    async updateTaskComplete({auth, request, params}){
        const user=await auth.getUser();
        const devTask =await DevTask.find(params.id);        

        AuthorizationService.verifyPermission(devTask,user, ['Developer']);
        devTask.merge(request.only('isCompleted'));
        await devTask.save()
        //recalculate parent todo complete percentage
        const parentTodo = await devTask.devTodo().fetch();
        let dPercent = (1/parentTodo.task_num) * 100;
        //determine increasing or decreasing on percentage
        dPercent = (devTask.isCompleted)? dPercent : -dPercent;
        parentTodo.percentage += dPercent;
        parentTodo.percentage = Math.round(parentTodo.percentage);
        if(parentTodo.percentage>=100){
            parentTodo.percentage = 100;
        }
        else if(parentTodo.percentage<0){
            parentTodo.percentage = 0;
        }
        await parentTodo.save();

        return parentTodo;
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
