/**
 * This file contains logic for input control.  For example, a Keyboard module
 * controls behavior related to keypresses.
 *
 * Sources
 * Keyboard Input helper
 * - http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
 */

/**
 * Keyboard module.
 */
var Key = {
	pressed: {},

	keycodeMap: {
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		W: 87,
		A: 65,
		S: 83,
		D: 68,
		ENTER: 13,
		SPACE: 32
	},

	isDown: function(keyCode){
		return this.pressed[keyCode];
	},

	anyDown: function(){
		var p = this.pressed;
		var map = this.keycodeMap;
		return p[map['LEFT']] ||
				p[map['UP']] ||
				p[map['DOWN']] ||
				p[map['RIGHT']] ||
				p[map['W']] ||
				p[map['A']] ||
				p[map['S']] ||
				p[map['D']];
	},

	onKeyDown: function(e){
		this.pressed[e.keyCode] = true;
		Key.trigger('keydown', e);
	},

	onKeyUp: function(e){
		this.pressed[e.keyCode] = undefined;
		Key.trigger('keyup', e);
	},

	matches: function (keyCode, keys){
		for (var i=0; i<keys.length; i++){
			var key = keys[i];

			// Check if the key matches.
			if (keyCode === this.keycodeMap[key]){
				return true;
			}
		}

		// Return false if there is no match.
		return false;
	},

	isPressed: function (keys){
		for (var i=0; i<keys.length; i++){
			var key = keys[i];

			// Check if the key is valid.
			if (!this.keycodeMap[key]){
				console.error('Key not found');
				return;
			}

			// Return true if the key is pressed.
			if (this.pressed[this.keycodeMap[key]] === true){
				return true;
			}
		}

		// Return false by default if none of the keys were pressed.
		return false;
	}
};


// Use Backbone's Event system for pub/sub.
_.extend(Key, Backbone.Events);

// Bind keypress events.
document.body.onkeydown = function (e){
	Key.onKeyDown(e);
};

document.body.onkeyup = function(e){
	Key.onKeyUp(e);
};
