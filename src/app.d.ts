// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { R2Bucket, SendEmail } from '@cloudflare/workers-types';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				BUCKET: R2Bucket;
				CONTACT_EMAIL: SendEmail;
			};
		}
	}
}

export {};
