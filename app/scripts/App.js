/**
 * This file contains the main entry point for the application.  It is intended
 * to be very lightweight.
 */

/**
 * The core class that controls the entire game.
 * 
 * @param {Object} options The configuration options.
 */
var Application = function (options){
	_.extend(this, Backbone.Events, options);
	this.isPaused = false;
};

_.extend(Application.prototype, {
	/**
	 * Starts the game.  This function should only be called once.
	 */
	start: function(){
		this.viewManager = new ViewManager();
		this.viewManager.loadView(ViewManager.VIEWS.FIELD);

		this.isPaused = false;
	},

	/**
	 * Pauses the game.  This also triggers an alert for other classes that execute
	 * special logic when the game is paused.
	 */
	pause: function(){
		if (!this.isPaused) this.trigger('pause');
		this.isPaused = true;
	},

	/**
	 * Resumes the game.  This also triggers an alert for other classes that execute
	 * special logic when the game is resumed.
	 */
	resume: function(){
		if (this.isPaused) this.trigger('resume');
		this.isPaused = false;
	},
});


// Start the game itself, unless this is the testing environment.
if (window.environment !== 'TESTING'){
	var game = new Application();
	game.start();
}
