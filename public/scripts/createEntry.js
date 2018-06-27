function loadNewEntryPage(){
	let newEntryElement = '';

	newEntryElement = newEntryElement.concat(`
	<section class="col-12">
		<section class="row" id="create-entry-section">
			<h2>Create An Entry</h2>
			<form id="create-entry-form">
				<fieldset id="emotions-fieldset">
					<legend>How do I feel today? (required)</legend>
					<div class="emotion-block" tabindex="0" role="button">
						<label for="happy">Happy</label>
						<img src="../images/happy.png" alt="A picture of a happy face">
						<input type="radio" name="daily-emotion" value="happy" id="happy" required="true" tabindex="-1">
					</div>
					<div class="emotion-block" tabindex="0" role="button">
						<label for="surprised">Surprised</label>
						<img src="../images/surprised.png" alt="A picture of a surprised face">
						<input type="radio" name="daily-emotion" value="surprised" id="surprised" required="true" tabindex="-1">
					</div>
					<div class="emotion-block" tabindex="0" role="button">
						<label for="sad">Sad</label>
						<img src="../images/sad.png" alt="A picture of a sad face">
						<input type="radio" name="daily-emotion" value="sad" id="sad" required="true" tabindex="-1">
					</div>
					<div class="emotion-block" tabindex="0" role="button">
						<label for="afraid">Afraid</label>
						<img src="../images/afraid.png" alt="A picture of an afraid face">
						<input type="radio" name="daily-emotion" value="afraid" id="afraid" required="true" tabindex="-1">
					</div>
					<div class="emotion-block" tabindex="0" role="button">
						<label for="disgusted">Disgusted</label>
						<img src="../images/disgusted.png" alt="A picture of a disgusted face">
						<input type="radio" name="daily-emotion" value="disgusted" id="disgusted" required="true" tabindex="-1"><br>
					</div>
					<div class="emotion-block" tabindex="0" role="button">
						<label for="angry">Angry</label>
						<img src="../images/angry.png" alt="A picture of an angry face">
						<input type="radio" name="daily-emotion" value="angry" id="angry" required="true" tabindex="-1">
					</div>
					<br>

					<label for="emotion-summary">Why do I think I feel this way? (required)</label>
					<textarea name="emotion-summary" required="true" id="emotion-summary" form="create-entry-form"></textarea>
				</fieldset>
					<fieldset>
						<legend></legend>
	`);

	for(let i = 0; i < prompts.length; i++){
		newEntryElement = newEntryElement.concat(`
			<div class="prompt-option">
				<label for="text-prompt-${prompts[i].id}" class="prompt-text  inactive-prompt" tabindex="0" role="button">&#9658 ${prompts[i].prompt}</label>
			</div>
		`);
	}

	newEntryElement = newEntryElement.concat(`
					</fieldset>
					<button id="submit-entry" class="button-blue">Submit</button>
					<button id="cancel-entry" class="button-orange" type="button" onclick="loadPastEntriesPage()">Cancel</button>
				</form>
			</section>
		</section>
	`);

	$('main').html(newEntryElement);

	$(window).scrollTop(0);
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