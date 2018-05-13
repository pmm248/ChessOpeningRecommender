
/* get descriptions JSON */
function getDescriptions(){
	var xhReq = new XMLHttpRequest();
	xhReq.open("GET", "http://pmocarski.com/ChessOpeningRecommender/data/opening_descriptions.json", false);
	xhReq.send(null);
	
	var descriptions_map = JSON.parse(xhReq.responseText);
	var descriptions = [];
	
	for (var key in descriptions_map){
		if (descriptions_map.hasOwnProperty(key)){
			descriptions.push( [key, descriptions_map[key]]);
		}
	}
	
	return {desc_map: descriptions_map, desc: descriptions};
}


var desc_and_map = getDescriptions();
var descriptions = desc_and_map['desc'];
var descriptions_map = desc_and_map['desc_map'];


function getMatches(k=5){
	scores = {};
	
	// Add scores for gambit val
	var gambitVal = parseInt($('#gambitRange').val());
	for (var i = 0; i < descriptions.length; i++){
		var title = descriptions[i][0];
		var description = descriptions[i][1].toLowerCase();
		// Search if description contains gambit and reward/penalize accordingly
		if (description.includes("gambit")){
			if (!(title in scores)){
				scores[title] = gambitVal;
			}
			else{
				scores[title] += gambitVal;
			}
		}
		else{
			if (!(title in scores)){
				scores[title] = -1 * gambitVal;
			}
			else{
				scores[title] -= gambitVal;
			}	
		}

		// Bonus points if title contains gambit and user likes gambits
		if (title.includes("Gambit") && gambitVal > 0){
			if (!(title in scores)){
				scores[title] = gambitVal * .2;
			}
			else{
				scores[title] += gambitVal * .2;
			}
		}
	}
	
	// Add scores for theory val
	var theoryVal = parseInt($('#theoryRange').val());
	for (var i = 0; i < descriptions.length; i++){
		var title = descriptions[i][0];
		var description = descriptions[i][1].toLowerCase();
		if (description.includes("theory") || description.includes("theoretical")){
			if (!(title in scores)){
				scores[title] = theoryVal;
			}
			else{
				scores[title] += theoryVal;
			}
		}
		else{
			if (!(title in scores)){
				scores[title] = -1 * theoryVal;
			}
			else{
				scores[title] -= theoryVal;
			}	
		}
	}
	
	// Add scores for open/closed val
	var openVal = parseInt($('#openClosedGameRange').val());
	for (var i = 0; i < descriptions.length; i++){
		var title = descriptions[i][0];
		var description = descriptions[i][1].toLowerCase();
		if (description.includes("open ") || description.includes("opening the")){
			if (!(title in scores)){
				scores[title] = openVal;
			}
			else{
				scores[title] += openVal;
			}
		}
		if (description.includes("closed") || description.includes("closing")){
			if (!(title in scores)){
				scores[title] = -1 * openVal;
			}
			else{
				scores[title] -= openVal;
			}	
		}
	}
	
	// Add scores for positional/attacking val
	var attackVal = parseInt($('#positionalAttackingRange').val());
	for (var i = 0; i < descriptions.length; i++){
		var title = descriptions[i][0];
		var description = title.toLowerCase() + " " + descriptions[i][1].toLowerCase();
		if (description.includes("attack") || description.includes("aggressive") || description.includes("rapid") || description.includes("fast")){
			if (!(title in scores)){
				scores[title] = attackVal;
			}
			else{
				scores[title] += attackVal;
			}
		}
		if (description.includes("positional") || description.includes("passive") || description.includes("slow")){
			if (!(title in scores)){
				scores[title] = -1 * attackVal;
			}
			else{
				scores[title] -= attackVal;
			}	
		}

		// Bonus points if user is attacking and title contains attack
		if (title.includes("Attack") && attackVal > 0){
			if (!(title in scores)){
				scores[title] = attackVal * .2;
			}
			else{
				scores[title] += attackVal * .2;
			}
		}
	}
	
	// Add score for keyword matchings
	var keywords = $('#keywords').val().toLowerCase().replace(",", "").split(" ");
	for (var keyword_index in keywords){
		keyword = keywords[keyword_index]
		for (var i = 0; i < descriptions.length; i++){
			var title = descriptions[i][0];
			var description = title.toLowerCase() + " " + descriptions[i][1].toLowerCase();
			if ($.inArray(keyword, description.split(' ')) > -1){
				if (!(title in scores)){
					scores[title] = 100 / keywords.length;
					console.log(title);
				}
				else{
					scores[title] += 100 / keywords.length;
					console.log(title);
				}
			}
		}
	}
	
	// Add a bit of randomness
	for (var key in scores){
		scores[key] += Math.random() * 5;
	}
	
	// Sort and return results
	var results = [];
	for (var title in scores) {
		results.push([title, scores[title]]);
	}
	results.sort(function(a, b) {
		return b[1] - a[1]; 
	});
	
	top_k_results = [];
	for (var i = 0; i < k; i++){
		top_k_results.push([results[i][0], descriptions_map[results[i][0]]]);
	}
	
	return top_k_results;
}

$(document).ready(function(){
    $("#submitButton").click(function(){
		var num_results = 10
		var keywords = $()
		var result = getMatches(k=num_results);
        $("#results").empty();
		for(var i = 0; i < num_results; i++){
			$("#results").append("<div class=\"row\"><br></br><h5>" + result[i][0] + "</h5>" + "<p>" + result[i][1] + "</p>" + "<br></br><br></br></div>");
		}
		
		$('html, body').animate({
        scrollTop: $("#results").offset().top
		}, 1000);
    });
});
