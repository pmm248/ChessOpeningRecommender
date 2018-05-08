// get descriptions JSON
var xhReq = new XMLHttpRequest();
xhReq.open("GET", "http://pmocarski.com/ChessOpeningRecommender/data/descriptions.json", false);
xhReq.send(null);
var descriptions_map = JSON.parse(xhReq.responseText);
var descriptions = []
for (var key in descriptions_map){
	if (descriptions_map.hasOwnProperty(key)){
		descriptions.push( [key, descriptions_map[key]]);
	}
}

$(document).ready(function(){
    $("#submitButton").click(function(){
		var result = descriptions[Math.floor(Math.random()*descriptions.length)];
        $("#results").empty();
		$("#results").append("<br></br><h5>" + result[0] + "</h5>" + "<p>" + result[1] + "</p>" + "<br></br><br></br>");
		
		$('html, body').animate({
        scrollTop: $("#results").offset().top
		}, 1000);
    });
});
