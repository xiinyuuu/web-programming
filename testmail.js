const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'movrec.team@gmail.com',
    pass: 'knwt akup cvgo nmeg', // <-- Your App Password, no spaces
  },
});

transporter.sendMail({
  from: 'movrec.team@gmail.com',
  to: 'movrec.team@gmail.com', // You can change this to any email you want to test
  subject: 'Test Email',
  text: 'If you get this, your App Password works!',
}, (err, info) => {
  if (err) {
    return console.log('Error:', err);
  }
  console.log('Success:', info);
}); 