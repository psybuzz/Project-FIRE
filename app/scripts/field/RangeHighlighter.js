/**
 * This file contains logic related to highlighting ranges on the grid in the 
 * Field screen.  These ranges help the player understand how far a unit can
 * move or attack.
 */

function RangeHighlighter (options){
	options = options || {};
	this.gridView = options.gridView;
	this.cellWidth = this.gridView.cellWidth;
	this.cellHeight = this.gridView.cellHeight;

	this.overlay = new PIXI.Graphics();
	this.gridView.pixiContainer.addChild(this.overlay);
}

_.extend(RangeHighlighter.prototype, {
	highlight: function (character, tile){
		var moveRange = character.moveRange;
		var attackRange = character.attackRange;

		this.buildOverlay(tile, moveRange, attackRange);
	},

	buildOverlay: function (tile, moveRange, attackRange){
		var padding = 5;
		var opacity = 0.5;
		var cellWidth = this.cellWidth, cellHeight = this.cellHeight;
		var overlay = this.overlay;
		overlay.clear();
		overlay.lineStyle(0);
		var fillColor = Utils.randomHex();
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
