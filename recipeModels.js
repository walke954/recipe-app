const mongoose = require('mongoose');

const measureTypes = ['DASH', 'TEASPOON', 'PINCH', 'TABLESPOON', 'CUP', 'POUND', 'OUNCE', 'FLUID OUNCE', 'PINT', 'QUART', 'GALLON', 'MILLILITER', 'LITER', 'GRAM', 'KILOGRAM'];

const recipeSchema = mongoose.Schema({
	title: {type: String, require: true, trim: true},
	author: {type: String, require: true, trim: true},
	food_practice: {type: String, enum: ['MEAT', 'VEGETARIAN', 'VEGAN'], require: true},
	approx_time: {type: String, require: true, trim: true},
	serve_temp: {type: String, enum: ['HOT', 'ROOMTEMP', 'COLD', 'FROZEN'], require: true},
	date: {type: Date, require: true},
	ingredients: [{
		ingredient: {type: String, trim: true},
		measure_quantity: {type: Number, min: 0},
		measure: {type: String, enum: measureTypes}
	}],
	directions: [String],
	cuisine_types: {type: String, trim: true, default: 'Other'}
});

recipeSchema.methods.serialize = function(){
	return {
		id: this._id,
		title: this.title,
		author: this.author,
		food_practice: this.food_practice,
		approx_time: this.approx_time,
		serve_temp: this.serve_temp,
		date: this.date,
		ingredients: this.ingredients,
		directions: this.directions,
		cuisine_types: this.cuisine_types
	};
}

const Recipes = mongoose.model('Recipes', recipeSchema);

module.exports = {Recipes};