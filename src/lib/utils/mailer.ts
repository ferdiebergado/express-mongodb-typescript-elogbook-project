/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import SMTPConnection from 'nodemailer/lib/smtp-connection'

const {
  NODE_ENV,
  MAIL_HOST,
  MAIL_PORT,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GMAIL_USER,
  GMAIL_ACCESS_TOKEN,
  GMAIL_REFRESH_TOKEN,
} = process.env

const googleAuth: SMTPConnection.AuthenticationType = {
  type: 'OAuth2',
  user: GMAIL_USER,
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  accessToken: GMAIL_ACCESS_TOKEN,
  refreshToken: GMAIL_REFRESH_TOKEN,
  expires: 1484314697598,
}

const smtpTransportOptions: SMTPTransport.Options = {
  host: MAIL_HOST,
  port: Number(MAIL_PORT) || 465,
}

if (NODE_ENV === 'production') {
  smtpTransportOptions.auth = googleAuth
}

export default (to: string, subject: string, html: string): void => {
  const smtpTransport = nodemailer.createTransport(smtpTransportOptions)
  const mailOptions: Mail.Options = { from: GMAIL_USER, to, subject, html }

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) console.error(error)
    console.log('%j', response)
    smtpTransport.close()
  })
}
