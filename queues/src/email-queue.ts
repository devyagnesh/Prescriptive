import { Worker } from "bullmq";
import MailService from "./services/sendMail.service";

export const emailWorker = new Worker(
    "email-queue",
    async (job) => {
      
        const { to, html } = job.data;
        const mailService = MailService.getInstance();
        await mailService.sendEmailVerificationMail(to, html);
    },
    {
      connection: {
        host: "localhost",
        port: 6379,
      },
    }
  );
  
