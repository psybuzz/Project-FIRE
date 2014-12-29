/**
 * This file contains logic related to mock objects used for testing.
 */

/**
 * General mock utility object.
 */
var Mocks = {
	/**
	 * A table mapping function names to the number of times it was called. 
	 * This only applies to mock functions.
	 * 
	 * @type {Object}
	 */
	callCounts: {},

	/**
	 * Sets up mock functions with the provided names.
	 * 
	 * @param  {Array.String} fnNames 	The names of functions to be mocked.
	 */
	mockFunctions: function (fnNames){
		for (var i=0; i<fnNames.length; i++){
			var name = fnNames[i];
			window[name] = window[name] || (function (n){
				return function (){
					Mocks.callCounts[n] = Mocks.callCounts[n] || 0;
					Mocks.callCounts[n]++;
				}
			})(name);
		}
	},
};
