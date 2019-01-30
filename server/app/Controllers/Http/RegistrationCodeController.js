'use strict'

/**
 * @author Wei Zheng
 * @description create, read, upload, and delete RegistrationCode
 */

const RegistrationCode = use('App/Models/RegistrationCode')
const AuthorizationService = use('App/Service/AuthorizationService')
const CrudHelper = use('App/Helper/CrudHelper');
const Database = use('Database');
const Validator = use('Validator')

class RegistrationCodeController {

    /**
     * Create new registrationCode 
     */
    async createRegistrationCode({auth, request}){

        let data = request.all();

        //validate email
        const emailValidate = await Validator.validation(data, RegistrationCode.registerEmailRules)
        if(emailValidate.fails()){
            return validation.messages();
        }

        //if validate input name if not allow to edit
        if(!data.allowEdit){
            const validation =  await Validator.validateAll(
                data,
                RegistrationCode.registerRules
            );
            //return validation fail message if failed
            if (validation.fails()) { 
                return validation.messages();
            }
        }      

        //genreate random number 
        data.code = Math.round((1+Math.random()*999) * (1+Math.random()*999));     
        CrudHelper.create(auth, RegistrationCode, {
            verify: user => AuthorizationService.verifyRole(user, ['Developer', 'Admin']),
            work: async (registrationCode, user) => {
                data.creator_email = user.email;
                data.creator_name = `${user.first_name} ${user.last_name}`
                registrationCode.fill(data);
                await registrationCode.save();
            }
        });
        return data.code;
    }

    /**
     * Get registrationCode list belongs to the user
     */
    async getRegistrationCode({auth}){
        const user= await auth.getUser();
        AuthorizationService.verifyRole(user, ['Developer', 'Admin'])
        const RegistrationCodes = await Database
        .table('registration_codes')
        .where('creator_email', user.email)
        .orderBy('created_at', 'asc')
        return RegistrationCodes
    }

    /**
     * delete target
     * @returns {registrationCode}
     */
    async deleteRegistrationCode({auth, params}){
        return CrudHelper.destroy(auth, params, RegistrationCode, {
            verify:(user)=>AuthorizationService.verifyRole(user, ['Developer', 'Admin'])
        });
    }


    /**
     * update target 
     * @returns {registrationCode}
     */
    async updateRegistrationCode({auth, request, params}){
        return CrudHelper.update(auth, params, RegistrationCode, {  
            verify:(user)=>AuthorizationService.verifyRole(user, ['Developer', 'Admin']),
            work: (registrationCode) => registrationCode.merge(request.only(['isRead','isArchived']))
        });
    }
}

module.exports = RegistrationCodeController
