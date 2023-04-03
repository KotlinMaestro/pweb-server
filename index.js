const express = require('express');
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

// Set up the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'servincentparsley@gmail.com',
    pass: 'oxigrzywxwzuonaw'
  }
});

// Define a route for handling the contact form submission
app.post('/contact', (req, res) => {
  // Get the form data from the request body
  const { name, email, message } = req.body;

  // Define the email message
  const mailOptions = {
    from: 'servincentparsley@gmail.com',
    to: 'romankatanovich@yahoo.com',
    subject: `${name} wants to talk to you`,
    text: `From: ${name} <${email}> \n\n ${message}`
  };

  // Send the email using the transporter
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is listening on port 5000');
});