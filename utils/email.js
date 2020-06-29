const nodemailer = require('nodemailer');
const pug = require('pug');
const mg = require('nodemailer-mailgun-transport');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.firstName;
        this.url = url;
        this.from = `Akash Singh <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        // Sendgrid
        return nodemailer.createTransport(mg({
        auth: {
            api_key: '1dc142f79c74f4a645b38234c681eacc-468bde97-c3adcd49',
            domain: 'sandboxccca903664814b01b91e06bdcee31338.mailgun.org'
        }
        }));
    }

    // Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions, (err, res) => {
            if(err) console.log(err)
            console.log(res)
        });
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to TourBuddy Family!');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)'
        );
    }
};