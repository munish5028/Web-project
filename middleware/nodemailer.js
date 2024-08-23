const nodemailer = require("nodemailer")
module.exports = {
    async sendMail(to,subject,html,otp){
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: "rythmbhatia5028@gmail.com",
        pass: "soqwgkhkacvgnolr", // Your app password
      },
    });

    const mailOptions = {
      from: "rythmbhatia5028@gmail.com",
      to: to,
      subject:subject,
      text: `Your OTP is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    });
    },

    async verifyAccount(email,otp){
        const subjet = "Otp for verify account"
        // const html = 
        await this.sendMail(email,subjet,otp)

    }
}