//require node.js module
var http = require('http');
var fs = require('fs');
var url = require('url');

//sync read jsonfile before creating server
var contents = fs.readFileSync('assets/json/nytimes.json');
var jsonContents = JSON.parse(contents);
console.log('finish reading jsonfile...');

var htmlFile;
var cssFile;
var scriptFile;

//Create a server
http.createServer(function(request,response){
	var pathname = url.parse(request.url).pathname;
	//read frontend html file
	htmlFile = fs.readFileSync('a3.html');
	//read frontend css file
	cssFile = fs.readFileSync('assets/css/a3.css');
	//read frontend js file
	scriptFile = fs.readFileSync('assets/script/client.js');
	//handle different request based on urls
	switch(pathname.substr(1)){
		//send back css file to front-end
		case 'a3.css':
			response.writeHead(200,{'Content-Type':'text/css'});
			response.write(cssFile);
			response.end();
			break;
		//send back js file to front-end
		case 'client.js':
			response.writeHead(200,{'Content-Type':'script'});
			response.write(scriptFile);
			response.end();
			break;
		//send articles info to front-end 
		case 'articles':
			var jsonObj = [];
			//loop nytimes.results
			for(var i = 0; i < jsonContents[0].num_results; i++){
				//retrive info from every entry
				var entry = {};
				entry["published_date"] = jsonContents[0].results[i].published_date;
				entry["title"] = jsonContents[0].results[i].title;
				entry["abstract"] = jsonContents[0].results[i].abstract;
				entry["short_url"] = jsonContents[0].results[i].short_url;
				jsonObj.push(entry);
			}
			//jsonObj.push(jsonContents[0].num_results);
			response.writeHead(200,{'Content-Type':'application/json'});
			//send json string back to client
			response.write(JSON.stringify(jsonObj));
			response.end();
			break;
		case 'authors':
			var jsonObj = [];
			//loop nytimes.results
			for(var i = 0; i < jsonContents[0].num_results; i++){
				var entry;
				//remove the 'By' in the string and transform to capital case
				entry = jsonContents[0].results[i].byline.slice(3).toUpperCase();
				jsonObj.push(entry);
			}
			//add # of results to the final array
			jsonObj.push(jsonContents[0].num_results);
			response.writeHead(200,{'Content-Type':'application/json'});
			response.write(JSON.stringify(jsonObj));
			response.end();
			break;
		case 'urls':
			var jsonObj = [];
			//loop nytimes.results
			for(var i = 0; i < jsonContents[0].num_results; i++){
				var entry = {};
				//retrive info from every entry
				entry["published_date"] = jsonContents[0].results[i].published_date;
				entry["short_url"] = jsonContents[0].results[i].short_url;
				jsonObj.push(entry);
			}
			response.writeHead(200,{'Content-Type':'application/json'});
			response.write(JSON.stringify(jsonObj));
			response.end();
			break;
		case 'tag':
			var jsonObj = {};
			//use json object as a hashmap to store distinct tags and count their numbers of occurance
			//loop nytimes.results
			for(var i = 0;i < jsonContents[0].num_results; i++){
				//loop tags of each entry
				for(var j = 0;j < jsonContents[0].results[i].des_facet.length;j++){
					//add all tags of first entry and sent counting one
					if(i == 0){
						jsonObj[jsonContents[0].results[i].des_facet[j]] = 1;
					}else{
						//check if tag exists
						if(jsonContents[0].results[i].des_facet[j] in jsonObj){
							//increase counting numbers
							jsonObj[jsonContents[0].results[i].des_facet[j]]++;
						}else{
							//add new tag
							jsonObj[jsonContents[0].results[i].des_facet[j]] = 1;
						}
					}
				}
			}
			response.writeHead(200,{'Content-Type':'application/json'});
			response.write(JSON.stringify(jsonObj));
			response.end();
			break;
		case 'oneArticle':
			var num;
			var jsonObj = {};
			request.on('data',function(data){
				num = data.toString();
				//check if the num of request exceed the number of entries in result
				if(num >= jsonContents[0].num_results || num < 0){
					//error
					jsonObj = jsonContents[0].num_results;
				}
				else{
					//retrive info of a specific entry
					jsonObj["section"] = jsonContents[0].results[num].section;
					jsonObj["subsection"] = jsonContents[0].results[num].subsection;
					jsonObj["title"] = jsonContents[0].results[num].title;
					jsonObj["abstract"] = jsonContents[0].results[num].abstract;
					jsonObj["byline"] = jsonContents[0].results[num].byline;
					jsonObj["published_date"] = jsonContents[0].results[num].published_date;
					jsonObj["des_facet"] = jsonContents[0].results[num].des_facet;
				}
				response.writeHead(200,{'Content-Type':'application/json'});
				response.write(JSON.stringify(jsonObj));
				response.end();		
			});
			break;
		case 'imgs':
			var jsonObj = [];
			////loop nytimes.results
			for(var i = 0;i < jsonContents[0].num_results; i++){
				var entry = {};
				//if the article has multimedia field then add img url
				if(jsonContents[0].results[i].multimedia != 0){
					entry["multimedia"] = jsonContents[0].results[i].multimedia[0].url;
					entry["caption"] = jsonContents[0].results[i].multimedia[0].caption;
				}
				//if not, just add title
				else
					entry["title"] = jsonContents[0].results[i].title;
				entry["url"] = jsonContents[0].results[i].url;
				jsonObj.push(entry);	
			}
			response.writeHead(200,{'Content-Type':'application/json'});
			response.write(JSON.stringify(jsonObj));
			response.end();
			break;
		default:
			//send back html file to front-end
			response.writeHead(200,{'Content-Type':'text/html'});
			response.write(htmlFile);
			response.end();
	}	
}).listen(8080);
