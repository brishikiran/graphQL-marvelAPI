import axios from 'axios';
import md5 from 'blueimp-md5';
import redis from 'redis';
import { GraphQLError } from "graphql";


const client = redis.createClient();
client.connect().then(() => {});
const fetchComicsPage = async (pagenum) => {
    // Check if data is in Redis cache
    const cacheKey = `comicsPage:${pagenum}`;
    const cachedData = await client.get(cacheKey);
  
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  
    // Fetch data from Marvel API
    const ts = new Date().getTime();
    const publickey = 'c0bb02644e059a79963e758b26fa34f4';
    const privatekey = 'a542f837e2ef34ab7cdb35dbd4f8b972f821ba3f';
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
    const url = `${baseUrl}?ts=${ts}&apikey=${publickey}&hash=${hash}&offset=${(pagenum - 1) * 50}&limit=50`;
  
    try {
      const response = await axios.get(url);
      const comics = response.data.data.results;
  
      // Store data in Redis cache
      await client.set(cacheKey, JSON.stringify(comics));
  
      return comics;
    } catch (error) {
      throw new GraphQLError("Error fetching data from Marvel API", {
        extensions: { code: "NOT_FOUND" },
      });
    }
  };

const fetchComicById = async (id) => {
  // Check if data is in Redis cache
  const cacheKey = `comic:${id}`;
  const cachedData = await client.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Fetch data from Marvel API
  const ts = new Date().getTime();
  const publickey = 'c0bb02644e059a79963e758b26fa34f4';
  const privatekey = 'a542f837e2ef34ab7cdb35dbd4f8b972f821ba3f';
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  const baseUrl = `https://gateway.marvel.com:443/v1/public/comics/${id}`;
  const url = `${baseUrl}?ts=${ts}&apikey=${publickey}&hash=${hash}`;

  try {
    const response = await axios.get(url);
    const comic = response.data.data.results[0];

    // Store data in Redis cache
    await client.set(cacheKey, JSON.stringify(comic));

    return comic;
  } catch (error) {
    throw new GraphQLError("Error fetching data from Marvel API", {
        extensions: { code: "NOT_FOUND" },
      });
  }
};

export { fetchComicsPage, fetchComicById };
