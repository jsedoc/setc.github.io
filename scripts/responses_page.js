local = {}

function loadResponses() {
	var selectedDataset = $('#datasetSelection input:radio:checked').val()
	if (selectedDataset in responses) {
		var checkedModels = [];
		for (let modelNode of document.querySelectorAll('input[name=modelSelection]:checked')) {
			checkedModels.push(modelNode['value']);
		}

		var html = '';
		for (let conv of responses[selectedDataset]['data']) {
			html += '<div class="mbr-text col-12 col-md-8 mbr-fonts-style display-7 conversation">';
			html +=  `<ul class="list-group">`
			prompt = conv['prompt'];
			html += `<li class="list-group-item list-group-item-dark">Prompt: ${prompt}</li>`;

			for (const [ modelName, response ] of Object.entries(conv['response'])) {
				if (checkedModels.includes(modelName)) {
					html += `<li class="list-group-item">${modelName}: ${response}</li>`;
				}
			}
			html += '</ul>';
			html += '</div>';
		}
		document.getElementById('responses').innerHTML = html;
	} else {
		document.getElementById('responses').innerHTML = '<p>No models have been run on the selected dataset.</p>';
	}
}

function loadDatasetChoices(indexToSelect) {
	// Load the side panel with correct dataset options.
	var idx = 0;
	var html = '';
	for (let datasetName of datasets) {
		html += `<div class="form-check">
		<input class="datasetInput" type="radio" name="datasetSelection" id="datasetSelection${idx}" value="${datasetName}">
		<label class="datasetInputLabel" for="datasetSelection${idx}">
		${datasetName}
		</label>
		</div>`;
		idx++;
	}
	document.getElementById('datasetSelection').innerHTML = html;

	// Select the first dataset.
	$('input[name=datasetSelection]')[indexToSelect].checked = true;
}

function loadModelChoices(datasetName) {
	console.log('Loading models for ' + datasetName);

	if (datasetName in responses) {
		// Load the side panel with the correct model options.
		var modelNames = responses[datasetName]['models'];
		var html = '';
		for (var idx = 0; idx < modelNames.length; idx++) {
			modelName = modelNames[idx];

			html += `<div class="form-check">
			<input class="modelInput" type="checkbox" name="modelSelection" id="modelSelection${idx}" value="${modelName}">
			<label class="modelInputLabel" for="modelSelection${idx}">
			${modelName}
			</label>
			</div>`;
		}
		document.getElementById('modelSelection').innerHTML = html;

		// Default to all the models checked.
		for (var idx=0; idx < $('input[name=modelSelection]').length; idx++) {
			$('input[name=modelSelection]')[idx].checked = true;
		}

		// Add the change listener onto each new checkbox.
		$( ".modelInput" ).change(onSelect);
	} else {
		document.getElementById('modelSelection').innerHTML = '';
	}

}

window.onload = function() {
	loadDatasetChoices(0);
	loadModelChoices(datasets[0]);
	local['selectedDataset'] = datasets[0];

	loadResponses();

	$( ".modelInput" ).change(onSelect);
	$( ".datasetInput" ).change(onSelect);
}

function onSelect() {
	console.log('HERE')
	var selectedDataset = $('#datasetSelection input:radio:checked').val()
	console.log('Selected dataset: ' + selectedDataset);

	if (selectedDataset != local['selectedDataset']) {
		// Update the model choices if necessary.
		loadModelChoices(selectedDataset);
		local['selectedDataset'] = selectedDataset;
	}

	// Load the responses into the html.
	loadResponses();

	$(window).scrollTop(0);
}