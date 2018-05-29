//list of model names
var models = [];

//list of prompt questions
var prompts = [];

//array of prompts and each model's questions
//format: responses[prompt][model]
var responses = [[]];



//test data
models = ["Adrian", "Bennet", "Cammy"];
prompts = ["What is your name?", "How old are you?", "Favorite food?", "School?", "Soda?", "Sport?", "Favorite Color?", "Dream College?"];
responses =
    [["Hi my name is Adrian", "Hi my name is Bennet", "Hi my name is Cammy"],
    ["11 years", "9 years", "8 years"],
    ["Spaghetti and meatballs", "Pizza and cheese", "Potato chips and ice cream"],
    ["Bay Ridge Prep", "Stuyvesant", "Poly Prep"],
    ["Coca Cola", "Pepsi", "Sprite"],
    ["Swimming", "Soccer", "Basketball"],
    ["Blue", "Red and bla bla bla lets cut this over to the next line so we can see what happens", "Orange"],
    ["Penn", "Yale", "Princeton"]
    ];

//initializes handy variables
var body = d3.select("body");
var modelList = body.select("#sidebar").select("#models");
var responseTable = body.select("#content").select("#responses");

setup();

/**
 * Sets up model sidebar and table with all responses
 * */
function setup() {

    //sidebar setup
    var cell;
    for (var i = 0; i < models.length; i++) {
        //inserts new row for each model
        cell = modelList.append("tr")
            .append("td");

        //creates a checkbox for model (with click trigger)
        cell.append("input")
            .attr("id", "model" + i)
            .attr("type", "checkbox")
            .attr("onclick", "updateResp()");

        //creates text label for checkbox
        cell.append("label")
            .attr("for", "model" + i)
            .html("&nbsp;&nbsp;" + models[i]);
    }

    //prompt response table setup
    for (var i = 0; i < prompts.length; i++) {
        //creates new row in table for each prompt
        responseTable.append("tr")
            .append("td")
            .attr("id", "prompt" + i)
            .text((i + 1) + ")  " + prompts[i])
            //creates empty response list (to be filled in when checkboxes are selected)
            .append("ul")
            .attr("id", "responses" + i)
            .attr("class", "response");
    }
    body.select("#sidebar").style("display", "block");
    body.select("#content").style("display", "block");
   
}



/**
 * Called when checkbox clicked: updates response list with all selected model responses
 * */
function updateResp() {

    //traverses model checkboxes to see which ones are selected
    var activeModels = [];
    for (var i = 0; i < models.length; i++) {
        if (document.getElementById("model" + i).checked) {
            activeModels.push(i);
        }
    }

    //iterate through response table and fill in relevant responses for each prompt
    var currentRespList;
    var currentResp;
    for (var i = 0; i < prompts.length; i++) {
        currentRespList = responseTable.select("#responses" + i);

        //clears current response list
        currentRespList.html("");

        for (var j = 0; j < activeModels.length; j++) {
            currentResp = currentRespList.append("li");
            currentResp.append("i")
                .text(models[activeModels[j]] + ": ");
            currentResp.append("span")
                .text(responses[i][activeModels[j]]);
        }
    }


}

