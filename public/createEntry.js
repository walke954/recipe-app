function loadNewEntryPage(){
	let newEntryElement = '';

	newEntryElement = newEntryElement.concat(`
	<section class="col-12">
		<section class="row" id="create-entry-section">
			<h2>Create An Entry</h2>
			<form method="" action="" id="create-entry-form">
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

	for(let i = 0; i < prompts.length; i++){
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
		</section>
	`);

	$('main').html(newEntryElement);
}

function promptEnableListener(){
	$('main').on('click.enable', '.prompt-text', function(event){
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
	$('main').on('click', '.hide-prompt', function(event){
		const element_index = $(this).parent().index() - 1;

		$($(this).parent()).html(`
			<label for="text-prompt-${prompts[element_index].id}" class="prompt-text  inactive-prompt">${prompts[element_index].prompt}</label>
		`);
	});
}

function submitNewEntryListener(){
	$('main').on('submit', '#create-entry-form', function(event){
		event.preventDefault();

		const body = {
			daily_emotion: $('[name="daily-emotion"]:checked').val(),
			emotion_summary: $('[name="emotion-summary"]').val()
		}

		const text_prompts = $('.prompt-option');

		for(let i = 0; i < text_prompts.length; i++){
			const textarea = $($('.prompt-option')[i]).find('textarea');
			if(textarea.length > 0){
				body[`${$(textarea).attr('name')}`] = $(textarea).val();
			}
		}

		$.ajax({
			url: '/entries',
			data: body,
			type: 'POST',
			beforeSend: function(xhr){
				xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
			},
			success: function(data){
				loadRecentEntriesPage();
				underlinePageLabel($('#past-entries-page'));
				loadRecentEntries();
			}
		});
	});
}

function createListeners(){
	promptEnableListener();
	promptDisableListener();
	submitNewEntryListener();
}

function main(){
	createListeners();
}

$(main());