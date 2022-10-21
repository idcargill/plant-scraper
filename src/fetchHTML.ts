import axios from 'axios';
import { load } from 'cheerio';
import { CheerioAPI } from 'cheerio';
 
// Fetch Url Text and Cache
export const fetchHTML = async (url: string): Promise<CheerioAPI| null> => {
  try {
    const pageData = await axios.get(url);
    return load(pageData.data);
  } catch(e) {
    console.log('Error getting page HTML');
    return null;
  }
}