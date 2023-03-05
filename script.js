
// constante
const http = require("http");
const path = require("path");
const fs = require("fs");
const url = require("url");

// tot continutul mapei
const data = path.join(__dirname,"data");

const server = http.createServer((request, response)=>{
	if(request.url == "/joc" && request.method == "GET"){
		getAllJokes(request,response);
	}
	if(request.url == "/joc" && request.method == "POST"){
		addJoke(request,response);
	}
	if(request.url.startsWith('/like')){
		like(request,response);
	}
	if(request.url.startsWith('/disLikes')){
		disLike(request,response);
	}

});

server.listen(3000);

// functie de convertirea si citirea fisierilor pe rand
function getAllJokes(request, response){
	// citest tot continutul = readdir
	let dir = fs.readdirSync(data);
	let allJokes = [];
	for(let i=0;i<dir.length;i++){
		// citeste doar un fisier = readFile
		let file = fs.readFileSync(path.join(data,i+".json"));
		let jokeJson = Buffer.from(file).toString();
		let joke = JSON.parse(jokeJson);

		joke.id = i;

		allJokes.push(joke);
	}
	response.end(JSON.stringify(allJokes));
}

// lectia 2 (post)
function addJoke (request, response){
	let date = '';
	request.on('data',function(c){
		// c = o bucata
		date += c;

	});
	request.on('end',function(){
		let joke = JSON.parse(date);
		joke.likes = 0;
		joke.dislikes = 0;

		let dir = fs.readdirSync(data);
		let filename = dir.length+'.json';
		let filePath = path.join(data,filename);
		fs.writeFileSync(filePath,JSON.stringify(joke));

		response.end();
	});
}

// adaugarea de likuri

function like(request, response){
	const url = require("url");

	const params = url.parse(request.url,true).query;

	let id = params.id;
	console.log(id);

	if(id){
		let filePath = path.join(data,id+'.json');
		let file = fs.readFileSync(filePath);
		let jokeJson = Buffer.from(file).toString();
		let joke = JSON.parse(jokeJson);

		joke.likes++;

		fs.writeFileSync(filePath,JSON.stringify(joke));

	}
	response.end();
}

function disLike(request, response){
	const url = require("url");

	const params = url.parse(request.url,true).query;

	let id = params.id;
	console.log(id);

	if(id){
		let filePath = path.join(data,id+'.json');
		let file = fs.readFileSync(filePath);
		let jokeJson = Buffer.from(file).toString();
		let joke = JSON.parse(jokeJson);

		joke.dislikes++;

		fs.writeFileSync(filePath,JSON.stringify(joke));

	}
	response.end();
}