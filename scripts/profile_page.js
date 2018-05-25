google.charts.load('current', {packages: ['corechart', 'bar']});
// google.charts.setOnLoadCallback(drawBarGraph);

voteData = 
{
    "NCM": [
        {
            "m1win": 12,
            "m2win": 32,
            "model1": "Seq2SeqAttn",
            "model2": "Human1",
            "tie": 12
        },
        {
            "m1win": 24,
            "m2win": 24,
            "model1": "Seq2SeqAttn",
            "model2": "Human2",
            "tie": 52
        },
        {
            "m1win": 45,
            "m2win": 12,
            "model1": "Seq2SeqAttn",
            "model2": "CakeChat",
            "tie": 65
        }
    ],
    "DBDC": [
        {
            "m1win": 12,
            "m2win": 32,
            "model1": "Seq2SeqAttn",
            "model2": "Human1",
            "tie": 12
        },
        {
            "m1win": 24,
            "m2win": 24,
            "model1": "Human2",
            "model2": "Seq2SeqAttn",
            "tie": 52
        },
        {
            "m1win": 24,
            "m2win": 12,
            "model1": "Seq2SeqAttn",
            "model2": "Foobar",
            "tie": 65
        }
    ]
}

local = {}

window.onload = function() {
  /**Contains initialization of various dataset parameters.
  This gets run when the web page first loads.
  **/
  local['chosenModel'] = $('#modelSelection').val()
  local['chosenDataset'] = null
  document.getElementById('metricsTable').style.visibility='hidden';
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
      output.push(['<a href="www.google.com">' + task['model1'].toString() + '</a>',
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

  function loadProfile() {
    var chosenModel = local['chosenModel']
    var chosenDataset = local['chosenDataset']
    
    // Update the title
    var title = '<h3>Model: ' + chosenModel + '</h3>'
    title += '<h3>Dataset: ' + chosenDataset + '</h3>';
    document.getElementById('profileTitle').innerHTML = title;

    // Update the metrics table
    var table = document.getElementById("metricsTable");
    distinct1Row = table.insertRow();
    distinct1Row.insertCell().innerHTML = 'Distint-1';
    distinct1Row.insertCell().innerHTML = '0.01234';
    distinct2Row = table.insertRow();
    distinct2Row.insertCell().innerHTML = 'Distint-2';
    distinct2Row.insertCell().innerHTML = '0.01234';

    document.getElementById('metricsTable').style.visibility='visible';

    // Update the bar graph
    drawBarGraph(chosenModel, chosenDataset);
  }

  function setModel() {
    chosenModel = $('#modelSelection').val()
    local['chosenModel'] = chosenModel

    datasetOptions = getPossibleDatasets(chosenModel)
    datasetSelectHtml = ''
    for (var i=0; i<datasetOptions.length; i++) {
      datasetSelectHtml += '<option>' + datasetOptions[i] + '</option>\n'
    }
    document.getElementById('datasetSelection').innerHTML = datasetSelectHtml

    if (datasetOptions.length > 0) { 
      $('#datasetSelection').removeAttr('disabled');

      // Default to selecting the first dataset
      document.getElementById("datasetSelection").value = datasetOptions[0]
      local['chosenDataset'] = datasetOptions[0]

      // Loading the profile for this model/dataset combination.
      loadProfile()
    } else {
      $('#datasetSelection').attr("disabled", true);
    }
  }

  function setDataset() {
    chosenDataset = $('#datasetSelection').val()
    local['chosenDataset'] = chosenDataset
    loadProfile()
  }