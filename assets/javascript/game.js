// UI Part
window.onload = function() {

    var animals = ["wolf", "owl", "shark", "peacock", "hippopotamus", "chicken", "anemon",
    "whale", "parrot", "mountain beaver", "duck", "butterfly"];
    for(var i = 0; i < animals.length; ++ i)
    {
        displayButton(animals[i]);
    }

    $("#btn-submit").on("click", function(){
        var name = $("#add").val();
        displayButton(name);  
    })
    
    $(document).on("click", ".animal-btn", displayAnimalImages);

    $(document).on("click", ".img-unit", function() {

        var state = $(this).attr("state");
        if(state === "still")
        {
            $(this).attr("src", $(this).attr("animated"));
            $(this).attr("state", "animate");
        }
        else 
        {
            $(this).attr("src", $(this).attr("still"));
            $(this).attr("state", "still");
        }
    });

}

function displayButton(name)
{
    var newButton = $("<button>");
    newButton.addClass("animal-btn");
    newButton.attr("data-animal", name);
    newButton.text(name);
    $("#buttons").append(newButton);
}

function displayAnimalImages(){
    var animal = $(this).attr("data-animal");
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=NjeA3euYga2SrEIhVjtxb335fzPFo6Zq&q="+ animal +"&limit=10&offset=0&rating=&lang=en";
    
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
        console.log(response);

        var results = response.data;
        for (var i = 0; i < results.length; i++) {

            var rating = results[i].rating;
            var imgStill = results[i].images.fixed_height_still.url;
            var imgAnimated = results[i].images.fixed_height.url;

            var p = $("<p>").text("Rating: " + rating);

            var image = $("<img>").attr("src", imgStill);
            image.addClass("img-unit");
            image.attr("still", imgStill);
            image.attr("animated", imgAnimated);
            image.attr("state", "still");

            var div = $("<div>");
            div.attr("style", "margin: 10px; float: left;")
            div.append(p, image);
            $("#image-container").prepend(div);
        }
    })
}
