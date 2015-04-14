function Machine(){
	this.states = new List(); 	//list of states
	this.startState = null;	 	//start state
	this.alphabet = new AlphabetList();	//alphabet

	/**
	 * function to add a state to the machine
	 * also sets added state to start state if it is currently null
	 *
	 * parameters:
	 * 		s: 	state to add to the machine
	 */
	this.addState = function(s){
		if(s != null){
			this.states.add(s);
			if(this.startState == null) this.startState = s;
		}
	}

	/**
	 * function to retrieve a state
	 *
	 * parameters:
	 * 		id: 	id of the state to retrieve
	 *
	 * return:
	 * 		state found via given id (if it exists)
	 */
	this.getState = function(id){
		for(var x = 0; x < this.states.size(); x++){
			if(this.states.get(x).id === id) return this.states.get(x);
		}
		return null;
	}

	/**
	 * function to remove a state from the machine
	 * 
	 * parameters:
	 * 	 	id: 	id of the state to remove
	 */
	this.removeState = function(id){
		var index = -1;
		for(var x = 0; x < this.states.size(); x++){
			this.removeTransition(this.states.get(x).id + "->" + id);
			if(this.states.get(x).id === id) index = x;
		}
		if(index > -1) this.states.remove(index);
		if(this.startState != null && this.startState.id === id) this.startState = null;
	}

	/**
	 * function to remove a transition from the machien
	 *
	 * parameters: 
	 * 		id: 	id of the transition to remove
	 */
	this.removeTransition = function(id){
		var s1 = id.substring(0, id.indexOf("->"));

		this.getState(s1).removeTransition(id);
	}

	/**
	 * function to get transition from the machine
	 *
	 * parameters:
	 * 		id: 	id of the transition to retrieve
	 */
	 this.getTransition = function(id){
	 	var s1 = id.substring(0, id.indexOf("->"));

	 	return this.getState(s1).getTransition(id);
	 }

	/**
	 * function to set new start state for the machine
	 *
	 * parameters:
	 *  	id: 	id of state to set as start (if it exists)
	 */
	this.setStart = function(id){
		var result = this.getState(id);
		if(result != null) this.startState = result;
	}

	/**
	 * function to validate the machine
	 *
	 * return
	 * 		whether or not the machine only has transitions on current alphabet
	 */
	this.validate = function(){
		var valid = this.startState != null;
		for(var x = 0; x < this.states.size(); x++){
			valid = valid && this.states.get(x).validate(this.alphabet);
		}
		return valid;
	}

	/**
	 * function to determine if given string is in machine's language
	 *
	 * parameters: 
	 * 		s: 	string to test
	 *
	 * return:
	 * 		whether or not the string is in the machine's language
	 */
	this.testString = function(s){
		if(this.validate()){
			var current = this.startState;
			for(var x = 0; (x < s.length && current != null); x++){
				var c = s.charAt(x);
				current = current.translate(c);
			}
			return current != null && current.isEnd();
		}
		else{
			alert("Invalid machine.");
			alert(this.toString());
			return false;
		}
	}

	/**
	 * function to get string representation of the machine
	 */
	this.toString = function(){
		var result = "Alphabet: " + this.alphabet.toString() + "\n";
		for(var x = 0; x < this.states.size(); x++){
			result += "\n" + x + ": ";
			if(this.startState == this.states.get(x)) result += "---(start)---";
			result += this.states.get(x).toString();
		}
		return result;
	}
}

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

function State(id, e){
	this.id = id; //state id
	this.end = e; //whether or not it is an accept state
	this.transitions = new List(); //list of transitions out of this state

	/**
	 * function to toggle state's acceptance
	 */
	this.toggleAccept = function(){
		this.end = !this.end;
	}

	/**
	 * function to add transition to the state
	 * will first remove any transitions with the same id
	 *
	 * parameters:
	 * 		t: 	transition to add
	 */
	this.addTransition = function(t){
		if(t != null){
			this.removeTransition(t.id);
			this.transitions.add(t);
		}
	}

	/**
	 * function to remove a transition
	 *
	 * parameters:
	 * 		id: 	id of transition to remove
	 */
	this.removeTransition = function(id){
		for(var x = 0; x < this.transitions.size(); x++){
			if(this.transitions.get(x).id === id) this.transitions.remove(x);
		}
	}

	/**
	 * function to get a transition
	 *
	 * parameters:
	 * 		id: 	id of transition to retrieve
	 */
	 this.getTransition = function(id){
	 	for(var x = 0; x < this.transitions.size(); x++){
	 		if(this.transitions.get(x).id === id) return this.transitions.get(x);
	 	}
	 }

	/**
	 * function to try to make a transition via the given character
	 *
	 * parameters: 
	 * 		c: 	character to attempt transition on
	 *
	 * return:
	 *  	null if no transition on given character
	 *      otherwise, the state we got to through that character
	 */
	this.translate = function(c){
		var result = null;

		var x = 0;
		while(result == null && x < this.transitions.size()){
			result = this.transitions.get(x).go(c);
			x++;
		}
		return result;
	}

	/**
	 * function to validate a state
	 * makes sure all transitions are only on alphabet's characters
	 *
	 * parameters:
	 * 		alphabet: 	alphabet to validate state on
	 */
	this.validate = function(alphabet){
		var valid = true;
		for(var x = 0; x < this.transitions.size(); x++){
			valid = valid && this.transitions.get(x).validate(alphabet);
		}
		return valid;
	}

	/**
	 * function to get acceptance of state
	 *
	 * return:
	 *  	whether or not this state is an accept state
	 */
	this.isEnd = function(){
		return this.end;
	}

	/**
	 * function to get string representation of this state
	 */
	this.toString = function(){
		var result = "\n    " + this.id + ": " + this.end;
		for(var x = 0; x < this.transitions.size(); x++){
			result += this.transitions.get(x).toString() + "\n";
		}
		return result;
	}
}

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

function Transition(id, n, cs){
	this.id = id;	//transition id
	this.next = n;	//next state
	this.characters = new AlphabetList(); //list of characters this transition is valid on

	//initialize characters
	for(var x = 0; x < cs.length; x++){
		this.characters.add(cs[x]);
	}

	/**
	 * function to get next state based on given character
	 *
	 * parameters:
	 * 		c: 		character to translate on
	 *
	 * return
	 * 		this.next if this transition is valid on given character
	 * 		null otherwise
	 */
	this.go = function(c){
		if(this.characters.has(c)) return this.next;
		return null;
	}

	/**
	 * gets the next state
	 */
	this.getNext = function(){
		return this.next;
	}

	/** 
	 * function to validate transition
	 * determines whether or not this transition only has characters in the machine's alhphabet
	 *
	 * parameters:
	 * 		alphabet: 	the machine's alphabet
	 *
	 * return:
	 * 		whether or not the transition is only valid on the machine's alphabet
	 */
	this.validate = function(alphabet){
		var valid = true;
		for(var x = 0; x < this.characters.size(); x++){
			valid = valid && alphabet.has(this.characters.get(x));
		}
		return valid;
	}

	/**
	 * function to get string representation of this transition
	 */
	this.toString = function(){
		var result = "\n        (" + this.id + "): " + this.characters.toString();
		return result;
	}
}