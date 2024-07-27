import type { PageServerLoad, Actions } from "./$types.js";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { adminSchema } from "./schema";
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ locals }) => {
	// Check if user is already logged in
	const { data: { session } } = await supabase.auth.getSession();
	if (session) {
		throw redirect(303, '/about');
	}

	// Return the form
	return {
		form: await superValidate(zod(adminSchema)),
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(adminSchema));
		console.log('actions');
		console.log('form', form);

		if (!form.valid) {
			return fail(400, {
				form,
			});
		}

		const { email, password } = form.data;

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		console.log('data', data);

		if (error) {
			// If there's an error, return the form with the error
			// form.data.password = ''; // Clear the password field for security
			console.log('error', error);
			return fail(400, {
				form,
				error: error.message,
			});
		}

		// Login successful
		throw redirect(303, '/blog/create'); // Redirect to dashboard after successful login
	},
};
