const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const {TEST_DATABASE_URL} = require('../config');

const mongoose = require('mongoose');

const {Entry, Prompts} = require('../entry/entryModels');

const expect = chai.expect;

chai.use(chaiHttp);

function seedDB(){
	const entry_array = [];

	for(let i = 0; i < 30; i++){
		entry_array.push(generateRandomSeedEntry());
	}

	return Entry.insertMany(entry_array);
}

// for seeding db
function generateRandomSeedEntry(){
	const year = 2018;
	const month = Math.floor(Math.random() * (new Date().getMonth() + 1));

	// obviously most months have 30 or 31 days, but that adds an unnecessary level of complexity, so we will just pretend every month has 28 days.
	const date = Math.floor(Math.random() * 28);
	const emotionStates = ['happy', 'sad', 'angry', 'confused', 'afraid', 'surprised', 'disgusted'];
	const randomStrings = [
		'laksjdf;lj',
		'jsbdo',
		'qowri',
		'psdkfjoouh',
		'owueryhbj',
		'lxcoshdfh',
		'qwuerhnkl',
		'xucghipji',
		'asjofubouhf',
		'bsjdofnsig',
		'coihwur',
		'doiwpjhou'
	]

	let obj = {
		date: date,
		month: month,
		year: year,
		'daily_emotion': emotionStates[Math.floor(Math.random() * emotionStates.length)],
		'emotion_summary': randomStrings[Math.floor(Math.random() * randomStrings.length)],
		'optional_prompts': []
	}

	for(let i = 0; i < Prompts.length; i++){
		if(Math.random() < 0.3){
			obj['optional_prompts'].push({
				prompt: Prompts[i].prompt,
				answer: randomStrings[Math.floor(Math.random() * randomStrings.length)]
			});
		}
	}

	return obj;
}

// for simulating a POST request
function generateRandomCreateEntry(){
	const emotionStates = ['happy', 'sad', 'angry', 'confused', 'afraid', 'surprised', 'disgusted'];
	const randomStrings = [
		'laksjdf;lj',
		'jsbdo',
		'qowri',
		'psdkfjoouh',
		'owueryhbj',
		'lxcoshdfh',
		'qwuerhnkl',
		'xucghipji',
		'asjofubouhf',
		'bsjdofnsig',
		'coihwur',
		'doiwpjhou'
	]

	let obj = {
		'daily-emotion': emotionStates[Math.floor(Math.random() * emotionStates.length)],
		'emotion-summary': randomStrings[Math.floor(Math.random() * randomStrings.length)],
	}

	for(let i = 0; i < Prompts.length; i++){
		if(Math.random() > 0.3){
			obj[`text-prompt-${i}`] = randomStrings[Math.floor(Math.random() * randomStrings.length)];
		}
	}

	return obj;
}

function emptyDb(){
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('Test Rest API', function(){
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function(){
		return seedDB();
	});

	afterEach(function(){
		return emptyDb();
	});

	after(function(){
		return closeServer();
	});

	describe('POST New Entry', function(){
		it('a new entry should be posted to the server and database', function(){
			const newEntry1 = generateRandomCreateEntry();
			return chai.request(app)
				.post('/entries/test')
				.set('Accept','application/json')
				.send(newEntry1)
				.then(function(res){
					expect(res).to.have.status(201);
					expect(res).to.be.json;
					expect(res.body).to.be.a('object');
					expect(res.body).to.include.keys('daily_emotion', 'emotion_summary', 'date', 'month', 'year');
					expect(res.body.id).to.not.be.null;
					expect(res.body.date).to.equal(new Date().getDate());
					expect(res.body.month).to.equal(new Date().getMonth());
					expect(res.body.year).to.equal(new Date().getFullYear());
					expect(res.body.daily_emotion).to.equal(newEntry1['daily-emotion']);
					expect(res.body.emotion_summary).to.equal(newEntry1['emotion-summary']);

					const prompts_list = res.body.optional_prompts;

					expect(prompts_list).to.be.a('array');

					// test values inside optional_prompts if they exist and are formatted correctly
					if(prompts_list.length > 0){
						let prompt_key_ids = Object.keys(newEntry1).filter(key => {
							if(key.search('text-prompt') >= 0){
								return key;
							}
						});

						prompt_key_ids = prompt_key_ids.map(key => {
							return key.split('-')[2];
						})

						for(let i = 0; i < prompts_list.length; i++){
							expect(prompts_list[i].prompt).to.equal(Prompts[prompt_key_ids[i]].prompt);
							expect(prompts_list[i].answer).to.equal(newEntry1[`text-prompt-${prompt_key_ids[i]}`]);
						}
					}
					
					return Entry.findById(res.body.id);
				})
				.then(function(entry){
					expect(entry.daily_emotion).to.equal(newEntry1['daily-emotion']);
					expect(entry.emotion_summary).to.equal(newEntry1['emotion-summary']);
				});
		});
	});

	describe('GET Month Entries', function(){
		it('should get every entry for a given month', function(){
			const query = `?month=${Math.floor(Math.random() * (new Date().getMonth() + 1))}&year=2018`;

			let resEntry;
			return chai.request(app)
				.get('/entries/monthly' + query)
				.set('Accept','application/json')
				.then(function(res){
					expect(res).to.have.status(200);
					expect(res.body).to.be.a('object');
					expect(res.body.entries).to.be.a('array');

					const entries = [];

					for(let i = 0; i < res.body.entries.length; i++){
						expect(res.body.entries[i]).to.be.a('object');
						expect(res.body.entries[i]).to.include.keys('id', 'daily_emotion', 'emotion_summary', 'date', 'month', 'year', 'optional_prompts');
					}

					resEntry = res.body.entries[0];
					entry = Entry.findById(resEntry.id);

					return entry;
				})
				.then(function(entry){
					expect(entry.id).to.equal(resEntry.id);
					expect(entry.daily_emotion).to.equal(resEntry.daily_emotion);
					expect(entry.emotion_summary).to.equal(resEntry.emotion_summary);
				});
		});
	});

	describe('GET Prompts', function(){
		it('GET and compare all the prompts saved in entryModels.js with what is returned', function(){
			let resEntry;
			return chai.request(app)
				.get('/entries/prompts')
				.set('Accept','application/json')
				.then(function(res){
					expect(res).to.have.status(200);
					expect(res.body.prompts).to.be.a('array');

					for(let i = 0; i < res.body.prompts.length; i++){
						const prompt = res.body.prompts[i].prompt;

						expect(prompt).to.equal(Prompts[i].prompt);
						expect(i).to.equal(Prompts[i].id);
					}
				});
		});
	});

	describe('DELETE Entry', function(){
		let entry;
		it('should delete an entry based off of an id', function(){
			return Entry
				.findOne()
				.then(function(entryToDelete){
					entry = entryToDelete;
					return chai.request(app).delete('/entries/' + entry.id)
				})
				.then(function(res){
					expect(res).to.have.status(204);
					return Entry.findById(entry.id);
				})
				.then(function(entryToDelete){
					expect(entryToDelete).to.be.null;
				});
		});
	});
});