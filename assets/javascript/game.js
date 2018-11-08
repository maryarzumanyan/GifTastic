// Initialization logic goes here
window.onload = function()
{
    var list = JSON.parse(localStorage.getItem("favorites"));
    if (!Array.isArray(list)) {
      list = [];
    }

    updateFavorites(list);

    // Initial set of animals to be populated on the page.
    var animals = ["wolf", "owl", "shark", "peacock", "hippopotamus", "chicken", "anemon",
                    "whale", "parrot", "mountain beaver", "duck", "butterfly"];
    
    for(var i = 0; i < animals.length; ++ i)
    {
        displayButton(animals[i]);
    }

    $("#btn-submit").on("click", function(){
        var name = $("#add").val();
        if(name != "" && !animals.includes(name))
        {
            displayButton(name);
        }

        animals.push(name);
        $("#add").val("");
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

    $(document).on("click", ".add-favorite", function() {
       
        var img = $(this).parents(".img-wrapper").find(".img-unit");
        list.push(img.attr("animated"));
  
        updateFavorites(list);
        localStorage.setItem("favorites", JSON.stringify(list));
        
    });
  
    $(document).on("click", ".btn-delete", function() {
        var number = $(this).attr("delete");
  
        list.splice(number, 1);
        updateFavorites(list);
        localStorage.setItem("favorites", JSON.stringify(list));
    });
}

// Adds a new animal button to the page.
function displayButton(name)
{
    var newButton = $("<button>");
    newButton.addClass("animal-btn");
    newButton.attr("data-animal", name);
    newButton.attr("offset", 0);
    newButton.text(name);
    $("#buttons").append(newButton);
}

// Loads images from GIPHY, shows them on the page, deals with ratings and enables "Add To Favorites" button.
//  Offset concept is handled here - each time given button is clicked, function loads new set of images from the new offset.
function displayAnimalImages()
{
    var animal = $(this).attr("data-animal");
    var offset = parseInt($(this).attr("offset"), 10);
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=NjeA3euYga2SrEIhVjtxb335fzPFo6Zq&q=" + animal + "&limit=10&offset=" +  offset * 10 + "&rating=&lang=en";
    offset ++;
    $(this).attr("offset", offset);
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

            var button = $("<button>").text("+").addClass("add-favorite");
            button.attr("style", "float: right");

            var div = $("<div>").addClass("img-wrapper");
            div.attr("style", "margin: 10px; float: left;")
            div.append(button,p, image);
            $("#image-container").prepend(div);
        }
    })
}

// Shows favorites on the page based on the passed list of image URLs.
function updateFavorites(list)
{
    $("#favorites").empty(); 
    for (var i = 0; i < list.length; i++) {
      var favImage = $("<img>").attr("src", list[i]).addClass("fav-img");
      favImage.attr("style", "width: 100%; height: 100%;");

      var btnDelete = $("<button>").text("X");
      btnDelete.attr("delete", i);
      btnDelete.addClass("btn-delete");
      btnDelete.attr("style", "position: absolute; top: 0px; right: 0px;");

      var newDiv = $("<div>").attr("style", "position: relative;");
      newDiv.append(favImage, btnDelete);
      $("#favorites").prepend(newDiv);
    }
}
