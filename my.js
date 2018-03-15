var allTasks = new Array();
var endTask = new Object();
var startTask = new Object();
var criticalPath = new Array();

function addStartTask() {
	startTask.dto = 0;
	startTask.fto = 0;
	startTask.dta = 0;
	startTask.fta = 0;
	startTask.mt = 0;
	startTask.ml = 0;
	startTask.name = "start";
	startTask.duration = 0;
	startTask.predecessorObj = new Array();
	startTask.predecessor = new Array();
	startTask.next = new Array();

	allTasks[allTasks.length] = startTask;

	var option = document.createElement("option");
	option.text = startTask.name;
	selectTaskPredecessor.add(option);
	addEndTask();
	refreshTab();
	calculerDuree();
}

function addEndTask() {
	endTask.dto = 0;
	endTask.fto = 0;
	endTask.dta = 0;
	endTask.fta = 0;
	endTask.mt = 0;
	endTask.ml = 0;
	endTask.name = "end";
	endTask.duration = 0;
	endTask.predecessorObj = new Array();
	endTask.predecessor = new Array();
	endTask.next = new Array();
	allTasks[allTasks.length] = endTask;
}

function ajouterTache() {	
	var form = document.forms["pert"];
	form.taskName.style.backgroundColor = "#fff";
	form.taskDuration.style.backgroundColor = "#fff";

	// Création de l'objet Task et insertion des valeurs
	if(form.taskName.value && (parseInt(form.taskDuration.value) >= 0)) {
		var task = new Object();
		task.dto = 0;
		task.fto = 0;
		task.dta = 0;
		task.fta = 0;
		task.mt = 0;
		task.ml = 0;
		task.name = form.taskName.value.toLowerCase();
		task.duration = parseInt(form.taskDuration.value);
		task.predecessorObj = new Array();
		task.predecessor = new Array();
		task.next = new Array();

		// Sélection du select multiple
		var selectTaskPredecessor = form.selectTaskPredecessor;

		// Ajout des prédécesseurs & successeurs de la tâche créee
		var count = 0;
		for(var i = 0; i < selectTaskPredecessor.options.length; i++) {
			if(selectTaskPredecessor.options[i].selected) {
				count++;
			}
		}
		// Si aucun prédécesseur sélectionné
		if(count == 0) {
			task.predecessorObj[task.predecessorObj.length] = startTask;
			task.predecessor[task.predecessor.length] = startTask.name;
			startTask.next[startTask.next.length] = task;
		// Si prédécesseur(s) sélectionné(s)
 		} else if(count > 0)  {
			for(var i = 0; i < selectTaskPredecessor.options.length; i++) {
				if(selectTaskPredecessor.options[i].selected) {
					var t = allTasks.find(function(element) {
						return element.name == selectTaskPredecessor.options[i].value;
					});
					task.predecessorObj[task.predecessorObj.length] = t;
					task.predecessor[task.predecessor.length] = t.name;
					t.next[t.next.length] = task;
				}
			}
 		}
		task.next[task.next.length] = endTask;
		endTask.predecessorObj[endTask.predecessorObj.length] = task;
		endTask.predecessor[endTask.predecessor.length] = task.name;

		// Ajout de la task dans le tableau des tasks
		allTasks[allTasks.length] = task;

		// Ajout de la task dans la liste déroulante des prédécesseurs
		var option = document.createElement("option");
		option.text = task.name;
		selectTaskPredecessor.add(option);
		form.reset();
		
		deleteTable();
		calculPert();
		refreshTab();
		calculerDuree();
		//calculerCheminCritique();
	} else {
		alert("Erreur, il faut un nom de tâche et une durée >= 0");
		form.taskName.style.backgroundColor = "#ffd5d5";
		form.taskDuration.style.backgroundColor = "#ffd5d5";
	}
}

function refreshTab() {
	var tableauPert = document.getElementById("tableauPert");
	for(var i = 0; i < allTasks.length; i++) {
		var row = tableauPert.insertRow(tableauPert.rows.length);
		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		var cell2 = row.insertCell(2);
		var cell3 = row.insertCell(3);
		var cell4 = row.insertCell(4);
		var cell5 = row.insertCell(5);
		var cell6 = row.insertCell(6);
		var cell7 = row.insertCell(7);
		var cell8 = row.insertCell(8);
		cell0.innerHTML = allTasks[i].name;
		cell1.innerHTML = allTasks[i].duration;
		cell2.innerHTML = allTasks[i].predecessor.join(",");
		cell3.innerHTML = allTasks[i].dto;
		cell4.innerHTML = allTasks[i].fto;
		cell5.innerHTML = allTasks[i].dta;
		cell6.innerHTML = allTasks[i].fta;
		cell7.innerHTML = allTasks[i].mt;
		cell8.innerHTML = allTasks[i].ml;
	}
}

function deleteTable() {
	var tableauPert = document.getElementById("tableauPert");
	while(tableauPert.rows.length > 1) {
		tableauPert.deleteRow(1);
	}
}

function calculPert() {

	// On supprime l'ancienne tâche END
	for(var i = 0; i < allTasks.length; i++) {
		if(allTasks[i].name == "end") {
			allTasks.splice(i, 1);
		}
	}

	// Création d'une nouvelle tâche de fin fictive
	endTask.dto = 0;
	endTask.fto = 0;
	endTask.dta = 0;
	endTask.fta = 0;
	endTask.mt = 0;
	endTask.ml = 0;
	endTask.name = "end"
	endTask.duration = 0;
	endTask.predecessorObj = new Array();
	endTask.predecessor = new Array();
	endTask.next = new Array();

	// Pour toutes les tâches existantes
	for(var i = 0; i < allTasks.length; i++) {
		// Pour tous les successeurs de la tâche courante
		if(allTasks[i].next.length == 1) {
			for(var t = 0; t < allTasks[i].next.length; t++) {
				if(allTasks[i].next[t].name == "end") {
					endTask.predecessor[endTask.predecessor.length] = allTasks[i].name;
					endTask.predecessorObj[endTask.predecessorObj.length] = allTasks[i];
				}
			}
		} else if(allTasks[i].next.length > 1) {
			for(var t = 0; t < allTasks[i].next.length; t++) {
				if(allTasks[i].next[t].name == "end") {
					endTask.predecessor.splice(t, 1);
					endTask.predecessor.splice(t, 1);
					allTasks[i].next.splice(t, 1);
				}
			}
		}

		if(allTasks[i].predecessorObj.length == 0) {
			allTasks[i].dto = 0;
			allTasks[i].fto = allTasks[i].duration;
		// Sinon si la tâche courante a des prédécesseurs
		} else {
			var maxDto = 0;
			var prevDuration = 0;
			// Pour tous les prédécesseurs de la tâche courante
			for(var y = 0; y < allTasks[i].predecessorObj.length; y++) {
				if(allTasks[i].predecessorObj[y].dto >= maxDto) {
					maxDto = allTasks[i].predecessorObj[y].dto;
					prevDuration = allTasks[i].predecessorObj[y].duration;
					// DTO - Dâte de début au plus tôt
					allTasks[i].dto = maxDto + prevDuration;
					// FTO - Dâte de fin au plus tôt
					allTasks[i].fto = allTasks[i].dto + allTasks[i].duration;
				}
			}
		}
	}

	var max = 0;
	for(e = 0; e < endTask.predecessorObj.length; e++) {
		if(endTask.predecessorObj[e].fto >= max) {
			max = endTask.predecessorObj[e].fto;
		}
	}

	endTask.dto = max;
	endTask.fto = max;
	endTask.fta = max;
	endTask.dta = max;
	allTasks[allTasks.length] = endTask;

	// Calcul FTA & DTA
	for(var i = allTasks.length - 1; i > 0; i--) {
		// Si la tâche courante a des sucesseur(s)
		if(allTasks[i].next.length > 0) {
			var minDta = allTasks[i].next[0].dta;
			var minDto = allTasks[i].next[0].dto;
			for(var j = 0 ; j < allTasks[i].next.length; j++) {
				if(allTasks[i].next[j].dta <= minDta) {
					minDta = allTasks[i].next[j].dta;
				}
				if(allTasks[i].next[j].dto <= minDto) {
					minDto = allTasks[i].next[j].dto;
				}
			}
			allTasks[i].fta = minDta;
			allTasks[i].dta = allTasks[i].fta - allTasks[i].duration;
			allTasks[i].mt = allTasks[i].dta - allTasks[i].dto;
			allTasks[i].ml = minDto - allTasks[i].fto;
		}
	}

}

function calculerDuree() {
	var p = document.getElementById("duree");
	p.innerHTML = "Durée du projet : "+endTask.fto+" jours";
}

function calculerCheminCritique() {
	criticalPath = new Array();
	var currentTask = startTask;
	while(currentTask.name != "end") {
		if(currentTask.mt == 0) {
			criticalPath[criticalPath.length] = currentTask.name;
			for(var i = 0; i < currentTask.next.length; i++) {
				if(currentTask.next[i].mt == 0) {
					currentTask = currentTask.next[i];
				}
			}
		}
	}
	var p = document.getElementById("cheminCritique");
	p.innerHTML = criticalPath.join(",");
}