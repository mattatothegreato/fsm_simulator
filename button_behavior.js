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
	creatingTransition = true;
	transitionNumber = 0;

	endRemoveState();
}

function endTransitionCreation(){
	creatingTransition = false;
	transitionNumber = 0;
}

function transitionCreation(){
	creatingTransition = false;
	transitionNumber = 0;

	//open up menu for selecting characters instead of always abcd
	addTransition(transitionIds[0], transitionIds[1], "abcd");
	
	toggleHighlight(transitionIds[0]);
	toggleHighlight(transitionIds[1]);

	endTransitionCreation();
}

function initRemoveState(){
	removingState = true;

	endTransitionCreation();
}

function endRemoveState(){
	removingState = false;
}

function stateClick(id){
	if(creatingTransition){
		transitionIds[transitionNumber] = id;
		transitionNumber++;
		if(transitionNumber > 1){
			transitionCreation();
		}
		toggleHighlight(id);
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

function setupButtons(){
	 $(function(){
	 	$(document).tooltip();

		$("#sigma").button({
			text: false
		}).click(function (event){alert("todo - sigma"); });

		$("#add_state").button({
			icons: {
				primary: "ui-icon-plus"
			},
			text: true
		}).click(function (event){ addState(); });

		$("#add_transition").button({
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
    });
}