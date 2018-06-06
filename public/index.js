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
		loadRecentEntriesPage();
		underlinePageLabel($('#past-entries-page'));

		loadRecentEntries();
	});
}

function createNewEntryListener(){
	$('#new-entry-page').on('click', function(event){
		loadNewEntryPage();

		underlinePageLabel(this);
	});
}

function underlinePageLabel(pageLabel){
	$($('header').find('p')).css('text-decoration', 'none');
	$(pageLabel).css('text-decoration', 'underline');
}

function loadRecentEntries(){
	const query = {
		month: current_month,
		year: current_year
	}

	$.getJSON('/entries/monthly', query, function(data){
		RecentEntries.splice(0, RecentEntries.length);

		for(let i = 0; i < data.entries.length; i++){
			RecentEntries.push(data.entries[i]);
		}

		getPastEntryDates();
		getPastEntryList();
	});
}

function createListeners(){
	aboutSectionListener();
	pastEntriesSectionListener();
	createNewEntryListener();
}

function main(){
	createListeners();

	$.getJSON('/entries/prompts', function(data){
		for(let i = 0; i < data.prompts.length; i++){
			prompts.push(data.prompts[i]);
		}

		loadRecentEntriesPage();
		underlinePageLabel($('#past-entries-page'));
		loadRecentEntries();
	});
}

$(main());