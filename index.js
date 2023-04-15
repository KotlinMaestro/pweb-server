const express = require('express');
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const axios = require('axios');

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
    to: 'pasilivincent@outlook.com',
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

// In your Express app, e.g. app.js or index.js
app.get('/github/username', async (req, res) => {
  try {
    const { username } = req.params;
    const accessToken = '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';


    // Fetch user information
    const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `token ${accessToken}`,
      },
    });

    // Fetch repositories
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `token ${accessToken}`,
      },
    });

    // Calculate contributions in the past year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const contributionsResponse = await axios.get(
        `https://api.github.com/search/commits?q=author:${username}+committer-date:>${oneYearAgo.toISOString().split('T')[0]}`,
        {
          headers: {
            'Accept': 'application/vnd.github.cloak-preview',
            'Content-Type': 'application/json',
            'Authorization': `token ${accessToken}`,
          },
        }
    );

    const result = {
      totalRepos: reposResponse.data.length,
      avatarUrl: userResponse.data.avatar_url,
      contributions: contributionsResponse.data.total_count,
      username: userResponse.data.login,
      location: userResponse.data.location,
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is listening on port 5000');
});