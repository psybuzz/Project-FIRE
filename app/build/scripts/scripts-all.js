/**
 * This file contains logic related to managing views, such as the intro screen,
 * menu, and in-game field views.
 */

/**
 * The view manager class is a presenter that handles loading and switching 
 * between different views.
 * 
 * @param {Object} options 	The configuration options.
 */
function ViewManager (options){
	options = options || {};
	this.currentView = null;

	// Initialize views.
	this.views = {};
	this.views[ViewManager.VIEWS.INTRO] = new IntroView({el: '#introContainer'});
	this.views[ViewManager.VIEWS.MENU] = new MenuView({el: '#menuContainer'});
	this.views[ViewManager.VIEWS.FIELD] = new FieldView({el: '#fieldContainer'});
}

/**
 * Loads a view into the current viewport.  This method depends on views 
 * that implement a view interface.
 * 
 * @param  {ViewManager.VIEWS} viewName 	The name of the view to load.
 */
ViewManager.prototype.loadView = function (viewName){
	var newView = this.views[viewName];
	var oldView = this.currentView;

	// Check if the view is valid.
	if (newView === oldView){
		return;
	} else if (!newView){
		console.error('Tried to load an unknown view: ' + viewName);
		return;
	}

	// Un-load the current view, if needed.
	if (oldView){
		oldView.leaveView(newView);
	}

	// Load the new view and update the state.
	newView.enterView(oldView);
	this.currentView = newView;
};


// Define enumerable values.
ViewManager.VIEWS = {
	INTRO: 'intro',
	MENU: 'menu',
	FIELD: 'field'
};

/**
 * This file contains character-related classes and logic, defining ally and 
 * enemy behavior.
 */

/**
 * An interface for all non-player characters, including allies and enemies.
 */
function NPC (){}
NPC.prototype.constructor = function (options){
	options = options || {};

	// Setup the character's PIXI piece.
	this.tileX = options.x;
	this.tileY = options.y;
	var cellW = options.cellWidth || 100;
	var cellH = options.cellHeight || 100;
	var x = this.tileX * cellW + (cellW/2);
	var y = this.tileY * cellH + (cellH/2);
	this.piece = new Circle(0, 0, options.color || 0x000000);
	this.piece.position.set(x, y);

	// Initialize default properties.
	this.name = Utils.randomName();
	this.moved = false;
	this.moveRange = Math.floor(Math.random()*3)+3;
	this.attackRange = Math.floor(Math.random()*2)+1;
};

function Ally (options){
	options.color = options.color || 0x21689B;
	NPC.prototype.constructor.call(this, options);
}

function Enemy (options){
	options.color = options.color || 0xa1000F;
	NPC.prototype.constructor.call(this, options);
}

// Inherit from NPC.
Ally.prototype = new NPC();
Enemy.prototype = new NPC();

/*global PIXI, app*/

function Cursor (options){
	options = options || {};

	var graphics = this.graphics = new PIXI.Graphics();
	
	// Draw a triangle using lines
	var colors = [0x000000, 0x333333, 0x1abc9c, 0x3498db, 0xf39c12, 
				0xecf0f1, 0x7f8c8d, 0x95a5a6, 0xffffff];
	graphics.beginFill(options.color || colors[2]);		// Cursor color.
	graphics.moveTo(10, 10);
	graphics.lineTo(10, 50);
	graphics.lineTo(50, 47);
	graphics.drawCircle(30,55,20);
	graphics.endFill();

	// The cursor's internal velocity.
	this.dx = 0;
	this.dy = 0;

	// The cursor's max velocity when moving.
	this.maxDx = 10;
	this.maxDy = 10;

	this.isFrozen = false;

	// Add an interactive area.
	graphics.hitArea = new PIXI.Circle(100,100,50);
	graphics.setInteractive(true);
	graphics.click = function(data){
		console.log('hit rect');
	};

	// Listen to keypress events from the keyboard module.
	_.extend(this, Backbone.Events);
	this.listenTo(Key, 'keydown', this.onKeyDown);
	this.listenTo(Key, 'keyup', this.onKeyUp);
}

Cursor.prototype.update = function(){
	if (!this.isFrozen){
		this.graphics.position.x += this.dx;
		this.graphics.position.y += this.dy;
	}
};

Cursor.prototype.onKeyDown = function(e){
	var newDx = this.maxDx;
	var newDy = this.maxDy;
	if (Key.matches(e.keyCode, ['LEFT', 'A'])){
		this.dx = -newDx;
	} else if (Key.matches(e.keyCode, ['UP', 'W'])){
		this.dy = -newDy;
	} else if (Key.matches(e.keyCode, ['RIGHT', 'D'])){
		this.dx = +newDx;
	} else if (Key.matches(e.keyCode, ['DOWN', 'S'])){
		this.dy = +newDy;
	}
};

Cursor.prototype.onKeyUp = function(e){
	var newDx = 0;
	var newDy = 0;
	if (Key.matches(e.keyCode, ['LEFT', 'A'])){
		this.dx = -newDx;
	} else if (Key.matches(e.keyCode, ['UP', 'W'])){
		this.dy = -newDy;
	} else if (Key.matches(e.keyCode, ['RIGHT', 'D'])){
		this.dx = +newDx;
	} else if (Key.matches(e.keyCode, ['DOWN', 'S'])){
		this.dy = +newDy;
	}
};

/**
 * This file contains grid logic.  The grid is simply a drawn graphic that
 * displays the representation of the board.  See board.js for the actual
 * internal representation of the tile board.
 */

/**
 * Makes a grid graphic with the specified dimensions.
 * 
 * @param {Number} rowN 	The number of rows.
 * @param {Number} colN 	The number of columns.
 * 
 * @return {PIXI.Graphics} 	The grid graphic.
 */
function Grid (rowN, colN, cellWidth, cellHeight){
	cellWidth = cellWidth || 100;
	cellHeight = cellHeight || 100;
	var cellPadding = 4;

	var gx, gy;
	var grid = new PIXI.Graphics();
	for (var i=0; i<colN; i++){
		for (var j=0; j<rowN; j++){
			gx = i*cellWidth;
			gy = j*cellHeight;

			// Normal grid.
			cellPadding = 12;
			grid.lineStyle(1, 0x7f8c8d, 1);
			grid.moveTo(gx + cellPadding, gy);
			grid.lineTo(gx + cellWidth - cellPadding, gy);
			grid.moveTo(gx, gy + cellPadding);
			grid.lineTo(gx, gy + cellHeight - cellPadding);
			

			// Corner grid.
			// var cellMargin = 1;
			// grid.moveTo(gx+cellMargin, gy+cellMargin);
			// grid.lineTo(gx+cellMargin, gy+cellMargin+cellPadding);
			// grid.moveTo(gx+cellMargin, gy+cellMargin);
			// grid.lineTo(gx+cellMargin+cellPadding, gy+cellMargin);

			// grid.moveTo(gx-cellMargin+cellWidth, gy+cellMargin);
			// grid.lineTo(gx-cellMargin+cellWidth, gy+cellMargin+cellPadding);
			// grid.moveTo(gx-cellMargin+cellWidth, gy+cellMargin);
			// grid.lineTo(gx-cellMargin+cellWidth-cellPadding, gy+cellMargin);

			// grid.moveTo(gx+cellMargin, gy-cellMargin+cellHeight);
			// grid.lineTo(gx+cellMargin, gy-cellMargin+cellHeight-cellPadding);
			// grid.moveTo(gx+cellMargin, gy-cellMargin+cellHeight);
			// grid.lineTo(gx+cellMargin+cellPadding, gy-cellMargin+cellHeight);

			// grid.moveTo(gx-cellMargin+cellWidth, gy-cellMargin+cellHeight);
			// grid.lineTo(gx-cellMargin+cellWidth, gy-cellMargin+cellHeight-cellPadding);
			// grid.moveTo(gx-cellMargin+cellWidth, gy-cellMargin+cellHeight);
			// grid.lineTo(gx-cellMargin+cellWidth-cellPadding, gy-cellMargin+cellHeight);
		

			// Diamond grid.
			// var cellPadding = 4;
			// grid.lineStyle(1, 0x000000, 1);
			// grid.moveTo(gx+cellPadding+1, gy-1);
			// grid.lineTo(gx, gy+cellPadding);

			// grid.moveTo(gx+cellWidth-cellPadding, gy);
			// grid.lineTo(gx+cellWidth, gy+cellPadding);

			// grid.moveTo(gx+cellPadding, gy+cellHeight);
			// grid.lineTo(gx, gy+cellHeight-cellPadding);

			// grid.moveTo(gx+cellWidth-cellPadding, gy+cellHeight);
			// grid.lineTo(gx+cellWidth, gy+cellHeight-cellPadding);
		

			// Filled Diamond grid.
			// var cellPadding = 3;
			// grid.lineStyle(0);
			// grid.beginFill(0x676767);
			// grid.moveTo(gx+cellPadding, gy);
			// grid.lineTo(gx, gy+cellPadding);
			// grid.lineTo(gx-cellPadding, gy);
			// grid.lineTo(gx, gy-cellPadding);
			// grid.lineTo(gx+cellPadding, gy);
			// grid.moveTo(gx, gy);
			// grid.endFill();


			// Filled square.
			// grid.lineStyle(0);
			// var r = Math.floor(Math.random()*20+127);
			// var g = Math.floor(Math.random()*20+127);
			// var b = Math.floor(Math.random()*-10+127);
			// var padding = 5;
			// grid.beginFill(Utils.rgbToHex(r,g,b));
			// grid.drawRect(gx+padding, gy+padding, cellWidth-padding, cellHeight-padding);
			// grid.endFill();
			
		}
	}

	return grid;
}

/**
 * Makes a corner-box graphic with the specified color.
 * 
 * @param {Color} color 	The color of the box.
 * 
 * @return {PIXI.Graphics} 	The box graphic.
 */
function CornerBox (color, w, h){
	if (typeof color === 'undefined') color = 0xbada55;
	var size = 20;
	var padding = 10;
	var length = 8;
	w = w || size;
	h = h || size;

	var box = new PIXI.Graphics();
	box.lineStyle(3, color, 1);
	box.moveTo(length+padding, padding);
	box.lineTo(padding, padding);
	box.lineTo(padding, length+padding);

	box.moveTo(w-length-padding, padding);
	box.lineTo(w-padding, padding);
	box.lineTo(w-padding, length+padding);

	box.moveTo(padding, h-length-padding);
	box.lineTo(padding, h-padding);
	box.lineTo(length+padding, h-padding);

	box.moveTo(w-length-padding, h-padding);
	box.lineTo(w-padding, h-padding);
	box.lineTo(w-padding, h-length-padding);

	return box;
}

/**
 * Makes a box graphic with the specified color.
 * 
 * @param {Color} color 	The color of the box.
 * 
 * @return {PIXI.Graphics} 	The box graphic.
 */
function Box (color, w, h){
	if (typeof color === 'undefined') color = 0xbada55;
	var size = 20;
	w = w || size;
	h = h || size;

	var box = new PIXI.Graphics();
	box.lineStyle(3, color, 1);
	box.moveTo(0, 0);
	box.drawRect(10, 10, 10+w, 10+h);

	return box;
}

/**
 * Makes a circle graphic with the specified options.
 * 
 * @param {Number} x     	The x position.
 * @param {Number} y     	The y position.
 * @param {Color} color 	The color of the circle.
 * 
 * @return {PIXI.Graphics} 	The circle graphic.
 */
function Circle (x, y, color, radius){
	if (typeof color === 'undefined') color = 0xa1000F;
	radius = radius || 10;

	var circle = new PIXI.Graphics();
	circle.beginFill(color);
	circle.drawCircle(x, y, radius);
	circle.endFill();

	return circle;
}

/**
 * This file contains logic related to the field view where the grid is located.
 * It also acts as a controller for the playing logic on the field, holding 
 * information related to whose turn it is, etc.
 *
 * FieldView depends on the GridView to render a grid and objects within it.
 * In this relationship, GridView creates and handles the PIXI stage while
 * FieldView controls higher level behaviors.
 */

var FieldView = Backbone.View.extend({
	turn: null,
	allies: [],
	enemies: [],

	initialize: function (options){
		options = options || {};
		this.chatView = new ChatView();
		this.battleView = new BattleView();
		this.gridView = new GridView();
		this.gridView.render();

		this.stage = this.gridView.stage;
		this.renderer = this.gridView.renderer;
		this.selectionManager = this.gridView.selectionManager;
		this.actionMenuView = new ActionMenuView({
			selectionManager: this.selectionManager
		});

		// Set the first turn to the player by default.
		this.turn = options.firstTurn || FieldView.TURN.PLAYER;
		this.addedPIXIView = false;

		// Bind repeated functions.
		this.animateBound_ = this.animate.bind(this);
	},

	render: function (){
		// Add the PIXI renderer to the page.
		if (!this.addedPIXIView){
			this.el.appendChild(this.renderer.view);
			this.addedPIXIView = true;
		}

		// Start animating.
		this.animateBound_();
	},

	enterView: function (lastView){
		this.render();
	},

	leaveView: function (newView){
		var x = new TWEEN.Tween(b)
				.to({blurX: 50}, 800)
				.start();
		x = new TWEEN.Tween(g.pixiContainer)
				.to({rotation: 0.3, alpha:0}, 800)
				.start();
	},

	completeTurn: function (){
		if (this.turn === FieldView.TURN.PLAYER){
			this.turn = FieldView.TURN.AI;
		} else if (this.turn === FieldView.TURN.AI){
			this.turn = FieldView.TURN.PLAYER;
		}
	},

	animate: function (){
		// Calculate timing.
		var time = Utils.now();
		var delta = time - this.lastTime;
		this.lastTime = time;

		// Update state.
		this.update(delta);
		TWEEN.update(time);

		// Render the stage and repeat the animation loop.
		this.renderer.render(this.stage);
		requestAnimationFrame(this.animateBound_);
	},

	update: function (delta){
		this.gridView.update(delta);
		this.selectionManager.update(delta);
	}
});


// Define enumerable values.
FieldView.TURN = {
	PLAYER: 'player',
	AI: 'ai'
};

/**
 *
 */

var IntroView = Backbone.View.extend({
	
});

/**
 *
 */

var MenuView = Backbone.View.extend({
	
});

/**
 * This file contains audio related logic to control sounds.
 */

/**
 * Audio module.
 */
var Audio = {
	audioTags: [
		document.getElementById('sound1'),
		document.getElementById('sound2')
	],

	dynamicTag: document.getElementById('dynamicSound'),

	/**
	 * Play a sound using a predefined audio tag.
	 * 
	 * @param  {Number} index  	The audio tag index.
	 * @param  {Number} volume 	The volume from 0 to 1.
	 */
	play: function (track, volume){
		if (typeof track === 'undefined'){
			console.error('Bad track: Tried to play a missing sound');
		}

		var tag = this.audioTags[track];
		if (volume) tag.volume = volume;
		tag.play();
	},

	playSrc: function (src, volume){
		this.dynamicTag.src = src;
		if (volume) this.dynamicTag.volume = volume;
		this.dynamicTag.oncanplay = function (){
			this.play();
		};
	}
};

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
		BACKSPACE: 8,
		ENTER: 13,
		SPACE: 32,
		ESC: 27,
		COMMA: 188,
		PERIOD: 190,
		SLASH: 191,
		L_SQ_BRACKET: 219,
		R_SQ_BRACKET: 221,
		NUM1: 49,
		NUM2: 50,
		NUM3: 51,
		NUM4: 52,
		NUM5: 53
	},

	isDown: function(keyCode){
		return this.pressed[keyCode];
	},

	anyDown: function(){
		var p = this.pressed;
		var map = this.keycodeMap;
		var keys = Object.keys(map);
		for (var i=0; i<keys.length; i++){
			if (p[map[keys[i]]] === true){
				return true;
			}
		}

		return false;
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

/**
 * This file contains logic related to linguistic functions such as generating 
 * names.
 */

var Names = {
       male: ["Jacob", "Mason", "Ethan", "Noah", "William", "Liam", "Jayden", "Michael", "Alexander", "Aiden"],
       female: ["Sophia", "Emma", "Isabella", "Olivia", "Ava", "Emily", "Abigail", "Mia", "Madison", "Elizabeth"],
       random: function(gender){
              gender = gender || (Math.random() > 0.5) ? 'male' : 'female';
              if (gender == 'male'){
                     return this.male[Math.floor(Math.random()*this.male.length)];
              } else {
                     return this.female[Math.floor(Math.random()*this.female.length)];
              }
       }
};

/**
 * This file defines several general-use, miscellaneous utility functions which
 * can be used in other script files.
 */

var Utils = {
	now: function (){
		return (performance && performance.now) ? performance.now() : Date.now();
	},

	randomRGB: function (){
		return {
			r: Math.floor(Math.random()*255),
			g: Math.floor(Math.random()*255),
			b: Math.floor(Math.random()*255)
		};
	},

	randomColor: function (){
		var r = Math.floor(Math.random()*255);
		var g = Math.floor(Math.random()*255);
		var b = Math.floor(Math.random()*255);

		return 'rgb('+r+','+g+','+b+')';
	},

	randomHex: function (){
		var color = this.randomRGB();

		return this.rgbToHex(color.r, color.g, color.b);
	},

	/**
	 * Converts RGB integers into Hex format.
	 */
	rgbToHex: function (r, g, b){
		var red = r.toString(16);
		var green = g.toString(16);
		var blue = b.toString(16);
		red = red == "0" ? "00" : red;
		green = green == "0" ? "00" : green;
		blue = blue == "0" ? "00" : blue;

		return parseInt(red+green+blue, 16);
	},

	randomName: function (){
		return Names.random();
	}
};

/**
 * This file contains logic regarding the behavior of the action menu that 
 * allows players to select an action on the field.  Options include actions 
 * such as attacking, healing, and more.
 */

var ActionMenuView = Backbone.View.extend({
	template: _.template($('#actionMenuTemplate').html()),

	el: '#actionMenuContainer',

	/**
	 * The current action set.
	 * @type {Number}
	 */
	actionSet: null,

	isOpen: false,

	initialize: function (options){
		options = options || {};
		this.actionSet = options.actionSet || 0;
		this.selectionManager = options.selectionManager;

		// Listen to Keyboard events when the menu is open.
		_.extend(this, Backbone.Events);
		this.listenTo(this.selectionManager, 'selection:target', this.onTargetSelected);
	},

	render: function (){
		if (this.isOpen) return;

		// Display the menu.
		var html = this.template({actionOptions: ActionSets[this.actionSet]});
		this.$el
				.hide()
				.html(html)
				.fadeIn();

		// Listen for keypresses.
		this.listenTo(Key, 'keyup', this.onKeyUp);

		this.isOpen = true;
	},

	close: function (){
		if (!this.isOpen) return;

		// Stop listening for keypresses.
		this.stopListening(Key, 'keyup');

		this.isOpen = false;
		this.$el.fadeOut();
	},

	/**
	 * Loads an action set given an index.
	 * 
	 * @param  {Number} index The index of the action set to load.
	 */
	loadActions: function (index){
		var set = ActionSets[index];
		if (!set) return;

		this.actionSet = index;
		this.render();
	},

	/**
	 * The callback when the player has just selected a target and needs to view
	 * the menu.
	 * 
	 * @param  {Object} tile The current tile data.
	 */
	onTargetSelected: function (tile){
		// TODO: Get the index from the passed-in event data.
		this.loadActions(0);
	},

	/**
	 * The callback when a key is pressed to navigate the action menu.
	 */
	onKeyUp: function (){
		if (Key.isPressed(['SPACE', 'ENTER'])){

		} else if (Key.isPressed(['UP'])){

		} else if (Key.isPressed(['DOWN'])){

		} else if (Key.isPressed(['LEFT'])){

		} else if (Key.isPressed(['RIGHT'])){

		}
	}
});


// TODO: Move these sets to a different file.
// Define sets of actions.
var ActionSets = [
	['Fire', 'Water', 'Wait', 'Cancel'],
	['Light', 'Water', 'Wait', 'Cancel'],
	['Heal', 'Light', 'Wait', 'Cancel']
];

/**
 *
 */

var BattleView = Backbone.View.extend({
	
});

/**
 *
 */

var ChatView = Backbone.View.extend({
	
});

/**
 * This file describes the internal representation of the grid that resides on
 * the FieldView.  It is essentially a 2D board.
 */

var GridModel = Backbone.Model.extend({
	initialize: function (options){
		options = options || {};
		this.rowN = options.rowN || 50;
		this.colN = options.colN || 100;

		// Construct a 2D array.
		var board = [];
		for (var i = 0; i < this.rowN; i++){
			var row = new Array(this.colN);
			board.push(row);
		}
		this.board = board;
	},

	setTile: function(obj, tileX, tileY){
		if (typeof tileY === 'undefined'){		// Use tileX as an object.
			tileY = tileX.y;
			tileX = tileX.x;
		}

		var oldValue = this.board[tileX][tileY];

		// Should overwrite anything underneath, telling it to destroy itself.
		//...
		this.board[tileX][tileY] = obj;

		return oldValue;
	},

	getTile: function(tileX, tileY) {
		if (typeof tileY === 'undefined'){		// Use tileX as an object.
			tileY = tileX.y;
			tileX = tileX.x;
		}

		// Check to see that the row is defined.
		if (!this.board[tileX]){
			return null;
		} else {
			return this.board[tileX][tileY];
		}
	},

	attemptMovement: function(srcTile, destTile){
		var piece = this.getTile(srcTile);
		if (piece instanceof Ally){
			if (GridModel.tileDistance(srcTile, destTile) <= piece.moveRange){
				this.setTile(null, srcTile);		// Clear current space.
				this.setTile(piece, destTile);		// Move piece to dest.

				piece.moved = true;
				// piece.moveTo(destTile.x, destTile.y);
		
				return true;
			}
		}

		return false;
	}
});

// Define static class methods.

/**
 * Computes the Manhattan distance between two tiles.
 * 
 * @param  {Object} srcTile  The first tile.
 * @param  {Object} destTile The second tile.
 * 
 * @return {Number}          The distance between the two tiles.
 */
GridModel.tileDistance = function (srcTile, destTile){
	var xDist = Math.abs(destTile.x - srcTile.x);
	var yDist = Math.abs(destTile.y - srcTile.y);

	return xDist+yDist;
};

/**
 * This file contains logic related to the visual representation of the grid on
 * the canvas.  It is not related to the GridWorld found in AP-Computer Science
 * courses.
 *
 * GridView is responsible for the creation of the PIXI stage and 
 * renderer, as well as drawing the grid cursor.  This class also exposes PIXI
 * objects and a SelectionManager to FieldView.
 */

var GridView = Backbone.View.extend({
	/**
	 * The grid model, representing the internal board state.
	 * @type {GridModel}
	 */
	gridModel: null,

	/**
	 * The PIXI stage and renderer.
	 * @type {PIXI.Stage, PIXI.Renderer}
	 */
	stage: null, renderer: null,

	/**
	 * The cursor for selecting tiles, selection manager for selection logic,
	 * and range highlighter for indicating movement/attack range.
	 * @type {Cursor, SelectionManager, RangeHighlighter}
	 */
	cursor: null, selectionManager: null, rangeHighlighter: null,

	/**
	 * The stage bounds.  When the cursor moves out of this region, the world 
	 * will automatically scroll to keep the cursor in view.
	 * @type {Object}
	 */
	stageBounds: {
		left: 50,
		right: window.innerWidth - 50,
		up: 50,
		down: window.innerHeight-4 - 50,
	},

	initialize: function (options){
		options = options || {};
		this.rowN = options.rowN || 50;
		this.colN = options.colN || 100;
		this.cellWidth = options.cellWidth || 70;
		this.cellHeight = options.cellHeight || 70;

		// Setup the PIXI Stage.
		var colors = [0x000000, 0x333333, 0x1abc9c, 0x3498db, 0xf39c12, 
				0xecf0f1, 0x7f8c8d, 0x95a5a6, 0xffffff, 0x808080];
		this.stage = new PIXI.Stage(colors[8]);
		this.pixiContainer = new PIXI.DisplayObjectContainer();
		this.stage.addChild(this.pixiContainer);

		// Setup the PIXI Renderer.
		var w = window.innerWidth, h = window.innerHeight-4;
		this.renderer = PIXI.autoDetectRenderer(w, h);
		window.onresize = this.onResize.bind(this);

		// Create a grid model.
		this.gridModel = new GridModel({rowN: this.rowN, colN: this.colN});
	},

	render: function (){
		// Create drawable graphics.
		this.grid = new Grid(this.rowN, this.colN, this.cellWidth, this.cellHeight);
		this.pixiContainer.addChild(this.grid);

		this.cursor = new Cursor();
		this.selectionManager = new SelectionManager({gridView: this});
		this.rangeHighlighter = new RangeHighlighter({gridView: this});
		this.addCharacters();
	},

	addCharacters: function (){
		// Make NPC's.
		var allyN = 3, enemyN = 10;
		var allies = [], enemies = [];
		for (i = 0; i < allyN; i++){
			var ally = new Ally({
				x: Math.floor(Math.random() * 5),
				y: Math.floor(Math.random() * 5),
				cellWidth: this.cellWidth,
				cellHeight: this.cellHeight
			});
			allies.push(ally);
			this.pixiContainer.addChild(ally.piece);
			this.gridModel.setTile(ally, ally.tileX, ally.tileY);
		}
		for (i = 0; i < enemyN; i++){
			var enemy = new Enemy({
				x: Math.floor(Math.random() * 10 + 5),
				y: Math.floor(Math.random() * 10 + 5),
				cellWidth: this.cellWidth,
				cellHeight: this.cellHeight
			});
			enemies.push(enemy);
			this.pixiContainer.addChild(enemy.piece);
			this.gridModel.setTile(enemy, enemy.tileX, enemy.tileY);
		}
	},

	movePiece: function (srcTile, destTile){
		var stagePosition = this.selectionManager.getPositionFromTile(destTile);
		var character = this.gridModel.getTile(srcTile);

		if (character){
			var piece = character.piece;

			// Jump to.
			// this.piece.position.set(stagePosition.x, stagePosition.y);

			// First check that the gridmodel accepts the movment before actual
			// animation.
			// 
			// Only overwrite destination if the source is non-empty.
			var canMove = this.gridModel.attemptMovement(srcTile, destTile);
			
			if (canMove){
				// Animate.
				var destX = stagePosition.x;
				var destY = stagePosition.y;
				var currX = piece.position.x;
				var currY = piece.position.y;
				var dist = (destX-currX)*(destX-currX) + (destY-currY)*(destY-currY);
				var duration = dist / 256;
				var self = this;
				var tween = new TWEEN.Tween(piece.position)
						.to({x: destX, y: destY}, duration)
						.start();
			}
		}
	},

	attackPiece: function (srcTile, destTile){
		
	},

	update: function (delta){
		this.cursor.update(delta);
		this.updateStageBounds(delta);
	},

	updateStageBounds: function (){
		if (Key.anyDown() === true){
			if (this.cursor.graphics.getBounds().x < this.stageBounds.left){
				this.stage.worldTransform.tx += 20;
			}
			if (this.cursor.graphics.getBounds().x > this.stageBounds.right){
				this.stage.worldTransform.tx -= 20;
			}
			if (this.cursor.graphics.getBounds().y < this.stageBounds.up){
				this.stage.worldTransform.ty += 20;
			}
			if (this.cursor.graphics.getBounds().y > this.stageBounds.down){
				this.stage.worldTransform.ty -= 20;
			}
		}
	},

	onResize: function (){
		this.renderer.resize(window.innerWidth, window.innerHeight);
	}
});

/**
 * This file contains logic related to highlighting ranges on the grid in the 
 * Field screen.  These ranges help the player understand how far a unit can
 * move or attack.
 *
 * RangeHighlighter depends on a SelectionManager to provide it events.
 */

function RangeHighlighter (options){
	options = options || {};
	this.gridView = options.gridView;
	this.gridModel = this.gridView.gridModel;
	this.cellWidth = this.gridView.cellWidth;
	this.cellHeight = this.gridView.cellHeight;

	this.overlay = new PIXI.Graphics();
	this.gridView.pixiContainer.addChild(this.overlay);

	// Subscribe to events.
	_.extend(this, Backbone.Events);

	var selectionManager = this.gridView.selectionManager;
	this.listenTo(selectionManager, 'selection:start', this.onSelectionStart);
	this.listenTo(selectionManager, 'selection:end', this.onSelectionEnd);
	this.listenTo(selectionManager, 'selection:target', this.onSelectionTarget);
	this.listenTo(selectionManager, 'selection:reset', this.onSelectionReset);
}

_.extend(RangeHighlighter.prototype, {
	onSelectionStart: function (tile){
		this.overlay.clear();

		var character = this.gridModel.getTile(tile);
		if (!character) return;

		this.highlight(character, tile);
	},

	onSelectionEnd: function (tile){

	},

	onSelectionTarget: function (tile){
		this.overlay.clear();
	},

	onSelectionReset: function (tile){
		this.overlay.clear();
	},

	highlight: function (character, tile){
		var moveRange = character.moveRange;
		var attackRange = character.attackRange;

		this.buildOverlay(tile, moveRange, attackRange);
	},

	cleanOverlay: function (){
		this.overlay.clear();
	},

	buildOverlay: function (tile, moveRange, attackRange){
		var padding = 5;
		var opacity = 0.5;
		var cellWidth = this.cellWidth, cellHeight = this.cellHeight;
		var overlay = this.overlay;
		overlay.clear();
		overlay.lineStyle(0);
		// var fillColor = Utils.randomHex();
		var fillColor = 0x000000;
		
		console.log(tile, moveRange, attackRange);

		// Build from left to center, then center to right.
		var gx, gy, i, j;
		for (i=0; i<=moveRange; i++){
			for (j=0; j<=i; j++){
				// Lower half.
				gx = (tile.x+i-moveRange)*cellWidth;
				gy = (tile.y+j)*cellHeight;

				overlay.beginFill(fillColor, opacity);
				overlay.drawRect(
						gx+padding,
						gy+padding,
						cellWidth-2*padding,
						cellHeight-2*padding);
				overlay.endFill();

				// Upper half.
				if (j !== 0){
					gx = (tile.x+i-moveRange)*cellWidth;
					gy = (tile.y-j)*cellHeight;

					overlay.beginFill(fillColor, opacity);
					overlay.drawRect(
							gx+padding,
							gy+padding,
							cellWidth-2*padding,
							cellHeight-2*padding);
					overlay.endFill();
				}
			}
		}

		for (i=1; i<=moveRange; i++){
			for (j=0; j<=moveRange-i; j++){
				// Lower half.
				gx = (tile.x+i)*cellWidth;
				gy = (tile.y+j)*cellHeight;

				overlay.beginFill(fillColor, opacity);
				overlay.drawRect(
						gx+padding,
						gy+padding,
						cellWidth-2*padding,
						cellHeight-2*padding);
				overlay.endFill();

				// Upper half.
				if (j !== 0){
					gx = (tile.x+i)*cellWidth;
					gy = (tile.y-j)*cellHeight;

					overlay.beginFill(fillColor, opacity);
					overlay.drawRect(
							gx+padding,
							gy+padding,
							cellWidth-2*padding,
							cellHeight-2*padding);
					overlay.endFill();
				}
			}
		}
	}
});

/**
 * This file contains logic to manage selections on the grid of the FieldView.
 */

function SelectionManager (options){
	options = options || {};
	this.gridView = options.gridView;
	this.gridModel = this.gridView.gridModel;
	this.cursor = this.gridView.cursor;
	this.cellWidth = this.gridView.cellWidth;
	this.cellHeight = this.gridView.cellHeight;
	this.setupSelectionGraphics(this.gridView.pixiContainer);

	this.topMenu = document.getElementById('topMenu');

	// Keep tile state.
	this.currentTile = this.gridModel.getTile(0, 0);
	this.selectedStartTile = null;
	this.selectedEndTile = null;
	this.selectedTargetTile = null;

	// Set the selection mode to NONE by default.
	this.selectMode = SelectionManager.MODE.NONE;

	_.extend(this, Backbone.Events);
	this.listenTo(Key, 'keyup', this.onKeyUp);
	this.updatePathDebounced = _.debounce(this.updatePath, 10);
}

_.extend(SelectionManager.prototype, {
	/**
	 * Setup drawable graphics for the Selection Manager to use.
	 */
	setupSelectionGraphics: function (pixiContainer){
		this.selectBox = new Box(0xbada55, this.cellWidth - 30, this.cellHeight - 30);
		this.startBox = new Box(0x008cff, this.cellWidth - 30, this.cellHeight - 30);
		this.endBox = new Box(0xff6600, this.cellWidth - 30, this.cellHeight - 30);
		this.targetBox = new Box(0xff0100, this.cellWidth - 30, this.cellHeight - 30);
		this.path = new PIXI.Graphics();
		this.path.lineStyle(2, 0xffffff, 1);

		pixiContainer.addChild(this.cursor.graphics);
		pixiContainer.addChild(this.selectBox);
		pixiContainer.addChild(this.startBox);
		pixiContainer.addChild(this.endBox);
		pixiContainer.addChild(this.targetBox);
		pixiContainer.addChild(this.path);
	},

	onKeyUp: function(e){
		if (Key.matches(e.keyCode, ['ENTER', 'SPACE'])){
			if (this.selectMode === SelectionManager.MODE.NONE){
				this.setStart();
			} else if (this.selectMode === SelectionManager.MODE.STARTED){
				this.setEnd();
			} else if (this.selectMode === SelectionManager.MODE.TARGET){
				this.setTarget();
			}
		} else if (Key.matches(e.keyCode, ['SLASH'])){
				this.resetSelection();
		}	
	},

	update: function (){
		// Update the cursor's selection box.
		this.updateSelectBox();

		// Update the path if we are in the STARTED mode.
		if (this.selectMode === SelectionManager.MODE.STARTED){
			this.updatePathDebounced();
		}
	},

	updateSelectBox: function(){
		// Update the position of the selectBox.
		var snappedPosition = this.getGridSnapPosition(this.cursor.graphics.position);
		this.selectBox.position.x = snappedPosition.x;
		this.selectBox.position.y = snappedPosition.y;
		this.currentTile = this.getCurrentTile();

		var character = this.gridView.gridModel.getTile(this.currentTile);
		if (character){
			// Play a sound if we are hovering over a character.
			if (this.topMenu.classList.contains('hide')){
				Audio.play(0, 0.1);
			}

			// Update the text.
			this.topMenu.innerText = character.name;

			this.topMenu.classList.remove('hide');
		} else {
			this.topMenu.classList.add('hide');
		}
	},

	setStart: function (){
		this.clearPath();

		// Return if the current tile has no piece.
		var currentTile = this.getCurrentTile();
		var selectBox = this.selectBox;
		if (this.gridModel.getTile(currentTile)){
			this.startBox.position.set(selectBox.position.x, selectBox.position.y);
			this.selectedStartTile = currentTile;
			this.selectMode = SelectionManager.MODE.STARTED;
		}

		// Signal this event to subscribers.
		this.trigger('selection:start', currentTile);
	},

	setEnd: function (){
		var selectBox = this.selectBox;
		var currentTile = this.getCurrentTile();
		var startTile = this.selectedStartTile;
		var startCharacter = startTile && this.gridModel.getTile(startTile);
		var moveRange = startCharacter && startCharacter.moveRange;
		var tileDist = GridModel.tileDistance(startTile, currentTile);
		this.selectedEndTile = currentTile;

		// Trigger an End event only when we choose an end within the selected
		// character's movement range.
		if (moveRange && tileDist <= moveRange){
			this.endBox.position.set(selectBox.position.x, selectBox.position.y);
			this.gridView.movePiece(startTile, currentTile);
			this.selectMode = SelectionManager.MODE.TARGET;
			
			// Signal this event to subscribers.
			this.trigger('selection:end', currentTile);
			Audio.play(1, 0.3);
		} else {
			// If we tried to move outside the range, reset selection.
			this.resetSelection();
		}

	},

	setTarget: function (){
		var selectBox = this.selectBox;
		var currentTile = this.getCurrentTile();
		this.selectedTargetTile = currentTile;

		// TODO: If the target is the same as the destination, the player likely
		// just wants to stop the unit there.  We should check that the tiles' 
		// coordinates are the same, and move without attacking.
		if (this.selectedEndTile === this.selectedTargetTile){

		}

		this.targetBox.position.set(selectBox.position.x, selectBox.position.y);
		this.gridView.attackPiece(this.selectedStartTile, currentTile);
		this.selectMode = SelectionManager.MODE.ACTION;

		// Freeze the cursor, since the action menu will open.
		this.cursor.isFrozen = true;		

		// Signal this event to subscribers.
		this.trigger('selection:target', currentTile);
		Audio.playSrc('sounds/click3.wav', 0.3);
	},

	setAction: function (){
		this.selectMode = SelectionManager.MODE.NONE;

		// Unfreeze the cursor.
		this.cursor.isFrozen = false;

		// Signal this event to subscribers.
		this.trigger('selection:action', currentTile);
		Audio.playSrc('sounds/click3.wav', 0.3);
	},

	// The event when the player cancels selection by selecting an out-of-range
	// tile.
	resetSelection: function (){
		var selectBox = this.selectBox;
		var currentTile = this.getCurrentTile();

		this.targetBox.position.set(selectBox.position.x, selectBox.position.y);
		this.selectMode = SelectionManager.MODE.NONE;

		this.clearPath();

		// Signal this event to subscribers.
		this.trigger('selection:reset', currentTile);
	},

	updatePath: function(){
		if (this.selectMode == SelectionManager.MODE.STARTED){
			var pathPoints = this.pathPoints;
			var path = this.path;
			var currPos = this.getGridSnapPosition(this.selectBox.position);
			if (JSON.stringify(pathPoints[pathPoints.length - 1]) !==
					JSON.stringify(currPos)){
				pathPoints.push(currPos);

				// Eliminate cycles.

				// Redraw only when changing path.
				var offset = this.cellWidth / 2;
				path.clear();
				path.lineStyle(5, 0x4C4C4C, 1);
				path.moveTo(pathPoints[0].x+offset, pathPoints[0].y+offset);
				for (var i = 1; i < this.pathPoints.length; i++) {
					var nextPt = pathPoints[i];
					path.lineTo(nextPt.x+offset, nextPt.y+offset);
				}
			}
		}
	},

	clearPath: function (){
		this.pathPoints = [];
		this.path.clear();
	},

	getCurrentTile: function (){
		return this.getTileFromPosition(this.cursor.graphics.position);
	},

	getGridSnapPosition: function (position){
		return {
			x: this.cellWidth * Math.floor(position.x / this.cellWidth),
			y: this.cellHeight * Math.floor(position.y / this.cellHeight)
		};
	},
	
	getTileFromPosition: function (position){
		return {
			x: Math.floor(position.x / this.cellWidth),
			y: Math.floor(position.y / this.cellHeight)
		};
	},

	// Gets the stage position from the tile indices
	getPositionFromTile: function (tileX, tileY){
		if (typeof tileY === 'undefined'){
			tileY = tileX.y;
			tileX = tileX.x;
		}

		return {
			x: this.cellWidth * tileX + (this.cellWidth/2),
			y: this.cellHeight * tileY + (this.cellHeight/2)
		};
	}
});


// Define enumerable values.
SelectionManager.MODE = {
	NONE: 0,
	STARTED: 1,
	TARGET: 2,
	ACTION: 3
};

/**
 * This file contains the main entry point for the application.  It is intended
 * to be very lightweight.
 */

/**
 * The core class that controls the entire game.
 * 
 * @param {Object} options The configuration options.
 */
var Application = function (options){
	_.extend(this, Backbone.Events, options);
	this.isPaused = false;
};

_.extend(Application.prototype, {
	/**
	 * Starts the game.  This function should only be called once.
	 */
	start: function(){
		this.viewManager = new ViewManager();
		this.viewManager.loadView(ViewManager.VIEWS.FIELD);

		this.isPaused = false;
	},

	/**
	 * Pauses the game.  This also triggers an alert for other classes that execute
	 * special logic when the game is paused.
	 */
	pause: function(){
		if (!this.isPaused) this.trigger('pause');
		this.isPaused = true;
	},

	/**
	 * Resumes the game.  This also triggers an alert for other classes that execute
	 * special logic when the game is resumed.
	 */
	resume: function(){
		if (this.isPaused) this.trigger('resume');
		this.isPaused = false;
	},
});


// Start the game itself, unless this is the testing environment.
if (window.environment !== 'TESTING'){
	var game = new Application();
	game.start();
}
