import { Worker } from "bullmq";
import MailService from "./services/sendMail.service";
import SmsService from "./services/sendSms.service";

export const smsWorker = new Worker(
    "sms-queue",
    async (job) => {
      
        const { message, to } = job.data;
        const smsService =  SmsService.getInstance();
        await smsService.sendMessage(message,to)
    },
    {
      connection: {
        host: "localhost",
        port: 6379,
      },
    }
  );
  
