const mongoose = require('mongoose');

const Prompts = [
	{prompt: 'What other kinds of emotions did you feel today?', id: 0},
	{prompt: 'What was the most important thing that happened to you today?', id: 1},
	{prompt: 'Can you recall a time today when you helped someone who needed it?', id: 2},
	{prompt: 'Do you have any other thoughts for the day?', id: 3}
];

const emotions_types = ['happy', 'sad', 'angry', 'confused', 'afraid', 'surprised', 'disgusted'];

const entrySchema = mongoose.Schema({
	date: {type: String, require: true},
	daily_emotion: {type: String, require: true, enum: emotions_types},
	emotion_summary: {type: String, require: true},
	optional_prompts: [{
		prompt_id: {type: Number},
		answer: {type: String, trim: true}
	}]
});

entrySchema.methods.serialize = function(){
	return {
		id: this._id,
		date: this.date,
		daily_emotion: this.daily_emotion,
		emotion_summary: this.emotion_summary,
		optional_prompts: this.optional_prompts
	};
}

const Entry = mongoose.model('Entry', entrySchema);

module.exports = {Entry, Prompts};