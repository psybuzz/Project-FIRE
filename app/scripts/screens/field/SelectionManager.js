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
