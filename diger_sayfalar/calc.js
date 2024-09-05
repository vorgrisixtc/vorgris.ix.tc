//Instanciate variables
var historic = '';
var current = '0';
var answer = 0;
var remind;

//Handle clicks and keyboard events
$(document).ready(function() {
	$(document).keydown(function(evt) {
		var code = evt.key;
		if ($(':focus').is('button')) {
			evt.preventDefault();
		}
		$('button[value="' + code + '"]').addClass('down');
		setTimeout(function() {
			$('button[value="' + code + '"]').removeClass('down');
		}, 300);
		handleValue(code);
	});
	$('button').click(function(evt) {
		var code = $(this).attr("value");
		handleValue(code);
	});
});

function handleValue(entry) {
	//Hide error notification if it appeared earlier
	$('header').slideUp();

	//Store result from past calculation in historic
	if (remind) {
		historic = current;
		remind = false;
	}
	//Clear all entries
	if (entry === 'clearall') {
		resetCalc(true, true);
	}
	//Clear the current entry
	if (entry === 'clearentry') {
		resetCalc(true, false);
		answer = 0;
	}
	//Handle deletion of characters
	if (entry === 'Backspace') {
		if (current !== '' && current !== '0' && answer === 0) {
			current = current.slice(0, -1);
			historic = historic.slice(0, -1);
			addText();
		} else {
			displayError("Silinecek herhangi birşey kalmadı.");
		}
	}

	//Handle operators
	if (entry === '/' || entry === '*' || entry === '+' || entry === '-') {
		if (current === '0' || current === '') {
			displayError("Hiçbir şey üzerinde çalışamazsınız.");
		} else {
			current = entry;
			historic += entry;
			addText();
			answer = 0;
			current = '';
		}
	}

	//Hande Enter/Validation
	if (entry === 'Enter') {
		calculate();
		remind = true;
	}

	//Handle Decimals
	if (entry === '.') {
		if (current.indexOf('.') === -1) {
			if (answer !== 0) {
				resetCalc(true, true);
			}
			if (current === '') {
				current = '0' + entry;
				historic += current;
			} else {
				if (historic === '')
					historic += '0' + entry;
				else
					historic += entry;
				current += entry;
			}
			addText();
		} else {
			displayError("Bir sayıda birden fazla ondalık sayı olamaz.");
		}
	}

	//Handle numbers
	if (!isNaN(entry)) {
		if (answer !== 0) {
			resetCalc(true, true);
		}
		if (current === '0' && historic === '') {
			current = entry;
			historic = entry;
		} else {
			if (current === '0') {
				current = entry;
			} else {
				current += entry;
			}
			historic += entry;
		}
		addText();
		answer = 0;
	}
	console.log('current', current, 'historic', historic, 'answer', answer);
}

//Add text to the calculator
function addText() {
	$('#current').html(current);
	$('#history').html(historic);
}

//Reset the calculator partially or not
function resetCalc(current_res, history_res) {
	if (current_res) {
		current = '0';
		$('#current').html(current);
	}
	if (history_res) {
		historic = '';
		$('#history').html(historic);
		answer = 0;
	} else {
		var test = historic.split(/([\/\*\+\-])/g);
		if (!isNaN(test[test.length - 1])) {
			test.pop();
			historic = test.join('');
		}
		$('#history').html(historic);
	}
}

//Calculate the result
function calculate() {
	answer = eval(historic);
	current = answer.toString();
	addText();
}

//Display errors
function displayError(string) {
	$('header').slideDown();
	$('.error').text(string);
}