const brevo = require('@getbrevo/brevo');

let apiInstance = new brevo.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = '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';
let sendSmtpEmail = new brevo.SendSmtpEmail();

sendSmtpEmail.subject = "Password reset";
sendSmtpEmail.htmlContent = "<html><body><h1>Link the link below to reset your email</h1></body></html>";
sendSmtpEmail.sender = { "name": "Sender", "email": "admin@test.com" };
sendSmtpEmail.to = [
  { "email": "overwatch.mdy@gmail.com" }
];
sendSmtpEmail.replyTo = { "email": "example@brevo.com", "name": "sample-name" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


async function sendMail(token){
  sendSmtpEmail.htmlContent = `<html><body><a href=http://localhost:5500/frontend/confirm-reset.html?token=${token}>Link the link below to reset your email</h1></body></html>`;
  apiInstance.sendTransacEmail(sendSmtpEmail).then(result=>{
    console.log(result)
  })
}

module.exports=sendMail

