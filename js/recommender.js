// get descriptions JSON
var xhReq = new XMLHttpRequest();
xhReq.open("GET", "http://pmocarski.com/ChessOpeningRecommender/data/descriptions.json", false);
xhReq.send(null);
var descriptions_map = JSON.parse(xhReq.responseText);
var descriptions = [];
for (var key in descriptions_map){
	if (descriptions_map.hasOwnProperty(key)){
		descriptions.push( [key, descriptions_map[key]]);
	}
}

function getMatches(k=5){
	console.log("HERE");
	scores = {};
	
	// Add scores for gambit val
	var gambit_val = parseInt($('#gambitRange').val());
	for (var i = 0; i < descriptions.length; i++){
		var title = descriptions[i][0];
		var description = descriptions[i][1].toLowerCase();
		if (description.includes("gambit")){
			if (!(title in scores)){
				scores[title] = gambit_val;
			}
			else{
				scores[title] += gambit_val;
			}
		}
		else{
			if (!(title in scores)){
				scores[title] = -1 * gambit_val;
			}
			else{
				scores[title] -= gambit_val;
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
	console.log(attackVal);
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
	}
	
	// Add a bit of randomness
	for (var key in scores){
		scores[key] += Math.random() * 5
	}
	
	var results = [];
	for (var title in scores) {
		results.push([title, scores[title]]);
	}
	results.sort(function(a, b) {
		return b[1] - a[1]; 
	});
	console.log(results);
	
	top_k_results = []
	for (var i = 0; i < k; i++){
		top_k_results.push([results[i][0], descriptions_map[results[i][0]]])
	}
	return top_k_results
}

$(document).ready(function(){
    $("#submitButton").click(function(){
		var num_results = 5
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
