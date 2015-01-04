/**
 * This file contains logic regarding the behavior of the action menu that 
 * allows players to select an action on the field.  Options include actions 
 * such as attacking, healing, and more.
 */

var ActionMenuView = Backbone.View.extend({
	template: _.template($('#actionMenuTemplate').html()),

	el: '#actionMenuContainer',

	/**
	 * The current action set.
	 * @type {Number}
	 */
	actionSet: null,

	isOpen: false,

	initialize: function (options){
		options = options || {};
		this.actionSet = options.actionSet || 0;
		this.selectionManager = options.selectionManager;

		// Listen to Keyboard events when the menu is open.
		_.extend(this, Backbone.Events);
		this.listenTo(this.selectionManager, 'selection:target', this.onTargetSelected);
	},

	render: function (){
		if (this.isOpen) return;

		// Display the menu.
		var html = this.template({actionOptions: ActionSets[this.actionSet]});
		this.$el
				.hide()
				.html(html)
				.fadeIn();

		// Listen for keypresses.
		this.listenTo(Key, 'keyup', this.onKeyUp);

		this.isOpen = true;
	},

	close: function (){
		if (!this.isOpen) return;

		// Stop listening for keypresses.
		this.stopListening(Key, 'keyup');

		this.isOpen = false;
		this.$el.fadeOut();
	},

	/**
	 * Loads an action set given an index.
	 * 
	 * @param  {Number} index The index of the action set to load.
	 */
	loadActions: function (index){
		var set = ActionSets[index];
		if (!set) return;

		this.actionSet = index;
		this.render();
	},

	/**
	 * The callback when the player has just selected a target and needs to view
	 * the menu.
	 * 
	 * @param  {Object} tile The current tile data.
	 */
	onTargetSelected: function (tile){
		// TODO: Get the index from the passed-in event data.
		this.loadActions(0);
	},

	/**
	 * The callback when a key is pressed to navigate the action menu.
	 */
	onKeyUp: function (){
		if (Key.isPressed(['SPACE', 'ENTER'])){

		} else if (Key.isPressed(['UP'])){

		} else if (Key.isPressed(['DOWN'])){

		} else if (Key.isPressed(['LEFT'])){

		} else if (Key.isPressed(['RIGHT'])){

		}
	}
});


// TODO: Move these sets to a different file.
// Define sets of actions.
var ActionSets = [
	['Fire', 'Water', 'Wait', 'Cancel'],
	['Light', 'Water', 'Wait', 'Cancel'],
	['Heal', 'Light', 'Wait', 'Cancel']
];
