import { createTransport } from 'nodemailer';

const transport = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});

interface MailResponse {
    message: string;
}

function makeANiceEmail(text: string): string {
    return `
    <div style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
    ">
        <h2> Hey! </h2>
        <p> ${text} </p>
        <p> Bye! </p>
    </div>
    `;
}

export async function sendPasswordResetFunction(
    token: string,
    to: string
): Promise<void> {
    const info = (await transport.sendMail({
        to,
        from: 'test@test.com',
        subject: 'Reset your password',
        html: makeANiceEmail(`
            Click
            <a href="${process.env.FRONTEND_URL}/reset?token=${token}"> here </a>
            to reset your password.
        `),
    })) as MailResponse;

    console.log(info);
}
