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
		}
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
}
