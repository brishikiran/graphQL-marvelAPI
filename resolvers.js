import { fetchComicsPage, fetchComicById } from './marvelAPI.js';

const resolvers = {
  Query: {
    comicsPage: (_, { pagenum }) => fetchComicsPage(pagenum),
    comic: (_, { id }) => fetchComicById(id),
  },
};

export { resolvers };
