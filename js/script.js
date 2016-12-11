"use strict";

var ajax = new XMLHttpRequest();
var resp = [];
var commands = [];
var commands_str = [];
var line = '';
var linescount = 0;
var enable_input = true;
var elem = $(".command_line");
var linesc = $(".lines_container");
var mode = 0; //0 = normal, 1 = drunkmode
var timeuntilnext;

/*
		dir
		miniprogram
*/

commands.push({command: 'help', ext: false});
commands.push({command: 'author', ext: false});
commands.push({command: 'cls', ext: false});
commands.push({command: 'get', ext: true});
commands.push({command: 'drunk', ext: false});
commands.push({command: 'annoy-o-bot', ext: false});

for (var i in commands) commands_str.push([commands[i].command]);

function check_command() {

	var old_html = linesc.html();
	var output = '<br>';
	var print_yes = true;
	var command_found, command_ext;
	
	if (line.indexOf(' ') > -1) {
		if ((line.indexOf(' ')+1) < line.length) command_ext = (line.substr((line.indexOf(' ')+1), line.length));
	}

	for (var i in commands) {
		if (line.length >= commands[i].command.length) {
			if (command_ext && commands[i].ext) {
				if (commands[i].command == line.substr(0, (line.indexOf(' ')))) command_found = commands[i].command;
			} else {
				if (commands[i].command == line) command_found = commands[i].command;
			}
		}
	}

	if (!command_found) output = '<br>Invalid command.';

	switch (command_found) {

		case 'help':
			output += 'Commands available: ' + commands_str.join(', ');
			break;

		case 'author':
			output += 'Created by Olof Larsson, 2016: <a href="http://www.olof.it" target="_olof">www.olof.it</a>';
			break;

		case 'cls':
			old_html = line = output = '';			
			break;

		case 'get':

			if (command_ext) {
				enable_input = print_yes = false;
				print_it(old_html,line,'');
				ajax_get_url(command_ext);
			} else {
				output += "Command 'get' will download a local webpage, usage: 'get page', Example: 'get /'";
			}			
			break;

		case 'drunk':

			mode = 1 - mode;

			if (mode == 0) {
				clearTimeout(timeuntilnext);
				$('.console_wrapper').removeClass('blurry-text');
				$('.command_tick').removeClass('blurry-bg');
				$('.lines_container, .command_line_container, .command_line, .command_tick').removeClass('wobble_anim');

				output += "Drunk mode disabled.";
			} else {
				drunk_next_input(true);
				$('.console_wrapper').addClass('blurry-text');
				$('.command_tick').addClass('blurry-bg');
				$('.lines_container, .command_line_container, .command_line, .command_tick').addClass('wobble_anim');

				output += "Drunk mode enabled. Yippie! Party time! (type it again to disable)";
			}
			break;

		case 'annoy-o-bot':

			var mcon = $('#mongo-container');
			mcon.css('display') == 'none' ? mcon.css('display', 'block') : mcon.css('display', 'none');
			break;

	}

	if (print_yes) print_it(old_html,line,output);

}

function create_mongo() {
	var div = '';
	div += "<div id=\"mongo-container\">";
	div += "	<div id=\"mongo-center\"></div>";
	div += "	<div class=\"leg lleft\">";
	div += "		<div class=\"foot\"></div>";
	div += "	</div>";
	div += "	<div class=\"leg lright\">";
	div += "		<div class=\"foot\"></div>";
	div += "	</div>";
	div += "</div>";
}

function drunk_next_input(first){
	if (enable_input && !first && get_rnd_num_between(0, 4) == 0){
		line += ' *hic* ';
		print_to_command_line(line);
	}
	timeuntilnext = get_rnd_num_between(2,7);
	timeuntilnext = setTimeout(drunk_next_input, (timeuntilnext * 1000));
}

function get_rnd_num_between(a,b){
	return (Math.floor(Math.random() * (b-a+1) ) + a);
}


function print_it(scope_old_html,scope_line,scope_output) {
	if (scope_old_html + scope_line + scope_output) scope_output += '<br>';
	linesc.html(scope_old_html + scope_line + scope_output);
}

function print_to_command_line(str) {
	elem.html('<pre>'+str+'</pre>');
	(line.length == 0) ? $('.command_tick').css('margin-left', '-8px') : $('.command_tick').css('margin-left', '-5px');
}

$(document).keydown(function(event){
	if (!enable_input) return false;
	if(event.which == 8 && line) {
		line = line.slice(0, -1);
		print_to_command_line(line);
	}
});	

$(document).keypress(function(event){
	if (!enable_input) return false;
	if (event.which == 13) {
		if (line) check_command();
		line = '';
	} else {
		line += String.fromCharCode(event.which);
		if (mode == 1 && get_rnd_num_between(0, 4) == 4)	line += Math.random().toString(36).substring(2,3);
	}
	print_to_command_line(line);
	if (event.which == 32) { return false; }
});

function ajax_errorhandler(xhr, status, error) {
	print_it(linesc.html(),'An error occured with your URL, maybe it wasn\'t correctly formated?<hr>','');
}

function ajax_handler() {

	var out = '';

	resp.push({
		rstatus: ajax.status,
		rstate: ajax.readyState,
		rtext: ajax.responseText
	});

	if(ajax.readyState === 4) {

		for (var i in resp) {
			if (resp[i].rstate == 1) out += 'Preparing your request..<br>';
			if (resp[i].rstate == 2) out += 'Request sent..<br>';
			if (resp[i].rstate == 3) out += 'Fetching content..<br>';
			if (resp[i].rstate == 4) {

				if (ajax.status !== 200) {
					out += 'Request failed with error: ' + ajax.status + '<br>';
				} else {
					out += 'Done. Printing the first 200 characters..<hr>';
					if (resp[i].rtext.length >= 200) resp[i].rtext += resp[i].rtext.substr(0, 199);
					out += resp[i].rtext + '<hr>';
				}

			}
		}

		if (resp.length < 4) out += 'Request failed.<br>';
		enable_input = true;
		print_it(linesc.html(),out,'');

	}

}


function ajax_get_url(url) {
	resp = [];
	ajax.onerror = ajax_errorhandler;
	ajax.error = ajax_errorhandler;
	ajax.onreadystatechange = ajax_handler;
	ajax.timeout = 10000;

	//url = "http://mardby.se/AJK15G/lorem_text.php";
	//url = "httgp://www.google.se";
	//url = "http://www.google.se";
	ajax.open("GET", url);
	ajax.send();
}
