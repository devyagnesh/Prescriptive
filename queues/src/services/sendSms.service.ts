import twillio, { Twilio } from 'twilio'

export default class SmsService{
  private accountSid: string | undefined;
  private authToken: string | undefined ;
  private from:string|undefined;
  private client: Twilio = new Twilio;
  private static instance: SmsService | null
  private constructor(){
    this.accountSid= process.env.TWILIO_ID
    this.authToken = process.env.TWILIO_AUTH_KEY
    this.from = process.env.TWILIO_NUMBER
    this.client = twillio(this.accountSid,this.authToken)
  }


  public static getInstance(){
    if(SmsService.instance === null || SmsService.instance === undefined){
      SmsService.instance = new SmsService()
    }

    return SmsService.instance
  }
  public async sendMessage(message:string,to:string){
    try {
      this.client.messages.create({
        body:message,
        to:to,
        from:this.from
      })
    } catch (error) {
      console.log(error)
    }
  }

}