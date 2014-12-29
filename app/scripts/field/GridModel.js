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
			this.setTile(null, srcTile);		// Clear current space.
			this.setTile(piece, destTile);		// Move piece to dest.

			// piece.moveTo(destTile.x, destTile.y);
		}
	}
});
