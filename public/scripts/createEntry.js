function loadNewEntryPage(){
	let newEntryElement = '';

	newEntryElement = newEntryElement.concat(`
	<section class="col-12">
		<section class="row" id="create-entry-section">
			<h2>Create An Entry</h2>
			<form method="" action="" id="create-entry-form">
				<fieldset id="emotions-fieldset">
					<legend>How do I feel today? (required)</legend>
					<div class="emotion-block">
						<label for="happy">Happy</label>
						<input type="radio" name="daily-emotion" value="happy" required="true">
					</div>
					<div class="emotion-block">
						<label for="sad">Sad</label>
						<input type="radio" name="daily-emotion" value="sad" required="true">
					</div>
					<div class="emotion-block">
						<label for="angry">Angry</label>
						<input type="radio" name="daily-emotion" value="angry" required="true">
					</div>
					<div class="emotion-block">
						<label for="confused">Confused</label>
						<input type="radio" name="daily-emotion" value="confused" required="true">
					</div>
					<div class="emotion-block">
						<label for="afraid">Afraid</label>
						<input type="radio" name="daily-emotion" value="afraid" required="true">
					</div>
					<div class="emotion-block">
						<label for="surprised">Surprised</label>
						<input type="radio" name="daily-emotion" value="surprised" required="true">
					</div>
					<div class="emotion-block">
						<label for="disgusted">Disgusted</label>
						<input type="radio" name="daily-emotion" value="disgusted" required="true"><br>
					</div>
					<br>

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
					<button id="submit-entry" class="button-blue">Submit Entry</button>
				</form>
			</section>
		</section>
	`);

	$('main').html(newEntryElement);
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
	submitNewEntryListener();
}

function main(){
	createListeners();
}

$(main());