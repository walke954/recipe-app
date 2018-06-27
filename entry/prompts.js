// list of prompts used. To function properly, each prompt needs to have an id value equal to it's array index (but they can be listed in any order as long as that criteria is met). New prompts can be added as needed.
const Prompts = [
	{prompt: 'Do you have any other thoughts for the day?', id: 0},
	{prompt: 'What other kinds of emotions did you feel today?', id: 1},
	{prompt: 'What was the most important thing that happened to you today?', id: 2},
	{prompt: 'Can you recall a time today when you helped someone who needed it?', id: 3},
];

module.exports = {Prompts};