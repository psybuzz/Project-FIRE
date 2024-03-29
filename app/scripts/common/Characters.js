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
