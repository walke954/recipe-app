function aboutSectionListener(){
	$('#about-page').on('click', function(event){
		$('main').html(`
			<section class="col-12">
				<section class="row" id="about-row">
					<h2>About</h2>
					<h3>What is 'Personal Reflective Journal'?</h3>
					<p>The 'Person Reflective Journal' is a personal journal that is accessible to you and you alone. The journal utilizes a series of prompts that can allow you to reflect on the day and explore your emotional or personal state. I believe that reflection is one of the keys to dealing with our own personal struggles and that by writing (or typing) these conflicts can lead to clarity and positivity. While this should never completely substitute actual therapy conducted by a professional, this could certainly be used as a helpful tool for discovering your place in the world.</p>
					<h3>How does it work?</h3>
					<p>At the top of your 'Personal Page', you will see a calendar filled in with dates. Previous entries can be accessed through this interface in case you want to go back and read past entries. New entries can be posted through the 'New Entry' link, and can only be posted once per day. Each post consists of a series of required and optional prompts. Click the 'Post' button to create a new entry!</p>
				</section>
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

	$.ajax({
		url: '/entries',
		data: query,
		type: 'GET',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
		success: function(data){
			RecentEntries.splice(0, RecentEntries.length);

			for(let i = 0; i < data.entries.length; i++){
				RecentEntries.push(data.entries[i]);
			}

			getPastEntryDates();
			getPastEntryList();
		}
	});
}

function loginPageElement(){
	return `
		<form id="login-form" method="" action="">
			<fieldset>
				<legend></legend>
				<label>Username:</label>
				<input type="text" name="username-input">
				<label>Password:</label>
				<input type="text" name="password-input">
			</fieldset>
			<button>Login</button>
		</form>
		<form id="submit-form" method="POST" action="/users">
			<fieldset>
				<legend></legend>
				<label>Username:</label>
				<input type="text" name="username">
				<label>Password:</label>
				<input type="text" name="password">
			</fieldset>
			<button>Submit</button>
		</form>
		<p>Don't have an account? Create one here!</p>
	`;
}

function loginPageListener(){
	$('#login-page').on('click', function(event){
		$('main').html(loginPageElement());
	});
}

function loginListener(){
	$('main').on('submit', '#login-form', function(event){
		event.preventDefault();

		$.ajax({
			url: '/auth/login',
			data: {
				username: $('[name="username-input"]').val(),
				password: $('[name="password-input"]').val()
			},
			type: 'POST',
			success: function(data){
				localStorage.setItem('prjToken', data.authToken);
				logIn();
			}
		});
	});
}

function loadAppHome(){
	loadRecentEntriesPage();
	underlinePageLabel($('#past-entries-page'));
	loadRecentEntries();

	$('#login-page').html(profile_username);
}

function logIn(){
	$.ajax({
		url: '/users/logged',
		type: 'GET',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
		success: function(data){
			createListeners();

			profile_username = data.username;
			month_profile_created = data.monthCreated;
			year_profile_created = data.yearCreated;

			loadAppHome();
		},
		error: function(){
			$('main').html(loginPageElement());
		}
	});
}

function initApp(){
	
	$.getJSON('/prompts', function(data){
		for(let i = 0; i < data.prompts.length; i++){
			prompts.push(data.prompts[i]);
		}

		logIn();
	});
}

function createListeners(){
	pastEntriesSectionListener();
	createNewEntryListener();
}

function createInitialListeners(){
	aboutSectionListener();
	loginPageListener();
	loginListener();
}

function main(){
	createInitialListeners();

	initApp();
}

$(main());