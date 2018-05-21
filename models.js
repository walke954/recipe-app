const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
	title: {type: String, require: true},
	author: String,
	ingredients: [{
		ingredient: String,
		measure_quantity: Number,
		measure: String
	}],
	directions: [String],
	// date: Date
});

recipeSchema.methods.serialize = function(){
	return {
		title: this.title,
		author: this.author
	};
}

const Recipes = mongoose.model('Recipes', recipeSchema);

module.exports = {Recipes};