function loadRecentEntriesPage(){
	let element = `
			<section class="row" id="calendar-row">
				<h2>Find An Entry</h2>
				<div id="calendar-section">
					<h3 id="calendar-header"></h3>
					<button id="prev-button" class="calendar-buttons" disabled="true">Previous</button>
					<button id="next-button" class="calendar-buttons" disabled="true">Next</button>
					<table id="calendar"></table>
				</div>
			</section>
			<section class="row" id="entries-row">
				<p>Loading entries...</p>
			</section>
	`;

	// if(past_entries.length === 0){
	// 	element = noEntriesElement(element);
	// }
	// else{
	// 	for(let i = 0; i < past_entries.length; i++){
	// 		element = element.concat(`
	// 			<div class="entry-excerpt">
	// 				<h3>Date, Entry Title</h3>
	// 				<p>Summary and stuff that a person would write in and it could be cool I guess.</p>
	// 				<button class="select-button">Select</button>
	// 			</div>
	// 		`);
	// 	}

	// 	element = element.concat(`
	// 			<button>Later Entries</button>
	// 			<button>Earlier Entries</button>
	// 			<div id="selected-entry">
	// 				<h2>Selected Entry</h2>
	// 				<p>No entry selected.</p> 
	// 			</div>
	// 		</section>
	// 	`);
	// }

	$('#dynamic-page').html(element);

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
					<button class="select-button">Select</button>
				</div>
			`);
		}
	}

	element = element.concat(`
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
	$('#selected-entry').html(element);
}

function selectedEntryListener(){
	$('#dynamic-page').on('click', '.entry-excerpt', function(event){
		const entry = RecentEntries[$(this).index() - 1];

		showSelectedEntry(entry);

		const y = $('#selected-entry').position();
		$('HTML, BODY').animate({scrollTop: y.top});
	});
}

function createListeners(){
	selectedEntryListener();
}

$(createListeners());