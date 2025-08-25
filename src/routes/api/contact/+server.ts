import type { RequestHandler } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { VITE_GOOGLE_SMTP_CLIENT_ID, VITE_GOOGLE_SMTP_CLIENT_SECRET, VITE_GOOGLE_SMTP_REFRESH_TOKEN, VITE_GOOGLE_REDIRECT_URI } from '$env/static/private';

const USER_EMAIL = 'ismatulla@mansurov.dev';

export const POST: RequestHandler = async ({ request }) => {
    try {
        console.log('Parsing request JSON...');
        const { name, email, message } = await request.json();
        console.log('Request JSON parsed successfully:', { name, email });

        // Create OAuth2 client
        const oAuth2Client = new google.auth.OAuth2(VITE_GOOGLE_SMTP_CLIENT_ID, VITE_GOOGLE_SMTP_CLIENT_SECRET, VITE_GOOGLE_REDIRECT_URI);
        oAuth2Client.setCredentials({ refresh_token: VITE_GOOGLE_SMTP_REFRESH_TOKEN });
        
        // Generate access token
        console.log('Generating access token...');
        const accessTokenResponse = await oAuth2Client.getAccessToken();
        const accessToken = accessTokenResponse?.token;
        if (accessToken) {
            console.log('Access token generated successfully.');
        } else {
            console.warn('Failed to generate access token.');
            throw new Error('Access token is missing.');
        }

        // Create a transporter object using OAuth2
        console.log('Creating transporter...');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: USER_EMAIL,
                clientId: VITE_GOOGLE_SMTP_CLIENT_ID,
                clientSecret: VITE_GOOGLE_SMTP_CLIENT_SECRET,
                refreshToken: VITE_GOOGLE_SMTP_REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        // Set up email data
        console.log('Setting up email data...');
        const mailOptions = {
            from: email,
            to: USER_EMAIL,
            subject: `Contact Form Submission from ${name}`,
            text: `From: ${name} <${email}>\n\n${message}`,
        };

        // Send email
        console.log('Sending email...');
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result);

        return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ message: 'Failed to send email' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};