import fs from 'fs';
import * as wordlist from './lib/wordlist.json' assert { type: "json" }; 


let lyric = fs.readFileSync('/Users/poomyimyuean/Desktop/Poomkun/Hub/Code/Project/Side-Project/lovesong/src/out/lyrics/มาละวา-บี้-สุกฤษฎิ์.txt', 'utf8'); 
const word = wordlist.default[3];

let lovecount = 0; 

while(lyric.includes(word)) {
	count++;
	lyric = lyric.replace(word, ''); 
}


console.log(count);


