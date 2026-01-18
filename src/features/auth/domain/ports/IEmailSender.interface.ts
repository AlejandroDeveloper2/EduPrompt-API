export interface IEmailSender {
  sendEmail: (
    subject: string,
    receivers: string[],
    htmlTemplate: string
  ) => Promise<void>;
}
