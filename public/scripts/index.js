function aboutSectionListener(){
	$('header').on('click', '#about-page', function(event){
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
	$('header').on('click', '#past-entries-page', function(event){
		loadRecentEntriesPage();
		underlinePageLabel($('#past-entries-page'));

		loadRecentEntries();
	});
}

function createNewEntryListener(){
	$('header').on('click', '#new-entry-page', function(event){
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
		},
		error: function(err){

		}
	});
}

function loginPageElement(){
	return `
		<section id="login-newUser-page" class="col-12">
			<h2>Sign In</h2>
			<section class="row" id="login-newUser-row">
				<form id="login-form" method="" action="">
					<fieldset>
						<legend></legend>
						<label>Username:</label>
						<input type="text" name="username-input" required="true">
						<label>Password:</label>
						<input type="password" name="password-input" required="true">
						<button class="button-blue">Login</button>
						<p id="password-username-error"></p>
					</fieldset>
				</form>
			</section>
			<p class="extra-text">Don't have an account? Create one <b id="to-newUser">here</b>!</p>
		</section>
	`;
}

function createAccountPageListener(){
	$('main').on('click', '#to-newUser', function(event){
		$('#login-newUser-page').html(`
			<h2>Sign Up</h2>
			<section class="row" id="login-newUser-row">
				<form id="submit-form" method="" action="">
					<fieldset>
						<legend></legend>
						<label>Username:</label>
						<input type="text" name="username" required="true">
						<label>Password:</label>
						<input type="password" name="password" required="true">
						<label>Re-type Password:</label>
						<input type="password" name="password-2" required="true">
						<button class="button-blue">Submit</button>
						<button type="button" id="cancel-button" class="button-orange">Cancel</button>
						<p id="password-username-error"></p>
					</fieldset>
				</form>
			</section>
		`);
	});
}

function loginPageListener(){
	$('header').on('click', '#login-page', function(event){
		$('main').html(loginPageElement());

		underlinePageLabel(this);
	});
}

function loginListener(){
	$('main').on('submit', '#login-form', function(event){
		event.preventDefault();

		$.ajax({
			url: 'auth/login',
			data: {
				username: $('[name="username-input"]').val(),
				password: $('[name="password-input"]').val()
			},
			type: 'POST',
			success: function(data){
				localStorage.setItem('prjToken', data.authToken);
				logIn();
			},
			error: function(err){
				$('#password-username-error').html('Sorry, this username or password is incorrect!<br>Please try again.');
			}
		});
	});
}

function loadAppHome(){
	loadRecentEntriesPage();
	underlinePageLabel($('#past-entries-page'));
	loadRecentEntries();

	$('#header-right').html(`
		<p id="about-page">About</p>
		<p id="past-entries-page">Past Entries</p>
		<p id="new-entry-page">New Entry</p>
		<p id="account-page">Account</p>
	`);
}

function refreshToken(){
	$.ajax({
		url: '/auth/refresh',
		type: 'POST',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
		success: function(data){
			localStorage.setItem('prjToken', data.authToken);
		}
	});
}

function logIn(){
	// get user information
	$.ajax({
		url: '/users/logged',
		type: 'GET',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
		success: function(data){
			refreshToken();

			profile_basics = data;
			month_profile_created = data.monthCreated;
			year_profile_created = data.yearCreated;

			loadAppHome();
		},
		error: function(){
			$('main').html(loginPageElement());
			$('#header-right').html(`
				<p id="about-page">About</p>
				<p id="login-page">Login</p>
			`);
			underlinePageLabel($('#login-page'));
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

function createAccountListener(){
	$('main').on('submit', '#submit-form', function(event){
		event.preventDefault();

		if($('[name="password"]').val() !== $('[name="password-2"]').val()){
			$('#password-username-error').html(`Sorry, passwords don't match. Please try again.`);
			return;
		}

		$.ajax({
			url: '/users',
			type: 'POST',
			data: {
				username: $('[name="username"]').val(),
				password: $('[name="password"]').val()
			},
			success: function(data){
				$('main').html(`
					<div id="new-account-success">
						<p class="extra-text">Acount was successfully created!</p>
						<button class="button-blue" onclick="location.reload()">Login</button>
					</div>
				`);
			},
			error: function(err){
				$('#password-username-error').html('Sorry, this username is taken or the password is invalid. <br>Passwords should be a minimum of 10 characters in length.');
			}
		});
	});
}

function cancelAccountPageListener(){
	$('main').on('click', '#cancel-button', function(event){
		$('main').html(loginPageElement());
	});
};

function accountPageListener(){
	$('header').on('click', '#account-page', function(event){
		$('main').html(`
			<section id="user-account-page" class="col-12">
				<section class="row">
					<h1>Account Settings</h1>
					<h3>Account Username:</h3>
					<p>${profile_basics.username}</p>
					<h3>Sign Out:</h3>
					<button id="logout-account">Logout</button>
					<p>Warning! Accounts that are deleted are permanently gone and cannot be recovered.</p>
					<h3>Delete Account:</h3>
					<button id="delete-account">Delete</button>
				</section>
			</section>
		`);

		underlinePageLabel(this);
	});
}

function logoutListener(){
	$('main').on('click', '#logout-account', function(event){
		localStorage.removeItem('prjToken');
		location.reload();
	});
}

function logout(){

}

function deleteAccountListener(){
	$('main').on('click', '#delete-account', function(event){
		if(confirm('Deleted accounts are permenantly deleted. Are you sure you want to delete your account?')){
			deleteAccount();
		}
	});
}

function deleteAccount(){
	$.ajax({
		url: '/users/' + profile_basics.id,
		type: 'DELETE',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
		success: function(data){
			location.reload();
		}
	});
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

function createListeners(){
	aboutSectionListener();
	loginPageListener();
	loginListener();
	pastEntriesSectionListener();
	createNewEntryListener();
	createAccountPageListener();
	createAccountListener();
	cancelAccountPageListener();
	accountPageListener();
	deleteAccountListener();
	logoutListener();
	promptEnableListener();
	promptDisableListener();
}

function main(){
	createListeners();

	initApp();
}

$(main());