let selected_entry;

function loadRecentEntriesPage(){
	let element = `
		<section class="col-8" id="selected">
			<section class="row" id="calendar-row">
				<h2>Find An Entry</h2>
				<div id="calendar-section">
					<h3 id="calendar-header"></h3>
					<button id="prev-button" class="calendar-buttons" disabled="true">Previous</button>
					<button id="next-button" class="calendar-buttons" disabled="true">Next</button>
					<table id="calendar"></table>
				</div>
			</section>
			<section class="row" id="selected-row">
				<section class="row" id="selected-entry"></section>
			</section>
		</section>
		<section class="col-4" id="past-entries">
			<section class="row" id="entries-row">
				<p>Loading entries...</p>
			</section>
		</section>
	`;

	$('main').html(element);

	reloadCalendar();
}

function getPastEntryList(){
	let element = `
		<h2>Recent Entries</h2>
	`

	if(RecentEntries.length === 0){
		element = element.concat(noEntriesElement());
	}
	else{
		for(let i = 0; i < RecentEntries.length; i++){
			const entry = RecentEntries[i];
			element = element.concat(`
				<div class="entry-excerpt">
					<h3>${Object.keys(DAYS_IN_MONTH[entry.month])} ${entry.date}, ${entry.year}</h3>
					<p>Today I felt <b>${entry.daily_emotion}</b>...</p>
					<p>${entry.emotion_summary}</p>
				</div>
			`);
		}
	}

	$('#selected-row').html(`
		<div id="selected-entry">
			<h2>Selected Entry</h2>
			<p>No entry selected.</p> 
		</div>
	`);

	$('#entries-row').html(element);
}

function noEntriesElement(){
	return `
		<p>You don't have any entries this month!</p>
	`;
}

function showSelectedEntry(entry){
	selected_entry = entry;

	let element = `
		<h2>${Object.keys(DAYS_IN_MONTH[entry.month])} ${entry.date}, ${entry.year}</h2>
		<h3>My Emotional State:</h3>
		<p>Today I felt <b>${entry.daily_emotion}</b>...</p>
		<p>${entry.emotion_summary}</p>
	`;

	for(let i = 0; i < entry.optional_prompts.length; i++){
		element = element.concat(`
			<h3>${entry.optional_prompts[i].prompt}</h3>
			<p>${entry.optional_prompts[i].answer}</p>
		`);
	}

	element = element.concat(`
		<button id="edit-button">Edit</button>
		<button id="delete-button">Delete</button>
	`);

	$('#selected-row').html(element);
}

function editEntryElement(){
	let editEntryElement = '';

	editEntryElement = editEntryElement.concat(`
		<h2>Edit Entry</h2>
		<form method="" action="" id="edit-entry-form">
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
		editEntryElement = editEntryElement.concat(`
			<div class="prompt-option">
				<label for="text-prompt-${prompts[i].id}" class="prompt-text  inactive-prompt">${prompts[i].prompt}</label>
			</div>
		`);
	}

	editEntryElement = editEntryElement.concat(`
			</fieldset>
			<button id="submit-edits">Submit Edits</button>
			<button id="cancel-edits" type="button">Cancel</button>
		</form>
	`);

	$('#selected-row').html(editEntryElement);
}

// add the data from the entry to edit
function populateEditForm(){
	$(`input[value="${selected_entry.daily_emotion}"]`).prop('checked', true);
	$('[name="emotion-summary"]').val(selected_entry.emotion_summary);

	for(let i = 0; i < selected_entry.optional_prompts.length; i++){
		for(let j = 0; j < prompts.length; j++){
			if(selected_entry.optional_prompts[i].prompt === prompts[j].prompt){
				$($('.prompt-option')[j]).html(`
					<label for="text-prompt-${prompts[j].id}" class="prompt-text  active-prompt">${prompts[j].prompt}</label>
					<textarea name="text-prompt-${prompts[j].id}"></textarea><br>
					<button type="button" class="hide-prompt">Cancel</button>
				`);

				$(`[name="text-prompt-${j}"`).val(selected_entry.optional_prompts[i].answer);

				break;
			}
		}
	}
}

function submitEntryEditsListener(){
	$('main').on('submit', '#edit-entry-form', function(event){
		event.preventDefault();

		const query = {
			daily_emotion: $('[name="daily-emotion"]:checked').val(),
			emotion_summary: $('[name="emotion-summary"]').val()
		}

		const text_prompts = $('.prompt-option');

		for(let i = 0; i < text_prompts.length; i++){
			const textarea = $($('.prompt-option')[i]).find('textarea');
			if(textarea.length > 0){
				query[`${$(textarea).attr('name')}`] = $(textarea).val();
			}
		}
		
		$.ajax({
			url: '/entries/' + selected_entry.id,
			data: query,
			type: 'PUT',
			success: function(){
				loadRecentEntriesPage();
				underlinePageLabel($('#past-entries-page'));

				loadRecentEntries();
				$('HTML, BODY').animate({scrollTop: 0});
			}
		});
	});
}

function cancelEditsListener(){
	$('main').on('click', '#cancel-edits', function(event){
		showSelectedEntry(selected_entry);
	})
}

function editEntryListener(){
	$('main').on('click', '#edit-button', function(event){
		editEntryElement();

		populateEditForm();
	});
}

function deleteEntryListener(){
	$('main').on('click', '#delete-button', function(event){
		$.ajax({
			url: '/entries/' + selected_entry.id,
			type: 'DELETE',
			success: function(){
				loadRecentEntriesPage();
				underlinePageLabel($('#past-entries-page'));

				loadRecentEntries();
				$('HTML, BODY').animate({scrollTop: 0});
			}
		});
	});
}

function selectedEntryListener(){
	$('main').on('click', '.entry-excerpt', function(event){
		const entry = RecentEntries[$(this).index() - 1];

		showSelectedEntry(entry);
	});
}

function createListeners(){
	selectedEntryListener();
	editEntryListener();
	deleteEntryListener();
	submitEntryEditsListener();
	cancelEditsListener();
}

$(createListeners());