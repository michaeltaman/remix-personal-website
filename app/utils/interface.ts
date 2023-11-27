export interface Post {
  createdAt: string;
  id: string;
  overview: string;
  slug: string;
  title: string;
  updatedAt: string;
}

export interface PostId {
  post: {
    id: string;
    overview: string;
    title: string;
    slug: string;
    publishedAt: string;
    body: any;
  };
}

export interface Project {
  id: string;
  link: string;
  title: string;
  overview: string;
  titleImage: {
    url: string;
  };
  publishedAt: string;
}
