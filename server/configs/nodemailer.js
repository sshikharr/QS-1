import nodemailer from 'nodemailer';

// Create a transporter object using the SMTP settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shikhardwivedi2019@gmail.com', 
        pass: 'zlux kwln ldpm zcze',
    },
});

// Export the transporter
export default transporter;