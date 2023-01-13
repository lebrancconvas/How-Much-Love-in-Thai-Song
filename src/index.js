import puppeteer from 'puppeteer'; 
import { config } from './config/config.js'; 
import fs from 'fs';
import * as wordlist from './lib/wordlist.json' assert { type: "json" }; 

let track = config.track;
let artist = config.artist; 

let data = [];

track = track.toLowerCase().split(" ").join("-");
artist = artist.toLowerCase().split(" ").join("-");

const parameter = track + "-" + artist;

const url = config.baseURL + parameter; 

const index = async() => {
	const browser = await puppeteer.launch({ headless: config.isHeadless });
	const page = await browser.newPage(); 
	// const baseURL = "https://music.guchill.com/";

	await page.goto(url); 

	const selector = "#main_content"; 

	await page.waitForSelector(selector);
	let element = await page.$(selector);
	let value = await page.evaluate(el => el.textContent, element); 

	
	await page.close();
	await browser.close(); 

	return value;
};

index()
	.then(res => {
		const loveWord = wordlist.default[3];
		const likeWord = wordlist.default[4];
		const iWord = wordlist.default[5];
		const youWord = wordlist.default[0];

		let loveWordCount = 0;
		let likeWordCount = 0;
		let iWordCount = 0;
		let youWordCount = 0;

		while(res.includes(loveWord)) {
			loveWordCount++;
			res = res.replace(loveWord, ''); 
		}

		while(res.includes(likeWord)) {
			likeWordCount++;
			res = res.replace(likeWord, ''); 
		}

		while(res.includes(iWord)) {
			iWordCount++;
			res = res.replace(iWord, ''); 
		}

		while(res.includes(youWord)) {
			youWordCount++;
			res = res.replace(youWord, ''); 
		}
		
		const lyricData = {
			"track": config.track,
			"artist": config.artist,
			"URL": url,
			"counts": {
				"รัก": loveWordCount,
				"ชอบ": likeWordCount,
				"ฉัน": iWordCount,
				"คุณ": youWordCount  
			}
		}

		data.push(lyricData);

		fs.writeFileSync(`./out/data/lyrics.json`, JSON.stringify(data, null, 2));
	})
	.catch(err => {
		console.error(err);
		console.log(`[ERROR]: Scraping Error`); 
	})

// index();