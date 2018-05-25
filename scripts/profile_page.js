google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawAnnotations);

voteData = 
{
    "NCM": [
        {
            "m1win": 12,
            "m2win": 32,
            "model1": "SeqSeqAttn",
            "model2": "Human1",
            "tie": 12
        },
        {
            "m1win": 24,
            "m2win": 24,
            "model1": "SeqSeqAttn",
            "model2": "Human2",
            "tie": 52
        },
        {
            "m1win": 45,
            "m2win": 12,
            "model1": "SeqSeqAttn",
            "model2": "CakeChat",
            "tie": 65
        }
    ],
    "Cakechat": [
        {
            "m1win": 12,
            "m2win": 32,
            "model1": "SeqSeqAttn",
            "model2": "Human1",
            "tie": 12
        },
        {
            "m1win": 24,
            "m2win": 24,
            "model1": "Human2",
            "model2": "SeqSeqAttn",
            "tie": 52
        },
        {
            "m1win": 24,
            "m2win": 12,
            "model1": "SeqSeqAttn",
            "model2": "CakeChat",
            "tie": 65
        }
    ]
}

function parseData(voteData, dataset, targetModel) {
	data = voteData[dataset]
  output = []
  output.push(['Model',
                targetModel  + ' wins',
                {type: 'string', role: 'annotation'},
                'Compteting model wins',
                {type: 'string', role: 'annotation'},
                'Tie',
                {type: 'string', role: 'annotation'}])
  for (let task of data) {
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
      output.push([task['model2'],
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

function drawAnnotations() {
      var targetModel = 'SeqSeqAttn';
      var targetDataset = 'NCM';

			var data = parseData(voteData, targetDataset, targetModel);
      var dataTable = google.visualization.arrayToDataTable(data)
      console.log(dataTable)

      // var data = google.visualization.arrayToDataTable([
      //   ['', '2010 Population', {type: 'string', role: 'annotation'}, '2000 Population', {type: 'string', role: 'annotation'}],
      //   ['NCM', 8175000, 'a', 8008000, 'b'],
      //   ['Human 1', 3792000, 'a', 3693999, 'b'],
      //   ['Human 2', 2695000, 'a', 2896000, 'b'],
      //   ['Cakechat', 2099000, 'a', 1953000, 'b'],
      //   ['Philadelphia, PA', 1526000, 'a', 1517000, 'b']
      // ]);

      //  var dataTable = google.visualization.arrayToDataTable([
      //   ['City', '2010 Population', {type: 'string', role: 'annotation'},
      //    '2000 Population', {type: 'string', role: 'annotation'}],
      //   ['New York City, NY', 8175000, '8.1M', 8008000, '8M'],
      //   ['Los Angeles, CA', 3792000, '3.8M', 3694000, '3.7M'],
      //   ['Chicago, IL', 2695000, '2.7M', 2896000, '2.9M'],
      //   ['Houston, TX', 2099000, '2.1M', 1953000, '2.0M'],
      //   ['Philadelphia, PA', 1526000, '1.5M', 1517000, '1.5M']
      // ]); 
      // console.log(dataTable)

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