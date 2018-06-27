function aboutSectionListener(){
	$('header').on('click', '#about-page', function(event){
		$('main').html(aboutPageElement());

		underlinePageLabel(this);
		$('footer').html('');
	});

	$('header').on('keydown', '#about-page', function(event){
		if(event.keyCode === 32 || event.keyCode === 13){
			$('main').html(aboutPageElement());

			underlinePageLabel(this);
			$('footer').html('');
		}
	});
}

function aboutPageElement(){
	return `
			<section class="col-12">
				<section class="row" id="about-row">
					<h2>About</h2>
					<h3>What is 'Reflect'?</h3>
					<p>The 'Person Reflective Journal' is a personal journal that is accessible to you and you alone. The journal utilizes a series of prompts that can allow you to reflect on the day and explore your emotional or personal state. I believe that reflection is one of the keys to dealing with our own personal struggles and that by writing (or typing) these conflicts can lead to clarity and positivity. While this should never completely substitute actual therapy conducted by a professional, this could certainly be used as a helpful tool for discovering your place in the world.</p>
					<h3>How does it work?</h3>
					<p>At the top of your 'Personal Page', you will see a calendar filled in with dates. Previous entries can be accessed through this interface in case you want to go back and read past entries. New entries can be posted through the 'New Entry' link, and can only be posted once per day. Each post consists of a series of required and optional prompts. Click the 'Post' button to create a new entry!</p><br><br>
					<p><i>Emoji icons were created by Bruno Maia, IconTexto at <a href="http://www.icontexto.com">http://www.icontexto.com</a>.<br>
						These icons were released under CC License Attribution-Noncommercial 3.0</i></p>
				</section>
			</section>
		`;
}

function loadPastEntriesPage(){
	loadRecentEntriesPage();
	underlinePageLabel($('#home-page'));

	loadRecentEntries();
}

function pastEntriesSectionListener(){
	$('header').on('click', '#home-page', function(event){
		loadPastEntriesPage();
	});
	$('header').on('keydown', '#home-page', function(event){
		if(event.keyCode === 32 || event.keyCode === 13){
			loadPastEntriesPage();
		}
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
						<label for="username-input">Username:</label>
						<input type="text" name="username-input" id="username-input" required="true">
						<label for="password-input">Password:</label>
						<input type="password" name="password-input" id="password-input" required="true">
						<button class="button-blue">Login</button>
						<p id="password-username-error"></p>
					</fieldset>
				</form>
			</section>
			<p class="extra-text">Don't have an account? Create one <b id="to-newUser" tabindex="0" role="button">here</b>!</p>
		</section>
	`;
}

function createAccountPageListener(){
	$('main').on('click', '#to-newUser', function(event){
		$('#login-newUser-page').html(createAccountElement());
	});
	$('main').on('keydown', '#to-newUser', function(event){
		if(event.keyCode === 32 || event.keyCode === 13){
			$('#login-newUser-page').html(createAccountElement());
		}
	});
}

function createAccountElement(){
	return `
			<h2>Sign Up</h2>
			<section class="row" id="login-newUser-row">
				<form id="submit-form" method="" action="">
					<fieldset>
						<legend></legend>
						<label for="username">Username:</label>
						<input type="text" name="username" id="username" required="true">
						<label for="password">Password:</label>
						<input type="password" name="password" id="password" required="true">
						<label for="password-2">Re-type Password:</label>
						<input type="password" name="password-2" id="password-2" required="true">
						<button class="button-blue">Submit</button>
						<button type="button" id="cancel-button" class="button-orange">Cancel</button>
						<p id="password-username-error"></p>
					</fieldset>
				</form>
			</section>
		`;
}

function loginPageListener(){
	$('header').on('click', '#login-page', function(event){
		$('main').html(loginPageElement());

		underlinePageLabel(this);
	});
	$('header').on('keydown', '#login-page', function(event){
		if(event.keyCode === 32 || event.keyCode === 13){
			$('main').html(loginPageElement());

			underlinePageLabel(this);
		}
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
	underlinePageLabel($('#home-page'));
	loadRecentEntries();

	$('#header-right').html(`
		<p id="about-page" tabindex="0">About</p>
		<p id="home-page" tabindex="0">Home</p>
		<p id="account-page" tabindex="0">Account</p>
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

			underlinePageLabel('#home-page');
		},
		error: function(){
			$('main').html(loginPageElement());
			$('#header-right').html(`
				<p id="about-page" tabindex="0" role="button">About</p>
				<p id="login-page" tabindex="0" role="button">Login</p>
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
		$('main').html(accountPageElement());

		underlinePageLabel(this);
		$('footer').html('');
	});
	$('header').on('keydown', '#account-page', function(event){
		if(event.keyCode === 32 || event.keyCode === 13){
			$('main').html(accountPageElement());

			underlinePageLabel(this);
			$('footer').html('');
		}
	});
}

function accountPageElement(){
	return `
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
			`;
}

function logoutListener(){
	$('main').on('click', '#logout-account', function(event){
		localStorage.removeItem('prjToken');
		location.reload();
	});
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
		const prompt = this;
		promptEnable(prompt);
	});
	$('main').on('keydown', '.prompt-text', function(event){
		if(event.keyCode === 32 || event.keyCode === 13){
			const prompt = this;
			promptEnable(prompt);
		}
	});
}

function promptEnable(prompt){
	if($(prompt).hasClass('inactive-prompt')){
		const element_index = $(prompt).parent().index() - 1;
		$(prompt).removeClass('inactive-prompt');
		$(prompt).addClass('active-prompt');

		$($(prompt).parent()).html(`
			<label for="text-prompt-${prompts[element_index].id}" class="prompt-text  active-prompt"  tabindex="0" role="button">&#9660 ${prompts[element_index].prompt}</label>
			<textarea name="text-prompt-${prompts[element_index].id}" id="text-prompt-${prompts[element_index].id}"></textarea><br>
		`);
	}
	else{
		const element_index = $(prompt).parent().index() - 1;
		$(prompt).removeClass('active-prompt');
		$(this).addClass('inactive-prompt');

		$($(prompt).parent()).html(`
			<label for="text-prompt-${prompts[element_index].id}" class="prompt-text  inactive-prompt"  tabindex="0" role="button">&#9658 ${prompts[element_index].prompt}</label>
		`);
	}
}

function pictureInputListener(){
	$('main').on('click', '.emotion-block', function(event){
		const siblings = $(this).siblings();

		$(this).addClass('emotion-selected')
		$(siblings).removeClass('emotion-selected');

		$($(this).find('input')).prop('checked', 'enable');
	});
	$('main').on('keydown', '.emotion-block', function(event){
		if(event.keyCode === 32 || event.keyCode === 13){
			const siblings = $(this).siblings();

			$(this).addClass('emotion-selected')
			$(siblings).removeClass('emotion-selected');

			$($(this).find('input')).prop('checked', 'enable');
		}
	});
}

function createListeners(){
	aboutSectionListener();
	loginPageListener();
	loginListener();
	pastEntriesSectionListener();
	createAccountPageListener();
	createAccountListener();
	cancelAccountPageListener();
	accountPageListener();
	deleteAccountListener();
	logoutListener();
	promptEnableListener();
	pictureInputListener();
}

function main(){
	createListeners();

	initApp();
}

$(main());