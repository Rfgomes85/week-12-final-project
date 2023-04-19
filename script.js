$(document).ready(function () {
    var recipes = [];
  
    $("#new-recipe").click(function () {
      var recipe = $("#recipe").val();
      if (recipe === "") {
        return;
      }
      recipes.push(recipe);
      $("#recipe").val("");
      updateRecipes();
    });
  
    function updateRecipes() {
      var html = "";
      for (var i = 0; i < recipes.length; i++) {
        html += "<div class='card'><div class='card-body'>" + recipes[i] + "</div></div>";
      }
      $("#recipes").html(html);
    }
  });
  