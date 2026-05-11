import nodemailer from 'nodemailer';

// Create a transporter object using the SMTP settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "yuvrajsinghveer584@gmail.com",
        pass: "qcnd xeht wvco orsa",
    },
});

// Export the transporter
export default transporter;