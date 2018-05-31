let prompts = [];

function loadNewEntryPage(){
	let newEntryElement = '';

	newEntryElement = newEntryElement.concat(`
		<section id="create-entry-section">
			<h2>Create An Entry</h2>
			<form method="post" action="/entries" id="create-entry-form">
				<fieldset id="emotions-fieldset">
					<legend>How do I feel today? (required)</legend>
					<label for="happy">Happy</label>
					<input type="radio" name="daily-emotion" value="happy" required="true">
					<label for="sad">Sad</label>
					<input type="radio" name="daily-emotion" value="sad" required="true">
					<label for="angry">Angry</label>
					<input type="radio" name="daily-emotion" value="angry" required="true">
					<label for="confused">Confused</label>
					<input type="radio" name="daily-emotion" value="confused" required="true">
					<label for="afraid">Afraid</label>
					<input type="radio" name="daily-emotion" value="afraid" required="true">
					<label for="surprised">Surprised</label>
					<input type="radio" name="daily-emotion" value="surprised" required="true">
					<label for="disgusted">Disgusted</label>
					<input type="radio" name="daily-emotion" value="disgusted" required="true"><br>

					<label for="emotion-summary">Why do I think I feel this way? (required)</label>
					<textarea name="emotion-summary" required="true" form="create-entry-form"></textarea>
				</fieldset>
				<fieldset>
					<legend></legend>
	`);

	const loadPrompts = new Promise((resolve, reject) => {
		let prompt_options = getPromptsFromServer();
		resolve(prompt_options);
	});

	loadPrompts
		.then(prompt_options => {
			prompts = prompt_options;

			for(let i = 0; i < prompt_options.length; i++){
				newEntryElement = newEntryElement.concat(`
					<div class="prompt-option">
						<label for="text-prompt-${prompts[i].id}" class="prompt-text  inactive-prompt">${prompts[i].prompt}</label>
					</div>
				`);
			}

			newEntryElement = newEntryElement.concat(`
						</fieldset>
						<button id="submit-entry">Submit Entry</button>
					</form>
				</section>
			`);

			$('#dynamic-page').html(newEntryElement);
		});
}

function getPromptsFromServer(){
	const prompt_options = [
		{prompt: 'What other kinds of emotions did you feel today?', id: 0},
		{prompt: 'What was the most important thing that happened to you today?', id: 1},
		{prompt: 'Can you recall a time today when you helped someone who needed it?', id: 2},
		{prompt: 'Do you have any other thoughts for the day?', id: 3}
	]

	return prompt_options;
}

function promptEnableListener(){
	$('#dynamic-page').on('click.enable', '.prompt-text', function(event){
		if($(this).hasClass('inactive-prompt')){
			const y = $($(this).parent()).position();

			const element_index = $(this).parent().index() - 1;

			$($(this).parent()).html(`
				<label for="text-prompt-${prompts[element_index].id}" class="prompt-text  active-prompt">${prompts[element_index].prompt}</label>
				<textarea name="text-prompt-${prompts[element_index].id}"></textarea><br>
				<button type="button" class="hide-prompt">Cancel</button>
			`);

			$('HTML, BODY').animate({scrollTop: y.top}, 500);
		}
	});
}

function promptDisableListener(){
	$('#dynamic-page').on('click', '.hide-prompt', function(event){
		const element_index = $(this).parent().index() - 1;

		$($(this).parent()).html(`
			<label for="text-prompt-${prompts[element_index].id}" class="prompt-text  inactive-prompt">${prompts[element_index].prompt}</label>
		`);
	});
}

function createListeners(){
	promptEnableListener();
	promptDisableListener();
}

function main(){
	createListeners();
}

$(main());