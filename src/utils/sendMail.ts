import sgMail from "@sendgrid/mail";

export interface IMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

sgMail.setApiKey(process.env.SG_API_KEY || "");

export const sendMail = async (data: IMessage) => {
  const msg = {
    from: process.env.SG_FROM_EMAIL || "",
    ...data,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    throw error;
  }
};
