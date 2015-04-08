function List(){
	this.length = 0; //length of the list
	this.array = [];

	/**
	 * function to add element to list
	 *
	 * parameters:
	 * 		element: 	element to be added to list
	 */
	this.add = function(element){
		this.array.push(element);
		this.length++;
	}

	/**
	 * function to get element at from a certain index
	 *
	 * parameters:
	 * 		index: 	index of element to get
	 *
	 * return:
	 * 		element at given index (null if index isn't within bounds)
	 */
	this.get = function(index){
		if(index < 0 || index >= this.length) return null;
		return this.array[index];
	}

	/**
	 * function to get size of this list
	 *
	 * return:
	 * 		size of list
	 */
	this.size = function(){
		return this.length;
	}

	/**
	 * function to remove an element from the list
	 *
	 * parameters:
	 * 		index: 	index of element to remove
	 *
	 * return:
	 * 		element that was remove
	 */
	this.remove = function(index){
		if(index < 0 || index >= this.length) return null;
		if(index == this.length - 1){
			this.length--;
			return this.array.pop();
		}

		var element = this.array[index];
		for(var i = index; i < this.length - 1; i++){
			this.array[i] = this.array[i+1];
		}
		this.array.pop();
		this.length--;
		return element;
	}
}

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

function AlphabetList(){
	this.list = new List(); //list

	/**
	 * function to add characters to the list
	 * if it already has a given character, it will not add a duplicate
	 *
	 * parameters:
	 * 		c: 	character to add to the list
	 */
	this.add = function(c){
		if(!this.has(c)) this.list.add(c);
	}

	/**
	 * function to determine if the AlphabetList has a given character
	 *
	 * parameters:
	 *  	c: 	character to check
	 *
	 * return:
	 * 		whether or not c is in this list
	 */
	this.has = function(c){
		for(var x = 0; x < this.list.size(); x++){
			if(this.list.get(x) == c) return true;
		}
		return false;
	}

	/**
	 * function to get the size of this list
	 *
	 * return:
	 * 		size of the AlphabetList
	 */
	this.size = function(){
		return this.list.size();
	}

	/**
	 * function to get element at given index
	 *
	 * parameters: 
	 * 		index: 	index of element to retrieve
	 *
	 * return:
	 * 		element at the given index
	 */
	this.get = function(index){
		return this.list.get(index);
	}

	/**
	 * function to get string representation of this object
	 * Gives string such that each character is given within brackets, followed by ", "
	 *
	 * return:
	 * 		string representation of this object
	 */
	this.toString = function(){
		var result = "";
		for(var x = 0; x < this.list.size() - 1; x++){
			result += this.list.get(x) + ", ";
		}
		if(this.list.size() > 0) result += this.list.get(this.list.size() - 1);
		return "[" + result + "]";
	}
}