const nodemailer = require('nodemailer');

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials missing. Set EMAIL_USER and EMAIL_PASS.');
  }

  cachedTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  return cachedTransporter;
};

const sendEmail = async ({ to, subject, html }) => {
  if (!to) throw new Error('Email recipient missing.');
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `Internship Portal <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

module.exports = { sendEmail };
