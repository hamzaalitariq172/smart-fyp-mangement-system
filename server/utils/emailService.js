const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Smart FYP System" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (user) => {
  await sendEmail({
    email: user.email,
    subject: 'Welcome to Smart FYP Management System',
    html: `<h1>Welcome ${user.name}!</h1><p>Your account has been created successfully.</p>`,
  });
};

const sendNotificationEmail = async (user, title, message) => {
  await sendEmail({
    email: user.email,
    subject: title,
    html: `<h2>${title}</h2><p>${message}</p>`,
  });
};

module.exports = { sendEmail, sendWelcomeEmail, sendNotificationEmail };
