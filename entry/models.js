const mongoose = require('mongoose');

const emotions_types = ['happy', 'sad', 'angry', 'confused', 'afraid', 'surprised', 'disgusted'];

const entrySchema = mongoose.Schema({
	date: {type: Number, require: true},
	month: {type: Number, require: true},
	year: {type: Number, require: true},
	daily_emotion: {type: String, require: true, enum: emotions_types},
	emotion_summary: {type: String, require: true},
	optional_prompts: [{
		prompt: {type: String},
		answer: {type: String, trim: true}
	}]
});

entrySchema.methods.serialize = function(){
	return {
		id: this._id,
		date: this.date,
		month: this.month,
		year: this.year,
		daily_emotion: this.daily_emotion,
		emotion_summary: this.emotion_summary,
		optional_prompts: this.optional_prompts
	};
}

const Entry = mongoose.model('Entry', entrySchema);

module.exports = {Entry, entrySchema};