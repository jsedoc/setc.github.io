google.charts.load('current', {packages: ['corechart', 'bar']});

local = {}

window.onload = function() {
/**Contains initialization of various dataset parameters.
This gets run when the web page first loads.
**/
local['chosenModel'] = $('#modelSelection').val()
local['chosenDataset'] = null

parseHash();
onModelSelect();
}


function parseData(voteData, dataset, targetModel) {
  datasetTasks = voteData[dataset]
  output = []
  output.push(['Model',
    targetModel  + ' wins',
    {type: 'string', role: 'annotation'},
    'Compteting model wins',
    {type: 'string', role: 'annotation'},
    'Tie',
    {type: 'string', role: 'annotation'}])
  for (let task of datasetTasks) {
    if (task['model1'] == targetModel) {
      output.push([task['model2'],
       task['m1win'],
       task['m1win'].toString(),
       task['m2win'],
       task['m2win'].toString(),
       task['tie'],
       task['tie'].toString()]);
    }
    else if (task['model2'] == targetModel) { 
      output.push([task['model1'],
       task['m2win'],
       task['m2win'].toString(),
       task['m1win'],
       task['m1win'].toString(),
       task['tie'],
       task['tie'].toString()]);    }
    }
    output = output.sort(function(a,b){return a[1]<b[1];});
    return output
  }

  function drawBarGraph(targetModel, targetDataset) {
   var data = parseData(voteData, targetDataset, targetModel);
   var dataTable = google.visualization.arrayToDataTable(data)

   var options = {
    title: 'Human evaluation on dataset: ' + targetDataset,
    chartArea: {width: '50%'},
    isStacked: 'percent',
    annotations: {
      alwaysOutside: false,
      textStyle: {
        fontSize: 12,
        auraColor: 'none',
        color: '#555'
      },
      boxStyle: {
        stroke: '#ccc',
        strokeWidth: 1,
        gradient: {
          color1: '#f3e5f5',
          color2: '#f3e5f5',
          x1: '0%', y1: '0%',
          x2: '100%', y2: '100%'
        }
      }
    },
    hAxis: {
      title: 'Fraction of Votes',
      minValue: 0,
    },
    vAxis: {
      title: 'Competing Model'
    }
  };
  var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
  chart.draw(dataTable, options);
}

function getPossibleDatasets(modelName) {
  /* Not all datasets are available for every model. Retrieces the list of
     datasets which are available for the specified model.
     */
     datasetsToReturn = [];
  // for (let dataset of voteData) { 
    for (const [ datasetName, dataset ] of Object.entries(voteData)) {
      for (let task of dataset) {
        if (task['model1'] === modelName || task['model2'] === modelName) {
          if (!datasetsToReturn.includes(datasetName)) {
            datasetsToReturn.push(datasetName);
          }
        }
      }
    }
    return datasetsToReturn
  }

  function setDatasetFormOptions(modelName) {
    datasetOptions = getPossibleDatasets(modelName)
    datasetSelectHtml = ''
    for (var i=0; i<datasetOptions.length; i++) {
      datasetSelectHtml += '<option>' + datasetOptions[i] + '</option>\n'
    }
    document.getElementById('datasetSelection').innerHTML = datasetSelectHtml
  }

  function loadProfile() {
  /** Loads all of the info for the particular mode/dataset combination that has been chosen.
  If either of these values is null, then just clears the screen.
  **/
  var chosenModel = local['chosenModel']
  var chosenDataset = local['chosenDataset']
  if (chosenModel == null || chosenDataset == null) {
    document.getElementById('profile').style.visibility='hidden';
  } else {
    document.getElementById('profile').style.visibility='visible';

    // Update the title
    var cm = 'Model: ' + chosenModel
    var cd = 'Dataset: ' + chosenDataset;
    var title = '<h3 class="mbr-section-subtitle mbr-light mbr-fonts-style display-5 left-side">' + cm + '</h3>' +
    '<h3 class="mbr-section-subtitle mbr-light mbr-fonts-style display-5 right-side">' + cd + '</h3>'
    
    document.getElementById('profileTitle').innerHTML = title;

    // Update the links
    // TODO: Replace these with real links
    console.log(chosenModel);
    console.log(models);
    if (chosenModel in models) {
      modelInfo = models[chosenModel]
      var links = '<p><b>Description:</b> ' + modelInfo['description'] + '</p>';
      links +=  '<p><b>Code:</b> ' + modelInfo['code_path'] + '</p>';
      links += '<p><b>Checkpoints:</b> ' + modelInfo['checkpoint_path'] + '</p>';
      document.getElementById('profileContents').innerHTML = links;
    } else {
      document.getElementById('profileContents').innerHTML = '<p>No model info found</p>';
    }

    // Update the metrics table
    // TODO: all of this needs to be completely rewritten when I know the format the data will be in.
    var table = document.getElementById("metricsTable");
    if (table.rows.length == 3) {
      table.deleteRow(-1);
      table.deleteRow(-1);
    }
    distinct1Row = table.insertRow();
    distinct1Row.insertCell().innerHTML = 'Distinct-1';
    distinct1Row.insertCell().innerHTML = '0.01234';
    distinct2Row = table.insertRow();
    distinct2Row.insertCell().innerHTML = 'Average BLEU';
    distinct2Row.insertCell().innerHTML = '0.01234';

    // Update the bar graph
    drawBarGraph(chosenModel, chosenDataset);

    // Update the responses.
    loadResponses(local['chosenDataset'], local['chosenModel']);
  }
}

function parseHash() {
  // slice is to get rid of the '#' symbol at the beginning of the string
  hash = window.location.hash.slice(1)
  var params = {}
  hash.split('&').map(hk => { 
    let temp = hk.split('='); 
    params[temp[0]] = (temp[1] === 'null' ? null : temp[1]) 
  });
  if (params['model'] != null) {
    local['chosenModel'] = params['model'].replace(/_/g, " ");
    document.getElementById("modelSelection").value = local['chosenModel']

    setDatasetFormOptions(local['chosenModel'])
  } else {
    document.getElementById("modelSelection").value = '';
  }

  if (params['dataset'] != null) {
    local['chosenDataset'] = params['dataset'].replace(/_/g, " ");
    document.getElementById("datasetSelection").value = local['chosenDataset']

    $('#datasetSelection').attr("disabled", false);
  } else if (document.getElementById("modelSelection").value == '') {
    $('#datasetSelection').attr("disabled", true);
    document.getElementById("datasetSelection").value = '';
  }
}

function updateHash(chosenModel, chosenDataset) {
  if (chosenDataset == null) {
    chosenDataset = 'null'
  }
  hash = 'model=' + chosenModel.replace(/ /g, "_") + "&dataset=" + chosenDataset.replace(/ /g, "_")
  window.location.hash = hash
}

function onModelSelect() {
  chosenModel = $('#modelSelection').val()
  if (chosenModel === '') {
    return
  }

  local['chosenModel'] = chosenModel

  setDatasetFormOptions(chosenModel);

  if (datasetOptions.length > 0) { 
    $('#datasetSelection').removeAttr('disabled');

    // Default to selecting the first dataset
    document.getElementById("datasetSelection").value = datasetOptions[0]
    local['chosenDataset'] = datasetOptions[0]

    // Loading the profile for this model/dataset combination.
    loadProfile()
  } else {
    local['chosenDataset'] = null
    $('#datasetSelection').attr("disabled", true);
    document.getElementById('profile').style.visibility='hidden';
  }

  // Update the hash so that if the user refreshes, they see the same page.
  updateHash(local['chosenModel'], local['chosenDataset'])
}

function onDatasetSelect() {
  chosenDataset = $('#datasetSelection').val()
  local['chosenDataset'] = chosenDataset

  // Update the hash so that if the user refreshes, they see the same page.
  updateHash(local['chosenModel'], local['chosenDataset'])

  // Load profile for the chosen model
  loadProfile(); 
}


function loadResponses(chosenDataset, chosenModel) {
  // TODO: This should be put in a utils.js rather than being compied between profile_page.js and responses_page.js
  if (chosenDataset in responses) {
    var conversations = responses[chosenDataset]['data'];

    var html = '';

    // For each conversaion for this dataset
    for (var idx=0; idx<conversations.length; idx++) {
      conv = conversations[idx];
      for (const [ modelName, response ] of Object.entries(conv['response'])) {
        if (modelName === chosenModel) {
          html += '<div class="mbr-text col-12 col-md-8 mbr-fonts-style display-7 conversation">';
          html += `<ul class="list-group">`
          html += `<li class="list-group-item list-group-item-dark">Prompt: ${conv['prompt']}</li>`;
          html += `<li class="list-group-item">${modelName}: ${response}</li>`;
          html += `</ul>`;
          html += '</div>';
        }
      }
    }
    document.getElementById('responses').innerHTML = html;
  } else {
    document.getElementById('responses').innerHTML = 'Responses are not yet available.';
  }
} 

[000057, 001355, 005584, 006735, 007560, 008414, 009965, 011332, 012078, 012885]
