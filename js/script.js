"use strict";
/*
var ajax = new XMLHttpRequest();
var resp = [];

function ajax_handler() {

	var out = '';

	resp.push({
		rstatus: ajax.status,
		rstate: ajax.readyState,
		rtext: ajax.responseText.length
	});

	if(ajax.readyState === 4 && ajax.status === 200){
		$("#result").html(ajax.responseText);
		for (var i in resp) {
			out += `<p>`;
			out += `Resultat: ${resp[i].rstatus}<br>`;
			out += `State: ${resp[i].rstate}<br>`;
			out += `Resultat längd: ${resp[i].rtext}<br>`;
			out += `</p>`;
		}
		$("#responses").html(out);
	}
}

$(function() {

	$("#load_url").click(function() {
		
		$("#result").html('<img src="img/loading.gif">');
		ajax.onreadystatechange = ajax_handler;
		ajax.open("GET", "http://mardby.se/AJK15G/lorem_text.php");
		ajax.send();

	});

});
*/

var line = '';
var linescount = 0;
var elem = $(".command_line");
var linesc;

$(function() {

	$(document).keydown(function(event){
		if(event.which == 8 && line) {
			line = line.slice(0, -1);
			elem.text(line);
		}

	});	

	$(document).keypress(function(event){

		if (event.which == 13) {

			if (line){

				if ($('.lines_container').length == 0) {
					$('.console_wrapper').prepend('<div class="lines_container"></div>');
					linesc = $(".lines_container");
				}

				elem.text(line);
				linesc.html(linesc.html() + line + '<br>');
				elem.text('');
				line = '';
			} else {
				line = '';
			}

			$('.command_tick').css('margin-left', '-8px');

		} else {

			line += String.fromCharCode(event.which);
			$('.command_line').text(line);
			$('.command_tick').css('margin-left', '-5px');

		}

    if (event.which == 32) { return false; }		

		//console.log(String.fromCharCode(event.which)); 
	});

});