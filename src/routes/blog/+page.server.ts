import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async () => {
    const { data: blogPosts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching blog posts:', error);
        return {
            blogPosts: []
        };
    }

    return {
        blogPosts
    };
};
