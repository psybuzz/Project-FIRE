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
		this.gridView.render();

		this.stage = this.gridView.stage;
		this.renderer = this.gridView.renderer;
		this.selectionManager = this.gridView.selectionManager;
		this.actionMenuView = new ActionMenuView({
			selectionManager: this.selectionManager
		});

		// Set the first turn to the player by default.
		this.turn = options.firstTurn || FieldView.TURN.PLAYER;
		this.addedPIXIView = false;

		// Bind repeated functions.
		this.animateBound_ = this.animate.bind(this);
		this.listenTo(this.actionMenuView, 'close', this.onActionMenuClose);
	},

	render: function (){
		// Add the PIXI renderer to the page.
		if (!this.addedPIXIView){
			this.el.appendChild(this.renderer.view);
			this.addedPIXIView = true;
		}

		// Start animating.
		this.animateBound_();
	},

	enterView: function (lastView){
		this.render();
	},

	leaveView: function (newView){
		var x = new TWEEN.Tween(b)
				.to({blurX: 50}, 800)
				.start();
		x = new TWEEN.Tween(g.pixiContainer)
				.to({rotation: 0.3, alpha:0}, 800)
				.start();
	},

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
		TWEEN.update(time);

		// Render the stage and repeat the animation loop.
		this.renderer.render(this.stage);
		requestAnimationFrame(this.animateBound_);
	},

	update: function (delta){
		this.gridView.update(delta);
		this.selectionManager.update(delta);
	},

	onActionMenuClose: function (e){
		// TODO: Tell the selection manager whether or not the action was an
		// attack/def, wait, or cancel.

		// Let the SelectionManager know to resume grid selection behavior when
		// the player's selected action has been completed.
		this.selectionManager.onActionSet();
	}
});


// Define enumerable values.
FieldView.TURN = {
	PLAYER: 'player',
	AI: 'ai'
};
