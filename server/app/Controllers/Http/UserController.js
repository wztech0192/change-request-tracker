'use strict'

/**
 * @author Wei Zheng
 * @description register, login, 
 */

const User=use('App/Models/User');
const AuthorizationService = use('App/Service/AuthorizationService')
const RegistrationCodeService = use('App/Service/RegistrationCodeService');
const MessageService = use('App/Service/MessageService')
const Hash = use('Hash')
const Validator = use('Validator')
const Database = use('Database')

class UserController {

    /**
     * Take email and password then attempt to login
     * 
     */
    async login({ request , auth }){
        const {email,password} = request.all();
        const token= await auth.attempt(email,password);
        return token;
    }
        
    /**
     * Take email and password then create a user inside database. If success call login function
     * @return {login}
     */
    async register({request}){
        //verify registration code
        const code = await RegistrationCodeService.getMatchCode(request.only('code'));
      
        const userInfo = request.except(['code','password_retype']);

        //if not allow to edit, set registration data to code data
        if(code.allowEdit === 0){
            userInfo.email = code.email;
            userInfo.first_name = code.first_name;
            userInfo.last_name = code.last_name;
            userInfo.mid_initial = code.mid_initial;
        }
    
        
        //validate all request data, return message if fails
        const validation =  await Validator.validateAll(userInfo, User.registerRules);
        if (validation.fails()) { 
            return validation.messages();
        }

        //set username as email
        userInfo.username = userInfo.email;

        if(userInfo.mid_initial){
            userInfo.mid_initial = this._modifyString(userInfo.mid_initial)+".";
        }
        userInfo.role = code.role;
        userInfo.last_name = this._modifyString(userInfo.last_name);
        userInfo.first_name= this._modifyString(userInfo.first_name);

        //create user
        await User.create(userInfo)
        
        //create welcome message
        MessageService.addRegistrationCodeMessage(code,userInfo)

        //remove used code
        RegistrationCodeService.removeCode(code.id);

        //pass arguments from this method to login
        return this.login(...arguments)
    };


    /**
     * Generate number of users, for testing purpose
     */
    async generateUsers({request}){
        var {num} = request.all();
        for (var i=0; i<num; i++){

        }
    }

   /**
     * Get Self Information
     * @return {user}
     */
    async self({auth}){
        const user= await auth.getUser();
        return user;
    }

    /**
     * Get User
     * @return {user}
     */
    async get({auth, params}){
        const user=await auth.getUser();
        const targetUser =await User.find(params.id);
        AuthorizationService.verifyPermissionForUser(targetUser, user, null, true)
        return targetUser;
    }

    /**
     * Get RoleList
     * @return {user}
     */
    async getRoleList({auth, params}){
        const user=await auth.getUser();
        AuthorizationService.verifyRole(user, ['Developer','Admin'])
        const userQuery = await User.query().where('role', params.role).fetch();
        return userQuery.rows;
    }

    /**
     * Get All User
     * @return {user[]}
     */
    async getAll({auth}){
        const user=await auth.getUser();
        AuthorizationService.verifyRole(user, ['Developer','Admin'])
        const userQuery=await User.query().fetch();
        return userQuery.rows;
    }

    /**
     * Remove User
     * @return {user}
     */
    async destroy({auth, params}){
        const user=await auth.getUser();
        const targetUser =await User.find(params.id);
        //permission verify
        AuthorizationService.verifyPermissionForDeleteUser(targetUser, user, ['Developer','Admin'])
        await targetUser.delete();
        return targetUser;
    };


    /**
     * Update user's information
     * @return {user}
     */
    async update({auth, request, params}){
        const user=await auth.getUser();
        const targetUser =await User.find(params.id);
        var data=request.all();

        //if request a role change, verify current user's role then update target user
        if(data.role){
            //role check
            AuthorizationService.verifyPermissionForUser(targetUser, user, ['Developer','Admin'], false)
            targetUser.role=data.role;
            if(targetUser.role == 'Developer'){
                targetUser.isDev=1;
            }
        }
        //else allow user to update themselve for some profile
        else{
            //allow self update
            AuthorizationService.verifyPermissionForUser(targetUser, user, null, true)
            data=request.except(['username','email','password']);

            if(data.passworld || data.email){
                //validate password or email
                const validation =  await Validator.validateAll(data, User.changeRules);
                if(validation.fails()) return validation.messages();
                
                //if has password request, hash the password
                if(data.password){
                    data.password=await Hash.make(data.password);  
                } 
            }
            
            targetUser.merge(data);
        }
        await targetUser.save();
        return targetUser;
    };
    
    /**
     * return flagged list
     * @return {array}
     */
    async getTaskList({ auth}) {
        const user = await auth.getUser();
        const TaskList = [];
        if (user.role === "Developer") {
            const flaggedDevTodo = await Database
                .table('dev_todos')
                .where('isFlagged', '1').orderBy('created_at', 'desc');
            for(let devTodo of flaggedDevTodo){
                //  devTodo.link="/todo";
                TaskList.push(devTodo);
            }
        }
        //return null if list is empty
        return TaskList;
    }

    // capitalize the first letter of the word and lowercase the rest
    _modifyString(string){
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

}

module.exports = UserController
