function aboutSectionListener(){
	$('#about-page').on('click', function(event){
		$('#dynamic-page').html(`
			<section class="row" id="about-row">
				<h2>About</h2>
				<h3>What is 'Personal Reflective Journal'?</h3>
				<p>The 'Person Reflective Journal' is a personal journal that is accessible to you and you alone. The journal utilizes a series of prompts that can allow you to reflect on the day and explore your emotional or personal state. I believe that reflection is one of the keys to dealing with our own personal struggles and that by writing (or typing) these conflicts can lead to clarity and positivity. While this should never completely substitute actual therapy conducted by a professional, this could certainly be used as a helpful tool for discovering your place in the world.</p>
				<h3>How does it work?</h3>
				<p>At the top of your 'Personal Page', you will see a calendar filled in with dates. Previous entries can be accessed through this interface in case you want to go back and read past entries. New entries can be posted through the 'New Entry' link, and can only be posted once per day. Each post consists of a series of required and optional prompts. Click the 'Post' button to create a new entry!</p>
			</section>
		`);

		underlinePageLabel(this);
	});
}

function pastEntriesSectionListener(){
	$('#past-entries-page').on('click', function(event){
		$('#dynamic-page').html(`
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
				<h2>Recent Entries</h2>
				<div class="entry-excerpt">
					<h3>Date, Entry Title</h3>
					<p>Summary and stuff that a person would write in and it could be cool I guess.</p>
					<div role="button" class="re-edit-button">Edit</div><div role="button" class="re-delete-button">Delete</div>
				</div>
				<div class="entry-excerpt">
					<h3>Date, Entry Title</h3>
					<p>Summary and stuff that a person would write in and it could be cool I guess.</p>
					<div role="button" class="re-edit-button">Edit</div><div role="button" class="re-delete-button">Delete</div>
				</div>
				<div class="entry-excerpt">
					<h3>Date, Entry Title</h3>
					<p>Summary and stuff that a person would write in and it could be cool I guess.</p>
					<div role="button" class="re-edit-button">Edit</div><div role="button" class="re-delete-button">Delete</div>
				</div>
				<button>Later Entries</button>
				<button>Earlier Entries</button>
				<div>
					<h2>Selected Entry</h2>
					<h3>Prompt</h3>
					<p>here is text for this</p>
					<h3>Prompt</h3>
					<p>here is text for this</p>
					<h3>Prompt</h3>
					<p>here is text for this</p>
				</div>
			</section>
		`);

		reloadCalendar();

		underlinePageLabel(this);
	});
}

function createNewEntryListener(){
	$('#new-entry-page').on('click', function(event){
		$('#dynamic-page').html(`
			<section id="create-entry-section">
				<h2>Create An Entry</h2>
				<form method="post" action="">
					<fieldset>
						<legend></legend>
						<div class="prompt-option">
							<label for="text-prompt-name" class="prompt-text  inactive-prompt">Prompt</label>
						</div>
						<div class="prompt-option">
							<label for="text-prompt-name" class="prompt-text  inactive-prompt">Prompt</label>
						</div>
						<div class="prompt-option">
							<label for="text-prompt-name" class="prompt-text  inactive-prompt">Prompt</label>
						</div>
					</fieldset>
					<button id="submit-entry">Submit Entry</button>
				</form>
			</section>
		`);

		underlinePageLabel(this);
	});
}

function underlinePageLabel(pageLabel){
	$($('header').find('p')).css('text-decoration', 'none');
	$(pageLabel).css('text-decoration', 'underline');
}

function createListeners(){
	aboutSectionListener();
	pastEntriesSectionListener();
	createNewEntryListener();
}

function main(){
	createListeners();
	underlinePageLabel($('#past-entries-page'));
}

$(main());