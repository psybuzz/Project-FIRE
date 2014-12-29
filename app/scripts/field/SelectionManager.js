/**
 * This file contains logic to manage selections on the grid of the FieldView.
 */

function SelectionManager (options){
	options = options || {};
	this.gridView = options.gridView;
	this.gridModel = this.gridView.gridModel;
	this.cursor = this.gridView.cursor;
	this.selectBox = this.gridView.selectBox;
	this.startBox = this.gridView.startBox;
	this.endBox = this.gridView.endBox;
	this.path = this.gridView.path;
	this.cellWidth = this.gridView.cellWidth;
	this.cellHeight = this.gridView.cellHeight;

	this.topMenu = document.getElementById('topMenu');

	// Keep tile state.
	this.currentTile = this.gridModel.getTile(0, 0);

	// Set the selection mode to NONE by default.
	this.selectMode = SelectionManager.MODE.NONE;

	_.extend(this, Backbone.Events);
	this.listenTo(Key, 'keyup', this.onKeyUp);
	this.updatePathDebounced = _.debounce(this.updatePath, 10);
}

_.extend(SelectionManager.prototype, {
	onKeyUp: function(e){
		if (Key.matches(e.keyCode, ['ENTER', 'SPACE'])){
			if (this.selectMode === SelectionManager.MODE.STARTED){
				this.setEnd();
			} else {
				this.setStart();
			}
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

	setStart: function(){
		var selectBox = this.selectBox;
		this.selectedTile = this.getTileFromPosition(selectBox.position);
		
		// Return if the current tile has no piece.
		if (!this.gridModel.getTile(this.selectedTile)){
			return;
		}

		var startBox = this.startBox;
		this.pathPoints = [];
		this.path.clear();

		startBox.position.set(selectBox.position.x, selectBox.position.y);
		this.selectMode = SelectionManager.MODE.STARTED;
	},

	setEnd: function(){
		var endBox = this.endBox;
		var selectBox = this.selectBox;

		endBox.position.set(selectBox.position.x, selectBox.position.y);
		this.selectMode = SelectionManager.MODE.ENDED;
		
		var currentTile = this.getCurrentTile();
		this.gridView.movePiece(this.selectedTile, currentTile);
		
		// Audio.playJourney(11, 2);
		Audio.play(1, 0.3);
	},

	updatePath: function(){
		if (this.selectMode == SelectionManager.MODE.STARTED){
			// this.updateSelectBox();

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

	getCurrentTile: function (){
		return this.getTileFromPosition(this.cursor.graphics.position);
	},

	getGridSnapPosition: function (position){
		return {
			x: this.cellWidth * Math.floor(position.x / this.cellWidth),
			y: this.cellHeight * Math.floor(position.y / this.cellHeight)
		}
	},
	
	getTileFromPosition: function (position){
		return {
			x: Math.floor(position.x / this.cellWidth),
			y: Math.floor(position.y / this.cellHeight)
		}
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
		}
	}
});


// Define enumerable values.
SelectionManager.MODE = {
	NONE: 0,
	STARTED: 1,
	TARGET: 2
};
