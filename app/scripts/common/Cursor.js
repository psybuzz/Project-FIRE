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
