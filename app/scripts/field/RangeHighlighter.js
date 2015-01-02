/**
 * This file contains logic related to highlighting ranges on the grid in the 
 * Field screen.  These ranges help the player understand how far a unit can
 * move or attack.
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
		var gx, gy;
		for (var i=0; i<=moveRange; i++){
			for (var j=0; j<=i; j++){
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

		for (var i=1; i<=moveRange; i++){
			for (var j=0; j<=moveRange-i; j++){
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
