export interface IMail {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface IEmailVerify {
  html: string;
  text: string;
}
