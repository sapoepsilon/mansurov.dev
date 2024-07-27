import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ params }) => {
    const { data: post, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', params.id)
        .single();

    if (fetchError) {
        throw error(404, {
            message: 'Not found'
        });
    }

    return {
        post
    };
};
