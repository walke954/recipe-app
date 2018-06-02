const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const {Entry, Prompts} = require('./entryModels');

const {check, body, query, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const checkForMonth = [
	query('month'),
	query('year')
];

router.get('/monthly', jsonParser, checkForMonth, (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({errors: errors.mapped()});
	}

	Entry
		.find({month: req.query.month, year: req.query.year})
		.then(entry => {
			res.json({
				entries: entry.map(
					(entry) => entry.serialize())
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

router.get('/prompts', (req, res) => {
	res.json({
		prompts: Prompts
	});
});

const checkNewEntryBody = [
	body('daily-emotion', `field 'daily-emotion' does not exist`).exists(),
	body('emotion-summary', `field 'emotion-summary' does not exist`).exists()
];

router.post('/', jsonParser, checkNewEntryBody, (req, res) => {
	const errors = validationResult(req);

	console.log(req.body);

	if (!errors.isEmpty()) {
		return res.status(422).json({errors: errors.mapped()});
	}

	const date = new Date();

	const current_year = date.getFullYear();
	const current_month = date.getMonth();
	const current_date = date.getDate();

	const optional_prompts_array = [];

	body_values = Object.values(req.body);
	body_keys = Object.keys(req.body)

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

	Entry
		.create({
			date: current_date,
			month: current_month,
			year: current_year,
			daily_emotion: req.body['daily-emotion'],
			emotion_summary: req.body['emotion-summary'],
			optional_prompts: optional_prompts_array
		})
		.then(entry => {
			res.status(201).redirect('/')
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

router.post('/test', jsonParser, checkNewEntryBody, (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({errors: errors.mapped()});
	}

	const date = new Date();

	const current_year = date.getFullYear();
	const current_month = date.getMonth();
	const current_date = date.getDate();

	const optional_prompts_array = [];

	body_values = Object.values(req.body);
	body_keys = Object.keys(req.body)

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

	Entry
		.create({
			date: `${current_month}-${current_date}-${current_year}`,
			daily_emotion: req.body['daily-emotion'],
			emotion_summary: req.body['emotion-summary'],
			optional_prompts: optional_prompts_array
		})
		.then(entry => {
			res.status(201).json(entry.serialize())
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

router.delete('/delete/:id', (req, res) => {
	Entry
		.findByIdAndRemove(req.params.id)
		.then(entry => res.send(204).end())
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

module.exports = router;