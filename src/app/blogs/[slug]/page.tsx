// app/blogs/[slug]/page.tsx (App Router)

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    Clock,
    User,
    Calendar,
    ArrowLeft,
    Share2,
    Tag as TagIcon,
    Facebook,
    Twitter,
    Linkedin,
    MessageCircle
} from 'lucide-react';
import ShareButtons from './ShareButtons';
import api from '@/utils/axios';    
import ClientWrapperForLayout from '@/components/layout/ClientWrapperForLayout';
// Types
interface Author {
    name: string;
    avatarUrl?: string;
}

interface SEO {
    metaTitle?: string;
    metaDescription?: string;
    openGraphImageUrl?: string;
    metaKeywords?: string[];
}

interface ImageData {
    src: string;
    alt: string;
    caption?: string;
}

interface VideoData {
    url: string;
    type: 'youtube' | 'vimeo' | 'mp4';
    caption?: string;
}

interface TableData {
    headers: string[];
    rows: string[][];
    caption?: string;
}

interface BlogPostNew {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    thumbnailUrl?: string;
    author: Author;
    categories: string[];
    tags?: string[];
    publishedAt?: string;
    createdAt: string;
    readingTime?: number;
    seo?: SEO;
    imageData?: ImageData[];
    videoData?: VideoData[];
    tableData?: TableData[];
}

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Data fetching function
async function getBlogPost(slug: string): Promise<BlogPostNew | null> {
    try {
        const response = await api.get(`/blog/${slug}`);

        if (response.status !== 200) {
            return null;
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

// async function getRelatedPosts(category: string, slug: string): Promise<BlogPostNew[]> {
//     try {
//         const response = await api.get(`/blog/related-category/${category}/${slug}`);

//         if (response.status !== 200) {
//             return [];
//         }

//         return response.data;
//     } catch (error) {
//         console.warn('Failed to fetch related posts:', error);
//         return [];
//     }
// }

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        return {
            title: 'Blog Post Not Found',
            description: 'The requested blog post could not be found.',
        };
    }

    const title = post.seo?.metaTitle || post.title;
    const description = post.seo?.metaDescription || post.excerpt;
    const image = post.seo?.openGraphImageUrl || post.thumbnailUrl;
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pathpr.ca'}/blogs/${post.slug}`;

    return {
        title,
        description,
        keywords: post.seo?.metaKeywords?.join(', '),
        authors: [{ name: post.author.name }],
        openGraph: {
            title,
            description,
            url,
            siteName: 'Your Site Name',
            images: image ? [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ] : [],
            locale: 'en_US',
            type: 'article',
            publishedTime: post.publishedAt || post.createdAt,
            authors: [post.author.name],
            section: post.categories[0],
            tags: post.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: image ? [image] : [],
        },
        alternates: {
            canonical: url,
        },
        other: {
            'article:author': post.author.name,
            'article:published_time': post.publishedAt || post.createdAt,
            ...(post.readingTime && { 'reading-time': `${post.readingTime} minutes` }),
        },
    };
}

// Components
const MarkdownRenderer = ({ content }: { content: string }) => (
    <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
    />
);

// const ImageComponent = ({ imageData }: { imageData: ImageData }) => (
//     <figure className="my-8">
//         <img
//             src={imageData.url}
//             alt={imageData.alt}
//             className="w-full rounded-lg shadow-lg"
//         />
//         {imageData.caption && (
//             <figcaption className="mt-2 text-sm text-gray-600 text-center">
//                 {imageData.caption}
//             </figcaption>
//         )}
//     </figure>
// );

import ImageComponent from '@/components/ui/BlogImageComponent';

// const VideoComponent = ({ videoData }: { videoData: VideoData }) => (
//     <div className="my-8">
//         <video
//             src={videoData.url}
//             controls
//             className="w-full rounded-lg shadow-lg"
//             title={videoData.title}
//         />
//         {videoData.description && (
//             <p className="mt-2 text-sm text-gray-600">{videoData.description}</p>
//         )}
//     </div>
// );

import VideoComponent from '@/components/ui/BlogVideoComponent';

// const TableComponent = ({ tableData }: { tableData: TableData }) => (
//     <div className="my-8 overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
//             <thead className="bg-gray-50">
//                 <tr>
//                     {tableData.headers.map((header, index) => (
//                         <th
//                             key={index}
//                             className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                             {header}
//                         </th>
//                     ))}
//                 </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//                 {tableData.rows.map((row, rowIndex) => (
//                     <tr key={rowIndex}>
//                         {row.map((cell, cellIndex) => (
//                             <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 {cell}
//                             </td>
//                         ))}
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//         {tableData.caption && (
//             <caption className="mt-2 text-sm text-gray-600">{tableData.caption}</caption>
//         )}
//     </div>
// );
import TableComponent from '@/components/ui/BlogTableData';


const RelatedPosts = ({ category, slug }: { category: string; slug: string }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <p className="text-gray-600">Related posts for category: {category}</p>
        </div>
    );
};

import ClientHaloWrapper from '@/components/ui/backgrounds/ClientWrapperForHaloBg';
import Card from '@/components/ui/Card';
import CardHeader from '@/components/ui/CardHeader';
import CardContent from '@/components/ui/CardContent';
import CardTitle from '@/components/ui/CardTitle';
import Button from '@/components/ui/Button';
import useAuthStore from '@/store/authStore';
import ClientOnly from '@/components/ClientOnly';
import AutoShimmer from '@/components/AutoShimmer';
import BlogPageSideComponent from '@/components/BlogPageSideComponent';
// import Card from '@/components/ui/Card';
// import CardContent from '@/components/ui/CardContent';
// import CardHeader from '@/components/ui/CardHeader';
// import CardTitle from '@/components/ui/CardTitle';
// import Button from '@/components/ui/Button';
// import useAuthStore from '@/store/authStore';

// Main page component (Server Component)
export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        notFound();
    }

    // const relatedPosts = await getRelatedPosts(post.categories[0], slug);

    return (
        <ClientWrapperForLayout>
            <div className="bg-white">
                {/* Hero section with thumbnail */}
                <div className="hidden md:block absolute inset-0 pointer-events-none w-full mt-20">
                    <ClientHaloWrapper xOffset={0.25} yOffset={0.0} size={1.5} height="15vh" />
                </div>
                <div className="block md:hidden absolute inset-0 pointer-events-none w-full mt-20">
                    <ClientHaloWrapper xOffset={0.35} yOffset={0.4} size={1.5} height="15vh" />
                </div>
                <div className="text-white w-[95%] md:w-[70%] mt-20 z-10 relative flex flex-col gap-4 justify-center h-52 items-start mx-auto">
                    <h1 className="text-xl md:text-2xl font-bold text-white">{post.title}</h1>
                    <p className="text-sm md:text-md text-gray-300 max-w-3xl">
                        {post.excerpt.length > 100 ? post.excerpt.slice(0, 100) + '...' : post.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center text-white text-opacity-90 text-sm md:text-base gap-4 md:gap-6">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            <span>{post.author.name}</span>
                        </div>
                        {post.readingTime && (
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>{post.readingTime} min read</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content section */}
                <div className="px-4 md:px-12 mt-4 py-12">
                    {/* Back to blog link */}
                    <div className="mb-8">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to all blogs
                        </Link>
                    </div>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='w-full md:w-[70%] shadow-lg p-4 rounded-lg'>
                            {/* Categories and tags */}
                            <div className="mb-8 flex flex-wrap gap-2">
                                {post.categories.map(category => (
                                    <span
                                        key={category}
                                        className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm hover:bg-blue-200 transition-colors"
                                    >
                                        {category}
                                    </span>
                                ))}
                                {post.tags && post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm hover:bg-gray-200 transition-colors"
                                    >
                                        <TagIcon className="h-3 w-3 mr-1" />
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Share options - Client Component */}
                            <ShareButtons title={post.title} />

                            {/* Render images if present */}
                            {post.imageData && post.imageData.length > 0 && (
                                <div className="my-8">
                                    {post.imageData.map((image, index) => (
                                        <ImageComponent key={index} imageData={image as ImageData} />
                                    ))}
                                </div>
                            )}

                            {/* Render videos if present */}
                            {post.videoData && post.videoData.length > 0 && (
                                <div className="my-8">
                                    {post.videoData.map((video, index) => (
                                        <VideoComponent key={index} videoData={video as VideoData} />
                                    ))}
                                </div>
                            )}

                            {/* Blog content */}
                            <div className="prose prose-lg max-w-none">
                                <MarkdownRenderer content={post.content} />

                                {/* Render tables if present */}
                                {post.tableData && post.tableData.length > 0 && (
                                    <div className="my-8">
                                        {post.tableData.map((table, index) => (
                                            <TableComponent key={index} tableData={table} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Author section */}
                            <div className="mt-12 p-6 bg-gray-50 rounded-lg flex items-start flex-col md:flex-row gap-4">
                                {post.author.avatarUrl ? (
                                    <img
                                        src={post.author.avatarUrl}
                                        alt={post.author.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="h-8 w-8 text-blue-600" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">About the author</h3>
                                    <p className="text-gray-800 font-medium">{post.author.name}</p>
                                    <p className="mt-2 text-gray-600">
                                        Immigration expert with extensive knowledge of Canadian immigration pathways and processes.
                                        Dedicated to helping newcomers navigate their journey to Canada successfully.
                                    </p>
                                </div>
                            </div>
                        </div>                        
                        <div className='w-full md:w-[30%]'>
                            <BlogPageSideComponent />
                        </div>
                    </div>
                </div>

                {/* Related posts section */}
                {/* {post.categories.length > 0 && (
                    <div className="bg-gray-50 py-12">
                        <div className="max-w-4xl mx-auto px-4">
                            <RelatedPosts category={post.categories[0]} slug={post.slug} />
                        </div>
                    </div>
                )} */}
            </div>
        </ClientWrapperForLayout>
    );
}