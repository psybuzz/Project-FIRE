/**
 * This file contains logic related to managing views, such as the intro screen,
 * menu, and in-game field views.
 */

/**
 * The view manager class is a presenter that handles loading and switching 
 * between different views.
 * 
 * @param {Object} options 	The configuration options.
 */
function ViewManager (options){
	options = options || {};
	this.currentView = null;

	// Initialize views.
	this.views = {};
	this.views[ViewManager.VIEWS.INTRO] = new IntroView({el: '#introContainer'});
	this.views[ViewManager.VIEWS.MENU] = new MenuView({el: '#menuContainer'});
	this.views[ViewManager.VIEWS.FIELD] = new FieldView({el: '#fieldContainer'});
}

/**
 * Loads a view into the current viewport.  This method depends on views 
 * that implement a view interface.
 * 
 * @param  {ViewManager.VIEWS} viewName 	The name of the view to load.
 */
ViewManager.prototype.loadView = function (viewName){
	var newView = this.views[viewName];
	var oldView = this.currentView;

	// Check if the view is valid.
	if (newView === oldView){
		return;
	} else if (!newView){
		console.error('Tried to load an unknown view: ' + viewName);
		return;
	}

	// Un-load the current view, if needed.
	if (oldView){
		oldView.leaveView(newView);
	}

	// Load the new view and update the state.
	newView.enterView(oldView);
	this.currentView = newView;
}


// Define enumerable values.
ViewManager.VIEWS = {
	INTRO: 'intro',
	MENU: 'menu',
	FIELD: 'field'
}
