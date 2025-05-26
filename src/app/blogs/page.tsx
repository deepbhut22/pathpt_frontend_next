// app/blog/page.tsx (Server Component)
import { Metadata } from 'next';
import Layout from '@/components/layout/Layout';
import VantaHaloBackground from '@/components/ui/backgrounds/HaloBg';
import { BlogPostNew } from '@/types';
import BlogListingClient from '@/app/blogs/BlogListClientComponent';
import api from '@/utils/axios';
import { Suspense } from 'react';
import ClientOnly from '@/components/ClientOnly';
import AutoShimmer from '@/components/AutoShimmer';

export const metadata: Metadata = {
  title: 'Canadian Immigration Blog | Expert Tips, News & Policy Updates',
  description: 'Stay informed on Canadian immigration with expert-written blog posts covering express entry, visas, PR pathways, legal advice, and policy changes.',
  openGraph: {
    title: 'Canadian Immigration Blog | Expert Tips, News & Policy Updates',
    description: 'Explore expert articles on Canadian immigration, including Express Entry, work and study permits, PR guidance, and the latest IRCC policy updates.',
    url: 'https://pathpr.ca/blogs',
    siteName: 'Pathpr Immigration Blog',
    type: 'website',
    images: [
      {
        url: 'https://pathpr.ca/og/immigration-blog-cover.png', // customize this URL to your Open Graph image
        width: 1200,
        height: 630,
        alt: 'Canadian Immigration Blog - Tips and News',
      },
    ],
  },
  keywords: [
    'Canadian immigration blog',
    'Express Entry tips',
    'IRCC news',
    'PR application guide',
    'Canada work visa',
    'study in Canada',
    'Pathpr immigration updates',
    'immigration expert articles',
    'Canada permanent residency',
    'Canadian visa requirements',
  ],
  alternates: {
    canonical: 'https://pathpr.ca/blogs',
  },
};


// Server Component - handles data fetching
async function fetchBlogs(): Promise<{
    blogs: BlogPostNew[];
    categories: string[];
    tags: string[];
}> {
    try {
        // Replace with your actual API endpoint

        const response = await api.get('/blog');

        if (response.status !== 200) {
            throw new Error(`Failed to fetch blogs: ${response.status}`);
        }   

        const blogs: BlogPostNew[] = response.data;

        // Extract unique categories and tags
        const uniqueCategories = Array.from(
            new Set(blogs.flatMap((blog) => blog.categories || []))
        ) as string[];

        const uniqueTags = Array.from(
            new Set(blogs.flatMap((blog) => blog.tags || []))
        ) as string[];

        const categories = ['All Categories', ...uniqueCategories];
        const tags = ['All Tags', ...uniqueTags];

        return {
            blogs,
            categories,
            tags,
        };
    } catch (error) {
        console.error('Error fetching blogs:', error);

        return {
            blogs: [],
            categories: ['All Categories'],
            tags: ['All Tags'],
        };
    }
}

export default async function BlogListingPage() {
    const { blogs, categories, tags } = await fetchBlogs();

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen mt-8">
                <div className="hidden md:block absolute inset-0 pointer-events-none w-full mt-20">
                    <VantaHaloBackground xOffset={0.25} yOffset={0.0} size={1.5} height='10vh' />
                </div>
                <div className="block md:hidden absolute inset-0 pointer-events-none w-full mt-20">
                    <VantaHaloBackground xOffset={0.35} yOffset={0.4} size={1.5} height='10vh' />
                </div>
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white my-4">Immigration Blogs</h1>
                    <p className="text-sm md:text-lg text-gray-300 max-w-3xl">
                        In-depth articles, guides, and expert analysis on Canadian immigration pathways, requirements, and processes.
                    </p>
                </div>

                {/* Client Component for interactive functionality */}
                <ClientOnly fallback={<AutoShimmer />}>
                    <BlogListingClient
                        initialBlogs={blogs}
                        categories={categories}
                        tags={tags}
                    />
                </ClientOnly>
            </div>
        </Layout>
    );
}