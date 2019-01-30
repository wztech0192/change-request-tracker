'use strict'

/**
 * @author Wei Zheng
 * @description register, login, 
 */

const User=use('App/Models/User');
const AuthorizationService = use('App/Service/AuthorizationService')
const Hash = use('Hash')
const Validator = use('Validator')
const Database = use('Database')
const MessageController = use('App/Controllers/Http/MessageController');

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

    //verify registration code
    async _getRegistrationCode(request){
        //verify registration code
        let {code} = request.only('code');
        if(code){
            code = await Database
            .table('registration_codes')
            .where('code', code).first();
        }
        return code;
    }
        
    /**
     * Take email and password then create a user inside database. If success call login function
     * @return {login}
     */
    async register({request}){

        //verify registration code
        const code = await this._getRegistrationCode(request);
        AuthorizationService.verifyRegistration(code);
      
        let {email, password, first_name, last_name, mid_initial} = request.all();

        //if not allow to edit, set registration data to code data
        if(code.allowEdit === 0){
            email = code.email;
            first_name = code.first_name;
            last_name = code.last_name;
            mid_initial = code.mid_initial;
        }
        
        //validate all request data
        const validation =  await Validator.validateAll(
            {email, password, first_name, last_name, mid_initial}
            , User.registerRules);

        //return validation fail message if failed
        if (validation.fails()) { 
            return validation.messages();
        }

        //create user
        await User.create({
            email, 
            password, 
            username:email,
            first_name, last_name, mid_initial
        })

        //create welcome message
        MessageController._createMessage({
            content : code.contetn,
            receiverEmail : email,
            senderEmail : code.creator_email,
            senderName : code.creator_name,
            title: "Welcome to CRTracker!", 
        });

        //pass arguments from this method
        return this.login(...arguments)
    };

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

}

module.exports = UserController
