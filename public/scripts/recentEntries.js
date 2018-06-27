function loadRecentEntriesPage(){
	let element = `
		<section class="col-9" id="selected">
			<section class="row" id="calendar-row">
				<div id="calendar-section">
					<h3 id="calendar-header"></h3>
					<button id="prev-button" class="calendar-buttons" disabled="true">&#8592</button>
					<button id="next-button" class="calendar-buttons" disabled="true">&#8594</button>
					<table id="calendar"></table>
				</div>
			</section>
		</section>
		<section class="col-3" id="past-entries">
			<section class="row" id="entries-row">
				<p>Loading entries...</p>
			</section>
		</section>
	`;

	$('main').html(element);

	$(window).scrollTop(0);

	reloadCalendar();
}

function getPastEntryList(){
	let element = `
		<h2>Entries</h2>
	`

	if(RecentEntries.length === 0){
		element = element.concat(noEntriesElement());
	}
	else{
		for(let i = RecentEntries.length; i > 0; i--){
			const entry = RecentEntries[i - 1];
			element = element.concat(`
				<div class="entry-excerpt" tabindex="0" role="button">
					<h3>${Object.keys(DAYS_IN_MONTH[entry.month])} ${entry.date}, ${entry.year}</h3>
					<img src='../images/${entry.daily_emotion}.png' alt="A picture of a ${entry.daily_emotion} face" class="emotion-excerpt">
					<p>Today I felt <b>${entry.daily_emotion}</b>... ${entry.emotion_summary}</p>
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
		<section class="col-12" id="selected">
			<section class="row" id="selected-row">
				<h2>${Object.keys(DAYS_IN_MONTH[entry.month])} ${entry.date}, ${entry.year}</h2>
				<img src='../images/${entry.daily_emotion}-large.png' alt="A picture of a ${entry.daily_emotion} face" id="selected-entry-emotion">
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
				<div id="edit-delete-box">
					<button id="return-button" class="button-blue" onclick="loadPastEntriesPage()">Calendar</button>
					<button id="edit-button" class="button-blue">Edit</button>
					<button id="delete-button" class="button-orange">Delete</button>
				</div>
			</section>
		</section>
	`);

	$('main').html(element);

	$(window).scrollTop(0);
}

function editEntryElement(){
	let editEntryElement = '';

	editEntryElement = editEntryElement.concat(`
		<h2>Edit Entry</h2>
		<form method="" action="" id="edit-entry-form">
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
		editEntryElement = editEntryElement.concat(`
			<div class="prompt-option">
				<label for="text-prompt-${prompts[i].id}" class="prompt-text  inactive-prompt"  tabindex="0" role="button">&#9658 ${prompts[i].prompt}</label>
			</div>
		`);
	}

	editEntryElement = editEntryElement.concat(`
			</fieldset>
			<button id="submit-edits" class="button-blue">Submit Edits</button>
			<button id="cancel-edits" type="button" class="button-orange">Cancel</button>
		</form>
	`);

	$('#selected-row').html(editEntryElement);

	$(window).scrollTop(0);
}

// add the data from the entry to edit
function populateEditForm(){
	const block = $(`input[value="${selected_entry.daily_emotion}"]`);

	$($(block).parent()).addClass('emotion-selected');
	$(block).prop('checked', true);

	$('[name="emotion-summary"]').val(selected_entry.emotion_summary);

	for(let i = 0; i < selected_entry.optional_prompts.length; i++){
		for(let j = 0; j < prompts.length; j++){
			if(selected_entry.optional_prompts[i].prompt === prompts[j].prompt){
				$($('.prompt-option')[j]).html(`
					<label for="text-prompt-${prompts[j].id}" class="prompt-text  active-prompt"  tabindex="0" role="button">${prompts[j].prompt}</label>
					<textarea name="text-prompt-${prompts[j].id}" id="text-prompt-${prompts[element_index].id}"></textarea><br>
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
			url: '/entries/' + selected_entry._id,
			data: query,
			type: 'PUT',
			beforeSend: function(xhr){
				xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
			},
			success: function(){
				loadPastEntriesPage();
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
		$('#edit-delete-box').css('color', 'red');
		$('#edit-delete-box').html(`
			<p style="display:inline-block;margin-right:10px">Are you sure?</p>
			<button onclick="keepEntry()" class="button-orange">No</button>
			<button onclick="deleteEntry()" class="button-blue">Yes</button>
		`);
	});
}

function keepEntry(){
	$('#edit-delete-box').css('color', 'black');
	$('#edit-delete-box').html(`
		<button id="edit-button" class="button-blue">Edit</button>
		<button id="delete-button" class="button-orange">Delete</button>
	`);
}

function deleteEntry(){
	$.ajax({
		url: '/entries/' + selected_entry._id,
		type: 'DELETE',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
		success: function(){
			loadPastEntriesPage();
		}
	});
}

function selectedEntryListener(){
	$('main').on('click', '.entry-excerpt', function(event){
		const entry = RecentEntries[$(this).index() - 1];

		showSelectedEntry(entry);
	});
	$('main').on('keydown', '.entry-excerpt', function(event){
		if(event.keyCode === 32 || event.keyCode === 13){
			const entry = RecentEntries[$(this).index() - 1];

			showSelectedEntry(entry);
		}
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