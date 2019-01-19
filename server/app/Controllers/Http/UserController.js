'use strict'

const User=use('App/Models/User');
const AuthorizationService = use('App/Service/AuthorizationService')
const Hash = use('Hash')

class UserController {

    /**
     * Take email and password then attempt to login
     * 
     */
    async login({ request , auth }){
        const {email,password} = request.all();
        
        return await auth.attempt(email,password);
    }

    /**
     * Take email and password then create a user inside database. If success call login function
     * @return {login}
     */
    async register({request}){
        const {email,password} = request.all();

        await User.create({
            email,
            password,
            username:email
        })
        return this.login(...arguments)
    };

    /**
     * Update user's information
     * @return {user}
     */
    async update({auth, request, params}){

        const user=await auth.getUser();
        const {id}=params;
        const targetUser =await User.find(id);
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
            data=request.except(['id','role','isDev','created_at']);
            //if has password request, hash the password
            if(data.password){
                data.password=await Hash.make(data.password);
            }
            targetUser.merge(data);
        }
        
        await targetUser.save();
        return targetUser;
    };

}

module.exports = UserController
