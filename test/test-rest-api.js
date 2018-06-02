const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const {TEST_DATABASE_URL} = require('../config');

const {Entry} = require('../entry/entryModels');

const expect = chai.expect;

chai.use(chaiHttp);

function generateRandomEntry(){
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

	return {
		'daily-emotion': emotionStates[Math.floor(Math.random() * emotionStates.length)],
		'emotion-summary': randomStrings[Math.floor(Math.random() * randomStrings.length)],
	}
}

describe('Post New Entry', function(){
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	after(function(){
		return closeServer();
	});

	it('a new entry should be posted to the server and database', function(){
		const newEntry1 = generateRandomEntry();
		return chai.request(app)
			.post('/entries/test')
			.set('Accept','application/json')
			.send(newEntry1)
			.then(function(res){
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys('daily_emotion', 'emotion_summary');
				expect(res.body.id).to.not.be.null;
				expect(res.body.daily_emotion).to.equal(newEntry1['daily-emotion']);
				expect(res.body.emotion_summary).to.equal(newEntry1['emotion-summary']);

				return Entry.findById(res.body.id);
			})
			.then(function(entry){
				expect(entry.daily_emotion).to.equal(newEntry1['daily-emotion']);
				expect(entry.emotion_summary).to.equal(newEntry1['emotion-summary']);
			});
	});
});