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
			var cellPadding = 12;
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
			grid.lineStyle(0);
			var r = Math.floor(Math.random()*5+127);
			var g = Math.floor(Math.random()*5+127);
			var b = Math.floor(Math.random()*5+127);
			grid.beginFill(Utils.rgbToHex(r,g,b));
			grid.moveTo(gx, gy);
			grid.lineTo(gx+cellWidth, gy);
			grid.lineTo(gx+cellWidth, gy+cellHeight);
			grid.lineTo(gx, gy+cellHeight);
			grid.endFill();
			
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
