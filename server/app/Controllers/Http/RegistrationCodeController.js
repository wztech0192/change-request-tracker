'use strict'

/**
 * @author Wei Zheng
 * @description create, read, upload, and delete RegistrationCode
 */

const RegistrationCode = use('App/Models/RegistrationCode');
const AuthorizationService = use('App/Service/AuthorizationService');
const RegistrationCodeService = use('App/Service/RegistrationCodeService');
const CrudService = use('App/Service/CrudService');
const Database = use('Database');

class RegistrationCodeController {

    /**
     * Create new registrationCode 
     */
    async createRegistrationCode({auth, request}){

        let data = request.all();

        //validate data
        var validateResult= await RegistrationCodeService.registrationCodeIsFail(data);
        if(validateResult){
            return validateResult;
        }

        //genreate random number 
        data.code = Math.round((1+Math.random()*999) * (1+Math.random()*999));     
        await CrudService.create(auth, RegistrationCode, {
            verify: user => AuthorizationService.verifyRole(user, ['Developer', 'Admin']),
            work: async (registrationCode, user) => {
                data.creator_email = user.email;
                data.creator_name = `${user.first_name} ${user.last_name}`
                registrationCode.fill(data);
                await registrationCode.save();
            }
        });
        return {
            code: data.code
        };
    }

    /**
     * Get registrationCode from data that match with input code
     */
    async verifyRegistrationCode({request}){
        return RegistrationCodeService.getMatchCode(request.only('code'));
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
        return CrudService.destroy(auth, params, RegistrationCode, {
            verify:(user)=>AuthorizationService.verifyRole(user, ['Developer', 'Admin'])
        });
    }


    /**
     * update target 
     * @returns {registrationCode}
     */
    async updateRegistrationCode({auth, request, params}){
        return CrudService.update(auth, params, RegistrationCode, {  
            verify:(user)=>AuthorizationService.verifyRole(user, ['Developer', 'Admin']),
            work: (registrationCode) => registrationCode.merge(request.only(['isRead','isArchived']))
        });
    }
}

module.exports = RegistrationCodeController
