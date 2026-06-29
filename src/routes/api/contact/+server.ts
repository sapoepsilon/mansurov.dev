import { json, type RequestHandler } from '@sveltejs/kit';
import { createMimeMessage } from 'mimetext';

const TO_EMAIL = 'ismatulla@mansurov.dev';
// Must be an address on a domain configured in Cloudflare Email Routing.
const FROM_EMAIL = 'contact@mansurov.dev';

export const POST: RequestHandler = async ({ request, platform }) => {
	const sender = platform?.env?.CONTACT_EMAIL;
	if (!sender) {
		return json({ message: 'Email binding not available' }, { status: 500 });
	}

	try {
		const { name, email, message } = await request.json();

		// dynamic import: cloudflare:email only resolves on the Workers runtime, not at build
		const { EmailMessage } = await import('cloudflare:email');

		const msg = createMimeMessage();
		msg.setSender({ name: 'mansurov.dev contact', addr: FROM_EMAIL });
		msg.setRecipient(TO_EMAIL);
		msg.setSubject(`Contact Form Submission from ${name}`);
		msg.addMessage({
			contentType: 'text/plain',
			data: `From: ${name} <${email}>\n\n${message}`
		});

		const outgoing = new EmailMessage(FROM_EMAIL, TO_EMAIL, msg.asRaw());
		await sender.send(outgoing as Parameters<typeof sender.send>[0]);

		return json({ message: 'Email sent successfully' });
	} catch (error) {
		console.error('Error sending email:', error);
		return json({ message: 'Failed to send email' }, { status: 500 });
	}
};
