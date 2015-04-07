var machine = new Machine(); //the machine (data not ui)

var transitionList = new List(); //list of transitions (ui)

var lineThickness = 1; //thickness of transition lines

var counter = 0; //counter used to create unique state id's.
//state id is of the form ("s" + counter)

/**
 *	setup for our fsm ui.
 *	Basically just adds the start arrow to our canvas.
 *	Initial visibility for our start arrow is hidden, as there is no start state.
 */
function setup(){
	var start = document.createElement("div");
	start.setAttribute("id", "start");
	start.setAttribute("class", "start");
	document.getElementById("mainCanvas").appendChild(start);
}


//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------




/*
88b           d88 88888888888 888888888888 88        88   ,ad8888ba,   88888888ba,    ad88888ba   
888b         d888 88               88      88        88  d8"'    `"8b  88      `"8b  d8"     "8b  
88`8b       d8'88 88               88      88        88 d8'        `8b 88        `8b Y8,          
88 `8b     d8' 88 88aaaaa          88      88aaaaaaaa88 88          88 88         88 `Y8aaaaa,    
88  `8b   d8'  88 88"""""          88      88""""""""88 88          88 88         88   `"""""8b,  
88   `8b d8'   88 88               88      88        88 Y8,        ,8P 88         8P         `8b  
88    `888'    88 88               88      88        88  Y8a.    .a8P  88      .a8P  Y8a     a8P  
88     `8'     88 88888888888      88      88        88   `"Y8888Y"'   88888888Y"'    "Y88888P" */



/**
 *	adds a state to both the ui, and our machine.
 *	if we don't already have a start state, it sets this new state to our start state.
 */
function addState(){
	var canvas = document.getElementById("mainCanvas");

	var needsStart = machine.startState == null;

	var stateId = "s" + counter;
	var newElement = document.createElement("div");
	machine.addState(new State(stateId, false));

	newElement.setAttribute("id", stateId);
	newElement.setAttribute("class", "draggable");
	newElement.innerHTML = "<br>" + counter;

	canvas.appendChild(newElement);
	setupState(stateId);
	counter++;

	if(needsStart) setStart(stateId);
}


/**
 *	function to remove a state.
 *	Removes from both the ui and the machine.
 *	Removes all transitions that connect to this state.
 */
function removeState(id){
	machine.removeState(id);

	var x = 0;
	while(x < transitionList.size()){
		if(transitionList.get(x).hasState(id)){
			transitionList.get(x).remove();
			transitionList.remove(x);
		}
		else x++;
	}
	document.getElementById("mainCanvas").removeChild(document.getElementById(id));
}


/**
 *	toggles whether or not the state is an accept state.
 *
 *	parameters:
 *		id: 	id of the state to change
 */
function toggleAccept(id){
	var state = machine.getState(id);
	if(state != null){
		state.toggleAccept();
		$("#" + id).toggleClass("accept");
	}
	else alert(machine.toString());
}


/**
 *	Changes start state of our machine.
 *	if it's a valid start state, update machine and ui.
 *
 *	parameters:
 *		id: 	state to set as our start state.
 */
function setStart(id){
	machine.setStart(id);


	if(machine.startState != null){
		alert("visually change start");
		updateStart();
	}
}


/**
 * function to add transition.
 * adds to machine and ui
 * when it adds it to machine, machine also calls to remove that transition
 * same thing with here, it removes the visual portion before adding the transition
 * 		(this is so that we don't get duplicate transitions, and don't have to edit)
 *
 * parameters:
 *  	id1: 		id of state where the transition starts
 * 		id2: 		id of state where the transition ends
 * 		characters: String signifying which characters this transition acts on. (ignores spaces)
 */	
function addTransition(id1, id2, characters){
	var s1 = machine.getState(id1); //gets initial state
	var s2 = machine.getState(id2); //gets end state

	var cs = []; //initialize our list of characters
	for(var x = 0; x < characters.length; x++){
		if(characters.charAt(x) != ' '){ //add character from string to list (ignore spaces)
			cs.push(characters.charAt(x));
		}
	}

	//transition id
	var id = id1 + "->" + id2;

	//add transition to machine
	s1.addTransition(new Transition(id, s2, cs)); 

	//add transition to ui {
		removeTransitionVISUAL(id); //remove transition from ui (instead of editing)
		var ui_transition = new UI_Transition(id1, id2, characters);
		transitionList.add(ui_transition);
	//}
}


/**
 * function to remove a transition.
 * removes from ui and machine
 *
 * parameters: 
 * 		id1: 	id of starting state for the transition
 * 		id2: 	id of ending state for the transition
 */
function removeTransition(id1, id2){
	var id = id1 + "->" + id2;
	machine.removeTransition(id);

	removeTransitionVISUAL(id);
}


//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------




/*
88        88 88     	    ,ad8888ba,   888b      88 88     8b        d8  
88        88 88     	   d8"'    `"8b  8888b     88 88      Y8,    ,8P   
88        88 88     	  d8'        `8b 88 `8b    88 88       Y8,  ,8P    
88        88 88     	  88          88 88  `8b   88 88        "8aa8"     
88        88 88     	  88          88 88   `8b  88 88         `88'      
88        88 88     	  Y8,        ,8P 88    `8b 88 88          88       
Y8a.    .a8P 88     	   Y8a.    .a8P  88     `8888 88          88       
 `"Y8888Y"'  88     	    `"Y8888Y"'   88      `888 88888888888 88
*/


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
			//hide transitions
		},
		drag: function(){ 
		},
		stop: function(){
			update(id);
		},
	});
	$("#" + id).dblclick(function(){
		toggleAccept(id);
	});	
}


/**
 * function to update the start arrow
 * Moves start arrow to the current start state, and shows it. 
 * However if there is no start state, it simply hides the start arrow.
 */
function updateStart(){
	if(machine.startState == null){
		startVisibility(false);
	}
	else{
		var start_arrow = $("#start");
		var state = $("#" + machine.startState.id);

		var x1 = state.position().left;
		var y1 = state.position().top;
		var height = state.height();
		var w = start_arrow.width();
		var h = start_arrow.height();



		start_arrow.css("left", x1 - w);
		start_arrow.css("top", y1 + height/2 - h/2);

		startVisibility(true);
	}
}


/**
 * function to update our fsm ui
 * Usually called when a state is moved, so the connecting transitions get updated. 
 *
 * parameters:
 * 		id: 	id of the state that was changed
 */
function update(id){
	for(var x = 0; x < transitionList.size(); x++){
		if(transitionList.get(x).hasState(id)) transitionList.get(x).repaint();
	}
	updateStart();
}


/**
 *	function to change visibility of our start arrow.
 *	UI ONLY
 *
 *	parameters:
 *		show: 	whether or not our start arrow should be visible
 */
function startVisibility(show){
	if(show){
		$("#start").css("visibility", "visible");
	}
	else{
		$("#start").css("visibility", "hidden");
	}
}


/**
 *	function to rename a state.
 *	Name of state is displayed within the state. 
 *	Default name is just the state id, without the leading "s"
 *
 *	parameters:
 *		id: 	id of the state to change
 *		name: 	new name for the state
 */
function renameState(id, name){
	document.getElementById(id).innerHTML = name;
}


/**
 * function to VISUALLY remove a transition
 * removes from HTML document, and our transitionList 
 *
 * parameters: 
 * 		id: 	id of transition to remove
 */
function removeTransitionVISUAL(id){
	for(var x = 0; x < transitionList.size(); x++){
		if(transitionList.get(x).id === id){
			transitionList.get(x).remove();
			transitionList.remove(x);
		}
	}
}


/**
 *	toggles highlight of state.
 *	UI ONLY
 *
 *	parameters:
 *		id: 	id of state to change
 */
function toggleHighlight(id){
	$("#" + id).toggleClass("highlight");
}


//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------




/*ad88888ba 888888888888 88888888ba  88 888b      88   ,ad8888ba,   
 d8"     "8b     88      88      "8b 88 8888b     88  d8"'    `"8b  
 Y8,             88      88      ,8P 88 88 `8b    88 d8'            
 `Y8aaaaa,       88      88aaaaaa8P' 88 88  `8b   88 88             
   `"""""8b,     88      88""""88'   88 88   `8b  88 88      88888  
         `8b     88      88    `8b   88 88    `8b 88 Y8,        88  
 Y8a     a8P     88      88     `8b  88 88     `8888  Y8a.    .a88  
  "Y88888P"      88      88      `8b 88 88      `888   `"Y88888P"*/ 


/**
 * function to add characters to our machine's alphabet.
 * Ignores spaces.
 * 
 * parameters:
 * 		str: 	String of characters to add to the alphabet.
 */
function addToAlphabet(str){
	for(var x = 0; x < str.length; x++){
		var c = str.charAt(x);
		if(c != ' ') machine.alphabet.add(c);
	}
}


//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------



                                                                                          
/*,ad8888ba,  88                 db        ad88888ba   ad88888ba  88888888888 ad88888ba   
 d8"'    `"8b 88                d88b      d8"     "8b d8"     "8b 88         d8"     "8b  
d8'           88               d8'`8b     Y8,         Y8,         88         Y8,          
88            88              d8'  `8b    `Y8aaaaa,   `Y8aaaaa,   88aaaaa    `Y8aaaaa,    
88            88             d8YaaaaY8b     `"""""8b,   `"""""8b, 88"""""      `"""""8b,  
Y8,           88            d8""""""""8b          `8b         `8b 88                 `8b  
 Y8a.    .a8P 88           d8'        `8b Y8a     a8P Y8a     a8P 88         Y8a     a8P  
  `"Y8888Y"'  88888888888 d8'          `8b "Y88888P"   "Y88888P"  88888888888 "Y88888P"*/

/**
 * Class that represents our UI Transitions
 *
 * parameters: 
 * 		id1: 		id of state this transition starts at
 *  	id2: 		id of state this transition ends at
 * 		characters: string representing which characters this transition is valid on
 */
function UI_Transition(id1, id2, characters){
	//variables
	this.id = id1 + "->" + id2; //id for the transition
	this.id1 = id1; //start state id
	this.id2 = id2;	//end state id

	this.color = "#ffffff"; //default color, set in repaint (used to reset highlighted color)
							//each transition type has a certain color to differentiate it

	//the three segments that make up the transition
	this.sourceSegment = new Segment(this.id + "_source");
	this.middleSegment = new Segment(this.id + "_middle");
	this.finishSegment = new Segment(this.id + "_finish");

	//label which shows characters for this transition
	this.label = new TransitionLabel(this.id + "_label", characters);

	/**
	 * function to determine if this transition is related to a state
	 * used to only update necessary transitions when a state is changed
	 *
	 * parameters:
	 * 		id: 	id of the state
	 *
	 * return:
	 * 		boolean value of whether or not this transition is related to the state
	 */
	this.hasState = function(id){
		return this.id1 === id || this.id2 === id;
	}

	/**
	 * function to repaint (update) the fsm ui
	 * updates this transitions label and segments
	 * changes default color based on transition type
	 * resets color to reflect default color
	 */
	this.repaint = function(){
		//get necessary states from html document (via jquery)
		var s1 = $("#" + this.id1);
		var s2 = $("#" + this.id2);;

		//gets (x,y) location for each state (via jquery)
		var x1 = s1.position().left;
		var x2 = s2.position().left;
		var y1 = s1.position().top;
		var y2 = s2.position().top;

		//gets width and height of our states (via jquery)
		var w = s1.width(); 	//should be same for s1 and s2
		var h = s1.height();	//should be same for s1 and s2

		//calculates the x and y distances between the two states
		var dx = Math.abs(x1 - x2);
		var dy = Math.abs(y1 - y2);

		//use above information to edit segments, label and color

		if(this.id1 === this.id2){ //if transition is on same state: draw a loop
			var random = Math.random() * 5; //roll random number to determine where to draw the loop
			var width = w * .6; 			//width to extend segments
			var height = w * .6;			//height to extend segments
			if(random < 1){ //draw on top
				this.sourceSegment.set(x1 + w * .8, y1 - height, lineThickness, height);
				this.middleSegment.set(x1 + w * .2, y1 - height, width, lineThickness);
				this.label.set(x1 + w * .2, y1 - height);
				this.finishSegment.set(x1 + w * .2, y1 - height, lineThickness, height);

				this.color = "#ffbf00";
			}
			else if(random < 2){ //draw on left
				this.sourceSegment.set(x1 - width, y1 + h * .2, width, lineThickness);
				this.middleSegment.set(x1 - width, y1 + h * .2, lineThickness, height);
				this.label.set(x1 - width, y1 + h * .2);
				this.finishSegment.set(x1 - width, y1 + h * .8, width, lineThickness);

				this.color = "#00ff3f";
			}
			else if(random < 3){ //draw on bottom
				this.sourceSegment.set(x1 + w * .2, y1 + h, lineThickness, height);
				this.middleSegment.set(x1 + w * .2, y1 + h + height, width, lineThickness);
				this.label.set(x1 + w * .8, y1 + h + height);
				this.finishSegment.set(x1 + w * .8, y1 + h, lineThickness, height);

				this.color = "#003fff";
			}
			else{ //draw on right
				this.sourceSegment.set(x1 + w, y1 + h * .8, width, lineThickness);
				this.middleSegment.set(x1 + w + width, y1 + h * .2, lineThickness, height);
				this.label.set(x1 + w + width, y1 + h * .2);
				this.finishSegment.set(x1 + w, y1 + h * .2, width, lineThickness);

				this.color = "#ff00bf";
			}
		}
		else if(dx > dy){ //(states are different, and x is larger distance): use left and right
			var width = dx - w;			//width to extend segments
			var height = dy;			//height to extend segments
			if(x1 > x2){				//start left, go to right
				this.sourceSegment.set(x1 - width * .4, y1 + h * .2, width * .4, lineThickness);
				if(y1 < y2){			//go down
					this.middleSegment.set(x1 - width * .4, y1 + h * .2, lineThickness, height);
					this.label.set(x1 - width * .4, y1 + h * .2 + height/2);
				}
				else{					//go up
					this.middleSegment.set(x1 - width * .4, y2 + h * .2, lineThickness, height);
					this.label.set(x1 - width * .4, y2 + h * .2 + height/2);
				}
				this.finishSegment.set(x2 + w, y2 + h * .2, width * .6, lineThickness);

				this.color = "#ff0000";
			}
			else{ //x1 <= x2		//start right, go to left
				this.sourceSegment.set(x1 + w, y1 + h * .8, width * .4, lineThickness);
				if(y1 < y2){		//go down
					this.middleSegment.set(x1 + w + width * .4, y1 + h * .8, lineThickness, height);
					this.label.set(x1 + w + width * .4, y1 + h * .8 + height/2);
				}
				else{				//go up
					this.middleSegment.set(x1 + w + width * .4, y2 + h * .8, lineThickness, height);
					this.label.set(x1 + w + width * .4, y2 + h * .8 + height/2);
				}
				this.finishSegment.set(x1 + w + width * .4, y2 + h * .8, width * .6, lineThickness);

				this.color = "#7fff00";
			}
		}
		else{ //use top and bottom
			var width = dx;		 //width to extend segments
			var height = dy - h; //height to extend segments
			if(y1 < y2){			//start top, go to bottom
				this.sourceSegment.set(x1 + w * .2, y1 + h, lineThickness, height * .4);
				if(x1 < x2){		//go left
					this.middleSegment.set(x1 + w * .2, y1 + h + height * .4, width, lineThickness);
					this.label.set(x1 + w * .2 + width/2, y1 + h + height * .4);
				}
				else{				//go right
					this.middleSegment.set(x2 + w * .2, y1 + h + height * .4, width, lineThickness);
					this.label.set(x2 + w * .2 + width/2, y1 + h + height * .4);
				}
				this.finishSegment.set(x2 + w * .2, y1 + h + height * .4, lineThickness, height*.6);

				this.color = "#00ffff";
			}
			else{				//start bottom, go to top
				this.sourceSegment.set(x1 + w * .8, y1 - height * .4, lineThickness, height * .4);
				if(x1 < x2){	//go left
					this.middleSegment.set(x1 + w * .8, y1 - height * .4, width, lineThickness);
					this.label.set(x1 + w * .8 + width/2, y1 - height * .4);
				}
				else{			//go right
					this.middleSegment.set(x2 + w * .8, y1 - height * .4, width, lineThickness);
					this.label.set(x2 + w * .8 + width/2, y1 - height * .4);
				}
				this.finishSegment.set(x2 + w * .8, y2 + h, lineThickness, height * .6);

				this.color = "#7f00ff";
			}
		}

		this.resetColor(); //resets color to new color based on transition type found above
	}

	/**
	 * function to change color of segments, and label
	 * used for highlighting a transition
	 *
	 * parameters:
	 * 		c: 		new color of segments
	 */
	this.changeColor = function(c){
		this.sourceSegment.changeColor(c);
		this.middleSegment.changeColor(c);
		this.finishSegment.changeColor(c);
		this.label.changeColor(c);
	}

	/**
	 * function to reset color
	 * reverts color back to color of transition type (found in repaint)
	 */
	this.resetColor = function(){
		this.changeColor(this.color);
	}

	/**
	 * function to remove transition
	 * removes all sub segments, and label
	 */
	this.remove = function(){
		this.sourceSegment.remove();
		this.middleSegment.remove();
		this.finishSegment.remove();
		this.label.remove();
	}

	//initialization
	this.repaint();
}

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

/**
 * Class for transition segments
 */
function Segment(id){
	this.id = id;	//id of the segment of the form "[TRANSITION ID]_[source|middle|finish]""

	//initialize html element, and hold information
	this.htmlElement = document.createElement("div");
	this.htmlElement.setAttribute("id", this.id);
	this.htmlElement.setAttribute("class", "segment");
	document.getElementById("mainCanvas").appendChild(this.htmlElement);

	/**
	 * function to change segment values
	 *
	 * parameters:
	 * 		x: 	x location of the segment
	 * 		y: 	y location of the segment
	 * 		w: 	width of the segment
	 * 		h: 	height of the segment
	 */
	this.set = function(x, y, w, h){
		this.htmlElement.style.left = x + "px";
		this.htmlElement.style.top = y + "px";
		this.htmlElement.style.width = w + "px";
		this.htmlElement.style.height = h + "px";
	}

	/**
	 * function to change color of segment
	 *
	 * parameters:
	 * 		c: 	new color for the segment
	 */
	this.changeColor = function(c){
		this.htmlElement.style.backgroundColor = c;
	}

	/**
	 * function to remove segment from html document
	 */
	this.remove = function(){
		this.htmlElement.parentNode.removeChild(this.htmlElement);
	}
}

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

/**
 * Class which represents the label on our transition
 */
function TransitionLabel(id, text){ 
	this.id = id;  		//id of the label in the form "[TRANSITION ID]_label" 
	this.text = text;	//text to display on the label
	
	//todo - setup tooltip and click functionality

	//add html element to ducment, and store it here
	this.htmlElement = document.createElement("div");
	this.htmlElement.setAttribute("id", this.id);
	this.htmlElement.setAttribute("class", "transition-label");
	this.htmlElement.innerHTML = text;
	document.getElementById("mainCanvas").appendChild(this.htmlElement);

	/** 
	 * function to change color of label
	 * changes both foreground (text) color as well as border color
	 *
	 * parameters: 
	 * 		c: 	new color for label
	 */
	this.changeColor = function(c){
		this.htmlElement.style.borderColor = c;
		this.htmlElement.style.color = c;
	}

	/**
	 * function to change position of label
	 *
	 * parameters:
	 * 		x: 	x location of label
	 * 		y:  y location of label
	 */
	this.set = function(x, y){
		this.htmlElement.style.left = x + "px";
		this.htmlElement.style.top = y + "px";
	}

	/**
	 * function to remove label from html document
	 */
	this.remove = function(){
		this.htmlElement.parentNode.removeChild(this.htmlElement);
	}
}