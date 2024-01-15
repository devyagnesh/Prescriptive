import { Vonage } from "@vonage/server-sdk";
import {SMS} from '@vonage/messages'

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret:  process.env.VONAGE_API_SECRET,
  applicationId:  process.env.VONAGE_APPLICATION_ID,
  privateKey:  process.env.VONAGE_PRIVATE_KEY,
});