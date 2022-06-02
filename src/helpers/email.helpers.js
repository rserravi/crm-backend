const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
    }
});

const send = async (message) =>{
    await transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return process.exit(1);
        }

        console.log('Message sent successfully!');
        console.log(nodemailer.getTestMessageUrl(info));

        // only needed when using pooled connections
        //transporter.close();
        console.log(info);
        return info;
    });
}

const emailProcessor = (email, pin)=>{
    const info = {
        from: '"Leanne Wiegand 👻" <leanne.wiegand57@ethereal.email>', // sender address
        to: email + "", // list of receivers
        subject: "Password reset pin ✔", // Subject line
        text: "Here is your password reset pin: " + pin + ". This pin will expire in 1 day", // plain text body
        html: `<b>Hello</b>
            Here is your password reset pin
            <b>${pin}</b>
            <p>This pin will expire in 1 day"</p>
            `, //html body
    }
    retorno = send(info);
    return retorno;
}

module.exports = {
    emailProcessor,
}