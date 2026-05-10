import nodemailer from 'nodemailer';

// Create a transporter object using the SMTP settings
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 465, 
    secure: true, // Use SSL for port 465
    auth: {
        user: 'shikhardwivedi2019@gmail.com', 
        pass: 'zlux kwln ldpm zcze',
    },
});

// Export the transporter
export default transporter;