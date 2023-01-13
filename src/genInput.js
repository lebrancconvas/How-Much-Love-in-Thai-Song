import puppeteer from 'puppeteer'; 
import fs from 'fs'; 
import { config } from './config/config.js';

// const selector = "body > div.rh-outer-wrap > div.rh-container > div > div > div:nth-child(2) > div:nth-child(1) > div.rh_grid_image_wrapper > div.newsdetail.newstitleblock.rh_gr_right_sec > h2 > a";
// const selector2 = "body > div.rh-outer-wrap > div.rh-container > div > div > div:nth-child(2) > div:nth-child(2) > div.rh_grid_image_wrapper > div.newsdetail.newstitleblock.rh_gr_right_sec > h2 > a"; 

const url = config.baseURL;

const input = [];

const genInput = async() => {
	const browser = await puppeteer.launch({ headless: config.isHeadless });
	const page = await browser.newPage();

	await page.goto(url);

	for(let i = 1; i <= 10; i++) {
		const selector = `body > div.rh-outer-wrap > div.rh-container > div > div > div:nth-child(2) > div:nth-child(${i}) > div.rh_grid_image_wrapper > div.newsdetail.newstitleblock.rh_gr_right_sec > h2 > a`;
		const element = await page.$(selector);
		const value = await page.evaluate(el => el.textContent, element);
		
		const track = value.split(" – ")[0]; 
		const artist = value.split(" – ")[1];  

		const inputData = {
			"track": track,
			"artist": artist 
		}

		input.push(inputData);

	}

	await page.close();
	await browser.close();

	fs.writeFileSync('./lib/input.json', JSON.stringify(input, null, 2)); 
};

genInput();