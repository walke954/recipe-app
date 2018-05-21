const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const {Recipes} = require('./recipeModels');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.get('/search/', (req, res) => {
	const possible_fields = ['keyword', 'min_time', 'max_time', 'serve_temp', 'food_practice'];
	let query = {};
	let keyword = "";

	if(req.query){
		const query_keys = Object.keys(req.query);
		for(let i = 0; i < query_keys.length; i++){
			if(!possible_fields.includes(query_keys[i])){
				const message = `query value does not exist`;
				console.error(message);
				return res.status(400).send(message);
			}
		}

		query = req.query;

		keyword = query.keyword;
		delete query.keyword;
	}

	console.log(query);

	Recipes
		.find(query)
		.find({$text: {$search: keyword}})
		.limit(50)
		.then(recipes => {
			res.json({
				recipes: recipes.map(
					(recipe) => recipe.serialize())
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

router.get('/user/', (req, res) => {
	Recipes
		.find()
		.then(recipes => {
			res.json({
				recipes: recipes.map(
					(recipe) => recipe.serialize())
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

router.post('/user/', jsonParser, (req, res) => {
	const require_fields = ['title', 'author', 'food_practice', 'approx_time', 'serve_temp'];
	for(let i = 0; i < require_fields.length; i++){
		const field = require_fields[i];
		if(!(field in req.body)){
			const message = `missing '${field}' in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	Recipes
		.create({
			title: req.body.title,
			author: req.body.author,
			food_practice: req.body.food_practice,
			approx_time: req.body.total_time,
			serve_temp: req.body.serve_temp,
			date: Date.now(),
			ingredients: req.body.ingredients,
			directions: req.body.directions,
			cuisine_types: req.body.cuisine_types
		})
		.then(recipe => res.status(201).json(recipe.serialize()))
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

router.put('/user/:id', jsonParser, (req, res) => {
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
		const message = `Request params id '${req.params.id}' and request body id '${req.body.id}' must match`;
		console.error(message);
		return res.status(400).json({message: message});
	}

	const toUpdate = {};
	const updateable_fields = ['title', 'approx_time', 'serve_temp', 'ingredients', 'directions', 'cuisine_types'];

	updateable_fields.forEach(field => {
		if(field in req.body){
			toUpdate[field] = req.body[field];
		}
	});

	Recipes
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(recipe => res.status(204).end())
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

router.delete('/user/:id', (req, res) => {
	Recipes
		.findByIdAndRemove(req.params.id)
		.then(recipe => res.status(204).end())
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Internal Server Error'});
		});
});

module.exports = router;