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

/* const send = (info) =>{
    // send mail with defined transport object
    console.log(info);
    return new Promise((resolve, reject)=>{
        try {
            console.log("A PUNTO DE ENVIO");
            console.log(transporter);
            let result = transporter.sendMail({info});
            console.log("ENVIADO");
            console.log("Message sent: %s", result.messageId);
            console.log("Preview URL :%s", nodemailer.getTestMessageUrl(result));
            
            resolve(result);
        } catch (error) {
            console.log("NO HEMOS PODIDO ENVIAR!")
            console.log(error);
            reject(error);
        }
    })  
} */

const send = async (message) =>{
    console.log("Paso 3: antes del sendmail");
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
        console.log("Paso 4: antes de return desde send");
        console.log(info);
        return info;
    });
}

const emailProcessor = (email, pin)=>{
    console.log("Paso 2, en funcion emailProcessor");
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
    console.log("Paso 5: antes del return desde emailProcessor");
    return retorno;
}

module.exports = {
    emailProcessor,
}