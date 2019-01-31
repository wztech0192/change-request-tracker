'use strict'

/**
 * @author Wei Zheng
 * @description registration code method used across multiple controller
 */

const RegistrationCode = use('App/Models/RegistrationCode');
const Database = use('Database');
const Validator = use('Validator');
const RegistCodeNotExistException = use('App/Exceptions/RegistCodeNotExistException');

class RegistrationCodeService{

    // Get registrationCode from data that match with input code
    async getMatchCode({code}){
        const RegistrationCodes = await Database
        .table('registration_codes')
        .where('code', code).first();

        //if code not exist throw registration code not exist exception
        if(!RegistrationCodes){
            throw new RegistCodeNotExistException();
        }

        return RegistrationCodes
    }
    
    //return validation messages if data fails. Else return false
    async registrationCodeIsFail(data){
        //validate email input
        const emailValidate = await Validator.validate(data, RegistrationCode.registerEmailRules)
        if(emailValidate.fails()){
            return emailValidate.messages();
        }
        //if allowEdit is false, validate registor information input
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
        return false;
    }

    //remove used code
    async removeCode(id){
        const code = await RegistrationCode.find(id);
        await code.delete();
        return code;
    }
    
    
}

module.exports = new RegistrationCodeService();