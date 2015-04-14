/**
 *	setup used when creating a new state.
 *	Adds in draggable functionality, and doubleclick functionality.
 *
 *	parameters:
 *		id: 	id of the state to setup
 */
function setupState(id){
	$("#" + id).draggable({ 
		containment: "#mainCanvas", 
		scroll: true,
		start: function(){
			hideTransitions(id);
		},
		stop: function(){
			update(id);
		},
	});
	$("#" + id).dblclick(function(){
		toggleAccept(id);
	});	
	$("#" + id).click(function(){
		stateClick(id);
	});
}

//function for add state is a direct call to addState() in ui_fsm

var creatingTransition = false;
var transitionNumber = 0;
var transitionIds = [];

var removingState = false;

function initTransitionCreation(){
	endTransitionCreation();
	endRemoveState();

	creatingTransition = true;
	transitionNumber = 0;
	current_task.text("Click First State of Transition");
}

function openTransitionDialog(){
	var id = transitionIds[0] + "->" + transitionIds[1];
	current_task.text("Editing Transition: " + id);
	transition_tip.text(id);
	transition_characters.val(getTransitionCharacters(id));
	transition_dialog.dialog("open");
}

function endTransitionCreation(){
	for(var x = 0; x < transitionNumber; x++){
		setHighlight(transitionIds[x], false);
	}

	creatingTransition = false;
	transitionNumber = 0;
	current_task.text("");
}

function initRemoveState(){
	endTransitionCreation();
	removingState = true;
	current_task.text("Click State to Remove");
}

function endRemoveState(){
	removingState = false;
	current_task.text("");
}

function stateClick(id){
	if(creatingTransition){
		transitionIds[transitionNumber] = id;
		transitionNumber++;
		setHighlight(id, true);
		if(transitionNumber == 1){
			current_task.text("Click Second State of Transition");
		}
		if(transitionNumber > 1){
			openTransitionDialog();
		}
	}
	else if(removingState){
		removeState(id);
		endRemoveState();

	}
}

function checkString(){
	var str = document.getElementById("input_string").value;
	alert("" + machine.testString(str));
}

var current_task;

var transition_tip;
var transition_dialog;
var transition_characters;
function setupButtons(){
	 $(function(){
	 	$(document).tooltip();

	 	current_task = $("#current_task");

		$("#sigma").button({
			text: false
		}).click(function(event){ alphabet_dialog.dialog("open"); });

		$("#add_state").button({
			icons: {
				primary: "ui-icon-plus"
			},
			text: true
		}).click(function (event){ addState(); endTransitionCreation(); endRemoveState(); });

		$("#edit_transition").button({
			icons: {
				primary: "ui-icon-transfer-e-w"
			},
			text: true
		}).click(function (event){ initTransitionCreation(); });

		$("#remove_state").button({
			icons: {
				primary: "ui-icon-circle-close"
			},
			text: true
		}).click(function (event){ initRemoveState(); });

		$("#play").button({
			icons: {
				primary: "ui-icon-play"
			}, 
			text: false
		}).click(function (event){alert("todo - play string test")});

		$("#step").button({
			icons: {
				primary: "ui-icon-seek-end"
			},
			text: false
		}).click(function (event){alert("todo - step string text");});

		$("#check").button({
			icons: {
				primary: "ui-icon-check"
			},
			text: false
		}).click(function (event){ checkString(); });

		$("#add_string").button({
			text: true
		}).click(function (event){alert("todo - add string");});

		$("#test_all").button({
			text: true
		}).click(function (event){alert("todo - test all")});

		$("#test").button({
			icons: {
				primary: "ui-icon-check"
			},
			text: false
		});



		var alphabet_characters = $("#alphabet_characters");

        var alphabet_dialog = $( "#alphabet_dialog" ).dialog({
	      autoOpen: false,
	      height: 300,
	      width: 350,
	      modal: true,
	      buttons: {
	        "Add": addAlphabet,
	        Cancel: closeAlphabet
	      },
	      close: function() {
	      	closeAlphabet();
	      }
	    });

        alphabet_dialog.find("form").on("submit", function(event){
        	event.preventDefault();
        	addAlphabet();
        });

	    function addAlphabet(){
			addToAlphabet(alphabet_characters.val());
			closeAlphabet();
	    }

	    function closeAlphabet(){
	    	alphabet_dialog.dialog("close");
	    	alphabet_characters.val("");
	    }

	    transition_characters = $("#transition_characters");
	    transition_tip = $("#transition_tip");

	    transition_dialog = $("#transition_dialog").dialog({
	    	autoOpen: false,
	    	height: 300,
	    	width: 350,
	    	modal: true,
	    	buttons: {
	    		"Add": addTransition_,
	    		Cancel: closeTransition
	    	},
	    	close:  function(){
	    		closeTransition();
	    	}
	    });

	    transition_dialog.find("form").on("submit", function(event){
	    	event.preventDefault();
	    	addTransition_();
	    });

	    function addTransition_(){
	    	var characters = transition_characters.val();
	    	addTransition(transitionIds[0], transitionIds[1],  characters);
	    	closeTransition();
	    }

	    function closeTransition(){
	    	transition_dialog.dialog("close");
	    	transition_characters.val("");
	    	endTransitionCreation();
	    }
    });
}