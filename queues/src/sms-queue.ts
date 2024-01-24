import { Worker } from "bullmq";
import SmsService from "./services/sendSms.service";

export const smsWorker = new Worker(
    "sms-queue",
    async (job) => {
      try {
        const { message, to } = job.data;
      
        const smsService =  SmsService.getInstance();
        await smsService.sendMessage(message,to)
      } catch (error) {
        console.log('SMS QUEUE ERROR :',error)
      }
    },
    {
      connection: {
        host: "localhost",
        port: 6379,
      },
    }
  );
  
