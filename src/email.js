const config = require('../db/config.json');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.SENDGRID_API_KEY);

const email = {
    sendMail: function (body) {
        let html = `<p>You have been invited to access ${body.documentOwner}'s document:
${body.documentName}.</p><br>Click the link to register an account.<br>
<a href=${body.registerLink}>Register</a>`;

        const msg = {
            to: body.to,
            from: "mamv18@student.bth.se",
            subject: "Invited to edit document",
            // text: text,
            html: html,
        };

        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent');
            })
            .catch((error) => {
                console.error(error);
                return { msg: error };
            });
        return "Email sent!";
    }
};

module.exports = email;
