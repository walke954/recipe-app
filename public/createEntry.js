function promptEnableListener(){
	$('#dynamic-page').on('click.enable', '.prompt-text', function(event){
		if($(this).hasClass('inactive-prompt')){
			const y = $($(this).parent()).position();

			$($(this).parent()).html(`
				<label for="text-prompt-name" class="prompt-text  active-prompt">Prompt</label>
				<textarea name="prompt-text-name"></textarea><br>
				<button type="button" class="hide-prompt">Cancel</button>
			`);

			$('HTML, BODY').animate({scrollTop: y.top}, 500);
		}
	});
}

function promptDisableListener(){
	$('#dynamic-page').on('click', '.hide-prompt', function(event){
		$($(this).parent()).html(`
			<label for="text-prompt-name" class="prompt-text  inactive-prompt">Prompt</label>
		`);
	});
}

function createListeners(){
	promptEnableListener();
	promptDisableListener();
}

function main(){
	createListeners();
}

$(main());