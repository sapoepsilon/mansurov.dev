// Workers-runtime module, declared ambiently so importing it doesn't pull the
// global @cloudflare/workers-types lib (which clobbers DOM types).
declare module 'cloudflare:email' {
	export class EmailMessage {
		constructor(from: string, to: string, raw: string);
	}
}
