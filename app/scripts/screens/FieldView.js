/**
 * This file contains logic related to the field view where the grid is located.
 * It also acts as a controller for the playing logic on the field, holding 
 * information related to whose turn it is, etc.
 *
 * FieldView depends on the GridView to render a grid and objects within it.
 * In this relationship, GridView creates and handles the PIXI stage while
 * FieldView controls higher level behaviors.
 */

var FieldView = Backbone.View.extend({
	turn: null,
	allies: [],
	enemies: [],

	initialize: function (options){
		options = options || {};
		this.chatView = new ChatView();
		this.battleView = new BattleView();
		this.gridView = new GridView();
		this.stage = this.gridView.stage;
		this.renderer = this.gridView.renderer;
		this.selectionManager = this.gridView.selectionManager;

		// Set the first turn to the player by default.
		this.turn = options.firstTurn || FieldView.TURN.PLAYER;

		// Bind repeated functions.
		this.animateBound_ = this.animate.bind(this);
		this.render();
	},

	render: function (){
		// Add the PIXI renderer to the page.
		this.el.appendChild(this.renderer.view);

		// Start animating.
		this.animateBound_();
	},

	enterView: function (lastView){},

	leaveView: function (newView){},

	completeTurn: function (){
		if (this.turn === FieldView.TURN.PLAYER){
			this.turn = FieldView.TURN.AI;
		} else if (this.turn === FieldView.TURN.AI){
			this.turn = FieldView.TURN.PLAYER;
		}
	},

	animate: function (){
		// Calculate timing.
		var time = Utils.now();
		var delta = time - this.lastTime;
		this.lastTime = time;

		// Update state.
		this.update(delta);

		// Render the stage and repeat the animation loop.
		this.renderer.render(this.stage);
		requestAnimFrame(this.animateBound_);
	},

	update: function (delta){
		this.gridView.update(delta);
		this.selectionManager.update(delta);
	}
});


// Define enumerable values.
FieldView.TURN = {
	PLAYER: 'player',
	AI: 'ai'
}
