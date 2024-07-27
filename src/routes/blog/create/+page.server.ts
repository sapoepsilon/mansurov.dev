import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { blogSchema } from './schema';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ locals }) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw redirect(303, '/admin');
    }

    const form = await superValidate(zod(blogSchema));

    return {
        form,
        user: session.user
    };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(blogSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const { data, error } = await supabase
            .from('blog_posts')
            .insert([
                {
                    title: form.data.title,
                    content: form.data.content,
                    image_url: form.data.imageUrl || null,
                }
            ]);

        if (error) {
            return fail(500, { form, error: error.message });
        }

        // Redirect to the blog list or the new post after successful creation
        throw redirect(303, '/blog');
    }
};
