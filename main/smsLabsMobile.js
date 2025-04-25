const UtilsAuth = require('../../../modules/api/utilsAuth.js')
const Auth = require('../../../modules/api/auth.js')

const LabsMobileClient = require("../../../node_modules/labsmobile-sms/src/LabsMobileClient.js");
const LabsMobileModelTextMessage = require("../../../node_modules/labsmobile-sms/src/LabsMobileModelTextMessage.js");
const ParametersException = require("../../../node_modules/labsmobile-sms/src/Exception/ParametersException.js");
const RestException = require("../../../node_modules/labsmobile-sms/src/Exception/RestException.js");

class smsLabsMobile extends UtilsAuth {

    constructor(processArgv){
        super(processArgv)  
        this.processArgv = processArgv
    }


    async sendSMSLabsMobile(req,res,subject,text,add){

      var phoneNumber
      
      
      let sequence = new Promise((resolve,reject)=>{

        try {
          
          const username = new Auth(this.processArgv).smsUsername;
          const token = new Auth(this.processArgv).smsToken;
          const message = text;
          const phone = [add.phoneNumber];
          const clientLabsMobile = new LabsMobileClient(username, token);
          const bodySms = new LabsMobileModelTextMessage(phone, message);
          
          bodySms.long = 1;
          
          const response = clientLabsMobile.sendSms(bodySms).then(response=>{
            

            let _serverResponse = {action:1,status:'ok',description:'Confirmation SMS sent, check your mobile phone'}
           
            if(add){
             
              _serverResponse={ ..._serverResponse,...add }
              
            }
           
            resolve(_serverResponse)

          });

          //console.log(response);
        } catch (error) {
          if (error instanceof ParametersException) {
            console.log(error.message);
          } else if (error instanceof RestException) {
            console.log(`Error: ${error.status} - ${error.message}`);
          } else {
            throw new Error("Error: " + error);
          }
        }
      
      }).then(response=>{

        res.json(response)

      })
    
    
    
    
    }

}


module.exports = smsLabsMobile