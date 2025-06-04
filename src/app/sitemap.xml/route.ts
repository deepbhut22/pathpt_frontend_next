// app/sitemap.xml/route.ts

import { type MetadataRoute } from 'next';
import api from '@/utils/axios';

const fetchBlogSlugs = async () => {
    const response = await api.get('/blogs');
    return response.data.map((blog: any) => `/blogs/${blog.slug}`);
}

export async function GET(): Promise<Response> {
    const baseUrl = 'https://pathpr.ca';

    // Static routes
    const staticRoutes = [
        '',
        '/about',
        '/legal-info/privacy',
        '/legal-info/terms',
        '/legal-info/disclaimer',
        '/legal-info/faqs',
        '/blogs'
    ];

    // Dynamic routes (e.g., blog slugs)
    const dynamicRoutes = [
        ...(await fetchBlogSlugs()),
        '/profile',
        '/report',
        '/statistics',
        '/contact',
        '/login',
        '/register',
        '/about',
        '/resourses',
        '/mapleAi'

    ];

    const allRoutes = [...staticRoutes, ...dynamicRoutes];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allRoutes
            .map(
                (route) => `
        <url>
            <loc>${baseUrl}${route}</loc>
        </url>`
            )
            .join('\n')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
