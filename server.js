const express = require('express');
const app = express();

const morgan = require('morgan');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
// const {Recipes} = require('./models');

app.use(express.static('public'));
app.use(morgan('common'));

let server;

function runServer(databaseURL, port = PORT){
	return new Promise((resolve, reject) =>{
		mongoose.connect(databaseURL, err => {
			if(err){
				return reject(err);
			}

			server = app.listen(port, () => {
				console.log(`Your app is listening on Port: ${port}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer(){
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing Server');
			server.close(err => {
				if(err){
					reject(err);
					return;
				}
				resolve();
			});
		});
	});
}

if (require.main === module){
	runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};