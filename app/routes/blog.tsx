// blog.tsx
import { json } from '@remix-run/node';
import { Link, useLoaderData, useLocation } from '@remix-run/react';
import { gql } from 'graphql-request';
import { hygraph } from '~/utils/hygraph.server';
import type { Post } from '~/utils/interface';
import { useState, useEffect } from 'react';
import Pagination from '~/components/Paginator';

interface PostsResponse {
  posts: Post[];
}

export async function loader({ request: req }: { request: Request }) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const postsPerPage = 3; // Changed to any number you want
  const start = (page - 1) * postsPerPage;

  const query = gql`
    query Posts {
      posts {
        createdAt
        id
        overview
        slug
        title
        updatedAt
      }
    }
  `;

  const response = await hygraph.request<PostsResponse>(query);
  const totalPosts = response.posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const postsForPage = response.posts.slice(start, start + postsPerPage);

  return json({ posts: postsForPage, totalPages });
}

const Blog = () => {
  const { posts, totalPages: totalPagesFromData } = useLoaderData() as PostsResponse & { totalPages: number };
  const [totalPages, setTotalPages] = useState(totalPagesFromData);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const page = Number(params.get('page')) || 1;

  useEffect(() => {
    setTotalPages(totalPagesFromData);
  },[]);


  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"></div>
     <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            All Blog Posts
          </h1>
        </div>
        <ul>
          {posts.map((post) => (
            <li key={5} className="py-4">
              <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                <div>
                  <p className="text-base font-medium leading-6 text-teal-500">
                    {new Date(post.createdAt).toISOString().split("T")[0]}
                  </p>
                </div>

                <Link
                  to={`/post/${post.slug}`}
                  className="space-y-3 xl:col-span-3"
                  prefetch="intent"
                >
                  <div>
                    <h3 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
                      {post.title}
                    </h3>
                  </div>
                  <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                    {post.overview}
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
        <div>
          <div className="pt-8 fixed bottom-15 left-0 right-0">
            {totalPages > 1 && <Pagination page={page} total={totalPages} />}
          </div>
        </div>
    </div>
    </>
  )

};

export default Blog;