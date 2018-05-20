const express = require('express');
const app = express();

const morgan = require('morgan');

app.use(express.static('public'));
app.use(morgan('common'));

let server;

function runServer(){
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) =>{
		server = app.listen(port, () => {
			resolve(server);
		})
		.on('error', err => {
			reject(err);
		});
	});
}

function closeServer(){
	return new Promise((resolve, reject) => {
		server.close(err => {
			if(err){
				reject(err);
				return;
			}
			resolve();
		});
	});
}

if (require.main === module){
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};