let date = new Date();

let current_year = date.getFullYear();
let current_month = date.getMonth();
let current_date = date.getDate();
let current_day = date.getDay();

const DAYS_IN_MONTH = [
						{January: 31},
						{February: 28},
						{March: 31},
						{April: 30},
						{May: 31},
						{June: 30},
						{July: 31},
						{August: 31},
						{September: 30},
						{October: 31},
						{November: 30},
						{December: 31}
					];

const month_profile_created = 3;
const year_profile_created = 2018;

function changeCalendarDate(new_month, new_year){
	let actual_date = new Date();

	adjustCalendarLeapYear(new_year);

	if(actual_date.getMonth() === new_month && actual_date.getFullYear() === current_year){
		current_year = actual_date.getFullYear();
		current_month = actual_date.getMonth();
		current_date = actual_date.getDate();
		current_day = actual_date.getDay();
	}
	else{
		date.setFullYear(new_year);
		date.setMonth(new_month);
		date.setDate(1);

		current_year = date.getFullYear();
		current_month = date.getMonth();
		current_date = date.getDate();
		current_day = date.getDay();
	}
}

function adjustCalendarLeapYear(new_year){
	if(new_year%4 === 0){
		DAYS_IN_MONTH.splice(1, 1, {February: 29});
	}
	else{
		DAYS_IN_MONTH.splice(1, 1, {February: 28});
	}
}

function constructCalendar(){
	let firstDay = new Date();
	const days_in_month = Object.values(DAYS_IN_MONTH[current_month])[0];
	firstDay.setDate(1);
	firstDay.setMonth(current_month);
	firstDay.setFullYear(current_year);
	const start_day = firstDay.getDay();

	let index_day = 1;
	let firstRow = true;


	$($('#dynamic-page').find('#calendar')).html(
					`<tr>
						<td class="day">Sun</td>
						<td class="day">Mon</td>
						<td class="day">Tue</td>
						<td class="day">Wed</td>
						<td class="day">Thu</td>
						<td class="day">Fri</td>
						<td class="day">Sat</td>
					</tr>`);

	$($('#dynamic-page').find('#calendar-header')).html(`${Object.keys(DAYS_IN_MONTH[current_month])[0]}, ${current_year}`)

	while(index_day <= days_in_month){
		$($('#dynamic-page').find('#calendar')).append(constructCalendarRow(index_day, start_day, days_in_month, firstRow));
		firstRow = false;
		if(index_day === 1){
			index_day = index_day + (7 - start_day);
		}
		else{
			index_day = index_day + 7;
		}
	}

	if(current_month === new Date().getMonth()
		&& current_year === new Date().getFullYear()){
		$('#dynamic-page').find('#next-button').prop('disabled', true);
	}
	if(month_profile_created === current_month
		&& year_profile_created === current_year){
		$('#dynamic-page').find('#prev-button').prop('disabled', true);
	}
}

function constructCalendarRow(index_day, start_day, days_in_month, firstRow){
	let row_element = `<tr class="calendar-row">`;
	if(index_day < 7 && firstRow){
		for(let i = 0; i < 7; i++){
			if(i < start_day){
				row_element = row_element.concat(`<td></td>`);
			}
			else{
				row_element = row_element.concat(`<td data-day="${index_day}">${index_day}</td>`);
				index_day++;
			}
		}
	}
	else{
		for(let i = 0; i < 7; i++){
			if(index_day > days_in_month){
				row_element = row_element.concat(`<td></td>`);
			}
			else{
				row_element = row_element.concat(`<td data-day="${index_day}">${index_day}</td>`);
				index_day++;
			}
		}
	}
	return row_element.concat(`</tr>`);
}

function calendarDayListener(){
	$('#dynamic-page').on('click', 'td', function(event){
		const calendar_val = $(this).attr('data-day');
		if(calendar_val){
			console.log(calendar_val);
		}
	});
}

function changeMonthListeners() {
	$('#dynamic-page').on('click', '#prev-button', function(event){
		new_month = current_month - 1;
		new_year = current_year;
		if(new_month < 0){
			new_month = 11;
			new_year = current_year - 1;
		}

		clearDisabledButtons();

		changeCalendarDate(new_month, new_year);

		constructCalendar();
		addCurrentDay();
	});
	$('#dynamic-page').on('click', '#next-button', function(event){
		new_month = current_month + 1;
		new_year = current_year;
		if(new_month > 11){
			new_month = 0;
			new_year = current_year + 1;
		}

		clearDisabledButtons();

		changeCalendarDate(new_month, new_year);

		constructCalendar();
		addCurrentDay();
	});
}

function addCurrentDay(){
	if(current_year === new Date().getFullYear() && current_month === new Date().getMonth()){
		$(`[data-day='${current_date}']`).attr('data-current-day', true);
	}
}

function createListeners(){
	calendarDayListener();
	changeMonthListeners();
}

function clearDisabledButtons(){
	$($('#dynamic-page').find('#next-button')).prop('disabled', false);
	$($('#dynamic-page').find('#prev-button')).prop('disabled', false);
}

function reloadCalendar(){
	adjustCalendarLeapYear(current_year);
	clearDisabledButtons();
	constructCalendar();

	addCurrentDay();
}

function calendarMain(){
	adjustCalendarLeapYear(current_year);
	clearDisabledButtons();
	constructCalendar();

	addCurrentDay();

	createListeners();
}

$(calendarMain());