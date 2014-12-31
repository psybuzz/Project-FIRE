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
	 * The PIXI stage.
	 * @type {PIXI.Stage}
	 */
	stage: null,

	/**
	 * This PIXI renderer.
	 * @type {PIXI.Renderer}
	 */
	renderer: null,

	cursor: null,

	animQueue: [],
	lastTime: Utils.now(),

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
		this.stage = new PIXI.Stage(colors[9]);
		this.pixiContainer = new PIXI.DisplayObjectContainer();
		this.stage.addChild(this.pixiContainer);

		// Setup the PIXI Renderer.
		var w = window.innerWidth, h = window.innerHeight-4;
		this.renderer = PIXI.autoDetectRenderer(w, h);
		this.el = this.renderer.view;
		window.onresize = this.onResize.bind(this);

		// Create a grid model.
		this.gridModel = new GridModel({rowN: this.rowN, colN: this.colN});

		// Render graphics to the grid.
		this.render();
		this.rangeHighlighter = new RangeHighlighter({gridView: this});
		this.cursor = new Cursor();
		this.selectionManager = new SelectionManager({gridView: this});
		this.addCharacters();
	},

	render: function (){
		// Create drawable graphics.
		this.grid = new Grid(this.rowN, this.colN, this.cellWidth, this.cellHeight);
		this.pixiContainer.addChild(this.grid);
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
				this.animQueue.push({
					piece: piece,
					destX: stagePosition.x,
					destY: stagePosition.y,
					dx: (stagePosition.x - piece.position.x) / 300,
					dy: (stagePosition.y - piece.position.y) / 300,
					right: stagePosition.x > piece.position.x,
					down: stagePosition.y > piece.position.y,
				});
			}
		}
	},

	attackPiece: function (srcTile, destTile){
		
	},

	showCharacterRange: function (currentTile){
		var character = this.gridModel.getTile(currentTile);
		if (!character) return;

		this.rangeHighlighter.highlight(character, currentTile);
	},

	update: function (delta){
		this.cursor.update(delta);
		this.updateStageBounds(delta);
		this.processAnimationQueue(delta);
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

	processAnimationQueue: function (delta){
		// Process animation queue.
		for (var i = 0; i<this.animQueue.length;i++){
			var anim = this.animQueue[i];
			var piece = anim.piece;
			piece.position.x += (anim.dx * delta);
			piece.position.y += (anim.dy * delta);

			var toDestX = anim.destX - piece.position.x;
			var toDestY = anim.destY - piece.position.y;
			var moveTargetDotProduct = anim.dx * toDestX + anim.dy * toDestY;

			if (moveTargetDotProduct < 0){
				// Remove from queue if done, and update index.
				this.animQueue.splice(i, 1);
				piece.position.x = anim.destX;
				piece.position.y = anim.destY;

				i--;
			}
		}
	},

	onResize: function (){
		this.renderer.resize(window.innerWidth, window.innerHeight);
	}
});
