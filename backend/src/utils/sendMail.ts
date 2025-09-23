import nodemailer from 'nodemailer'


interface IMail {
    to: string,
    subject: string,
    html: string
}


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string
    }
})


export const SendMail = async (mail:IMail):Promise<boolean> => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: mail.to,
            subject: mail.subject,
            html: mail.subject
        })

        return true;
    } catch (error) {
        if(process.env.NODE_ENV === 'development'){
            console.log(error)
            return false;
        }
        return false
    }
}