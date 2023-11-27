import {json } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { gql } from "graphql-request";
import { hygraph } from "~/utils/hygraph.server";
import type { Project } from "~/utils/interface";
import type { Request } from 'node-fetch';
import Pagination from "~/components/Paginator";
import React, { useEffect, useState , Suspense } from "react";




interface ProjectsResponse {
    projects: Project[];
  }

export async function loader({ request: req }: { request: Request }) {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const projectsPerPage = 6; // Changed to any number you want
    const start = (page - 1) * projectsPerPage;



    const query = gql`
    query MyQuery($skip: Int, $first: Int) {
      projects(orderBy: publishedAt_ASC, skip: $skip, first: $first) {
        id
        link
        overview
        title
        titleImage {
          url
        }
        publishedAt
      }
    }
  `;

    const response = await hygraph.request<ProjectsResponse>(query);
    const totalProjects = response.projects.length;
    const totalPages = Math.ceil(totalProjects / projectsPerPage);
    const projectsForCurrentPage = response.projects.slice(start, start + projectsPerPage);

    return json({ projects: projectsForCurrentPage, totalPages });
  }


  const Projects = () => {
    const { projects, totalPages: totalPagesFromData } = useLoaderData() as ProjectsResponse & { totalPages: number };
    const [totalPages, setTotalPages] = useState(totalPagesFromData);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const page = Number(params.get('page')) || 1;

    useEffect(() => {
      setTotalPages(totalPagesFromData);
    },[]);

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="space-2 pt-6 pb-8 md:space-y-5">
                        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                            All Projects
                        </h1>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-8 pt-8 pb-8 ">
                        {projects.map((project, index) => (
                            <Suspense fallback={<div>Loading...</div>} key={index}>
                                <article key={index} className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800 dark:shadow-gray-700/25 ">
                                    <img
                                        src={project.titleImage.url}
                                        alt="Project"
                                        className="h-58 w-full object-scale-down transition-transform duration-300 transform hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="p-4 sm:p-4">
                                        <a href={project.link} target="_blank" rel="noreferrer">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                {project.title}
                                            </h3>
                                        </a>

                                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                            {project.overview.length > 80 ? project.overview.substring(0, 80) + "..." : project.overview}
                                        </p>

                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-500"
                                        >
                                            Learn More!
                                            <span className="block transition-all group-hover:ms-0.5">
                                                &rarr;
                                            </span>
                                        </a>
                                    </div>
                                </article>
                            </Suspense>
                        ))}
                    </div>
                    <div className={projects.length <= 3 ? "pt-94" : "pt-1"}>
                        <div className="pt-4 pb-4 relative left-0 right-0 bottom-0">
                            {totalPages > 1 && <Pagination page={page} total={totalPages} />}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Projects;
