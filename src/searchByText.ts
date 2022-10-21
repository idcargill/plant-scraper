import axios, { AxiosResponse } from 'axios';
import { load } from 'cheerio';
import { readFileSync, writeFileSync } from 'fs';
import { getPlantTableData } from './getPlantTableData';
import dotenv  from 'dotenv';
import env from 'env-var';
dotenv.config();
export interface CacheData {
  [key:string] : string
}

const PLANT_VIEW_URL = env.get('PLANT_VIEW_URL').asString();
const CACHE_FILE = './plantCache.txt';

export const getPlantUrlFromHtml = async (url:string): Promise<string | Error> => {
  try {
    const response:AxiosResponse = await axios.get(url, {timeout: 1000});
    const $ = load(response.data);
    const plantDataUrl:string | undefined =  $('td > a').attr('href');
    if (plantDataUrl){
      return plantDataUrl;
    }
    throw new Error;
  } catch (e) {
    console.log('Plant url was not found from HTML');
    throw new Error('Error getting plant URL by text');
  }
}

// Entry point
export const plantDataByTextSearch = async (url: string): Promise<string> => {
  let plantID:string;
  let cacheData:CacheData = {};

  const plantUrl = await getPlantUrlFromHtml(url);

  if (typeof plantUrl !== 'string') {
    return 'bad url';
  };

  const searchUrl = `${PLANT_VIEW_URL}${plantUrl}`;

  if (plantUrl) {
    const plantMatch = plantUrl?.match(/[0-9]+/);

    if (plantMatch) {
      plantID = plantMatch[0];

      try {
        const cacheRaw = readFileSync(CACHE_FILE, 'utf-8');
        cacheData = JSON.parse(cacheRaw);
        if (cacheData && plantID) {
          const plantInfo = cacheData[plantID];
          if (plantInfo) {
            console.log('cache file hit');
            return plantInfo;
          }
        }
      } catch(e) {
        console.log(`Problem reading from ${CACHE_FILE}`);
        writeFileSync(CACHE_FILE, '');
      }

      const data = await getPlantTableData(searchUrl);
      cacheData[plantID] = data;
      const jsonCache = JSON.stringify(cacheData);
      writeFileSync(CACHE_FILE, jsonCache);
      return data;
    }
  }
  return 'bad url';
}


