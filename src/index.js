import puppeteer from 'puppeteer'; 
import { config } from './config/config.js'; 
import fs from 'fs';
import * as wordlist from './lib/wordlist.json' assert { type: "json" }; 
import * as inputSet from './lib/input.json' assert { type: "json" }; 

let track;
let artist;  

let data = [];  

const index = async() => {
	const browser = await puppeteer.launch({ headless: config.isHeadless });
	const page = await browser.newPage(); 

	for(let i = 0; i < inputSet.default.length; i++) {
		track = inputSet.default[i].track;
		artist = inputSet.default[i].artist;   

		track = track.toLowerCase().split(" ").join("-");
		artist = artist.toLowerCase().split(" ").join("-");

		const parameter = track + "-" + artist;

		const url = config.baseURL + parameter;

		await page.goto(url); 

		const selector = "#main_content"; 
	
		await page.waitForSelector(selector);
		let element = await page.$(selector);
		let value = await page.evaluate(el => el.textContent, element); 

		const loveWord = wordlist.default[3];
		const likeWord = wordlist.default[4];
		const iWord = wordlist.default[5];
		const youWord = wordlist.default[0];
		const heartWord = wordlist.default[5];
		const gfbfWord = wordlist.default[wordlist.default.length - 2];

		let loveWordCount = 0;
		let likeWordCount = 0;
		let iWordCount = 0;
		let youWordCount = 0;
		let heartWordCount = 0;
		let gfbfWordCount = 0;

		while(value.includes(loveWord)) {
			loveWordCount++;
			value = value.replace(loveWord, ''); 
		}

		while(value.includes(likeWord)) {
			likeWordCount++;
			value = value.replace(likeWord, ''); 
		}

		while(value.includes(iWord)) {
			iWordCount++;
			value = value.replace(iWord, ''); 
		}

		while(value.includes(youWord)) {
			youWordCount++;
			value = value.replace(youWord, ''); 
		}

		while(value.includes(heartWord)) {
			heartWordCount++;
			value = value.replace(heartWord, ''); 
		}

		while(value.includes(gfbfWord)) {
			gfbfWordCount++;
			value = value.replace(gfbfWord, ''); 
		}
		
		const lyricData = {
			"track": track,
			"artist": artist,
			"URL": url,
			"counts": {
				"รัก": loveWordCount,
				"ชอบ": likeWordCount,
				"ฉัน": iWordCount,
				"คุณ": youWordCount,
				"ใจ": heartWordCount,
				"แฟน": gfbfWordCount  
			}
		}

		data.push(lyricData);

	}
	
	await page.close();
	await browser.close(); 

	fs.writeFileSync(`./out/data/lyrics.json`, JSON.stringify(data, null, 2)); 
};


index(); 