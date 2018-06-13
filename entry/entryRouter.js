const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const {Prompts} = require('./prompts');
const {User} = require('../user/userModels')

const {param, body, query, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

// returns the username from a request 'authorization' header
function getUsernameFromJwt(req){
	const token = req.headers.authorization.split(' ')[1];
	const tokenPayload = jwt.verify(token, JWT_SECRET);
	const username = tokenPayload.user.username;

	return username;
}

const checkForMonth = [
	query('month'),
	query('year')
];

router.get('/', jsonParser, checkForMonth, (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({errors: errors.mapped()});
	}

	const _username = getUsernameFromJwt(req);

	User
		.find({username: _username})
		.then(user => {
			return user[0].entries;
		})
		.then(_entries => {
			const entries = _entries.filter(entry => {
				return entry.month == req.query.month && entry.year == req.query.year;
			});
			
			res.json({entries});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

const checkNewEntryBody = [
	body('daily_emotion', `field 'daily_emotion' does not exist`).exists(),
	body('emotion_summary', `field 'emotion_summary' does not exist`).exists()
];

router.post('/', jsonParser, checkNewEntryBody, (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({errors: errors.mapped()});
	}

	const _username = getUsernameFromJwt(req);

	const date = new Date();

	const current_year = date.getFullYear();
	const current_month = date.getMonth();
	const current_date = date.getDate();

	const optional_prompts_array = [];

	body_values = Object.values(req.body);
	body_keys = Object.keys(req.body);

	for(let i = 0; i < body_keys.length; i++){
		const key = body_keys[i];
		if(key.search('text-prompt') >= 0){
			const id = body_keys[i].split('-')[2];

			optional_prompts_array.push({
				prompt: Prompts[id].prompt,
				answer: body_values[i]
			});
		}
	}

	User
		.find({username: _username})
		.then(user => {
			return user[0];
		})
		.then(user => {
			user.entries.push({
				date: current_date,
				month: current_month,
				year: current_year,
				daily_emotion: req.body['daily_emotion'],
				emotion_summary: req.body['emotion_summary'],
				optional_prompts: optional_prompts_array
			});

			user.save();

			return user;
		})
		.then(user => {
			res.status(201).json(user.serialize());
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});


router.delete('/:id', (req, res) => {
	const _username = getUsernameFromJwt(req);

	User
		.find({username: _username})
		.then(user => {
			user[0].entries.id(req.params.id).remove();
			user[0].save();
			return user;
		})
		.then(user => res.status(204).end())
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

const checkUpdateEntryBody = [
	param('id', `parameter 'id' does not exist`).exists()
];

router.put('/:id', jsonParser, checkUpdateEntryBody, (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({errors: errors.mapped()});
	}

	const _username = getUsernameFromJwt(req);

	const bodyData = req.body;

	// replace optional_prompts with new data
	const newData = [];

	const keys = Object.keys(req.body);
	const values = Object.values(req.body);

	for(let i = 0; i < keys.length; i++){
		const key = keys[i];
		if(key.search('text-prompt') >= 0){
			const id = key.split('-')[2];

			newData.push({
				prompt: Prompts[id].prompt,
				answer: values[i]
			});

			delete bodyData[key];
		}
	}

	bodyData.optional_prompts = newData;

	User
		.findOne({username: _username})
		.then(user => {
			const entry = user.entries.id(req.params.id);
			entry.set(bodyData);
			return user.save();
		})
		.then(user => {
			console.log(user);
			res.status(204).end()
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

module.exports = router;