/**
 * This file contains logic regarding the behavior of the action menu that 
 * allows players to select an action on the field.  Options include actions 
 * such as attacking, healing, and more.
 */

var ActionMenuView = Backbone.View.extend({
	template: _.template($('#actionMenuTemplate').html()),

	el: '#actionMenuContainer',

	/**
	 * The current action set index.
	 * @type {Number}
	 */
	actionSet: null,

	/**
	 * Whether or not the action menu is open.
	 * @type {Boolean}
	 */
	isOpen: false,

	events: {
		'click .action-option': 'onActionClick',
		'mouseover .action-option': 'onActionHover'
	},

	initialize: function (options){
		options = options || {};
		this.actionSet = options.actionSet || 0;
		this.selectionManager = options.selectionManager;

		// Listen to Keyboard events when the menu is open.
		_.extend(this, Backbone.Events);
		this.listenTo(this.selectionManager, 'selection:target', this.onTargetTileSelected);
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

	close: function (cb){
		if (!this.isOpen) return;

		// Stop listening for keypresses.
		this.stopListening(Key, 'keyup');

		this.isOpen = false;
		this.$el
				.delay(200)
				.fadeOut(cb);
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
	onTargetTileSelected: function (tile){
		// TODO: Get the index from the passed-in event data.
		this.loadActions(0);

		// Highlight the first option by default.
		var firstOptionEl = this.$el.find('.action-option')[0];
		this.highlightOption(firstOptionEl);
	},

	onActionHover: function (e){
		this.highlightOption(e.target);
	},

	onActionClick: function (e){
		if (!e.target) return;

		// Animate the selected option element.
		var optionEl = $(e.target);
		var currIndex = optionEl.data('action-index');
		optionEl.addClass('active');

		// Close the menu and then signal the event to subscribers.
		this.close(function (){
			this.trigger('close', {
				actionSet: ActionSets[this.actionSet],
				selectedIndex: currIndex
			});
		}.bind(this));
	},

	highlightOption: function (optionEl){
		if (!optionEl) return;

		var optionElements = this.$el.find('.action-option');
		optionElements.removeClass('selected');
		optionEl.classList.add('selected');
	},

	/**
	 * The callback when a key is pressed to navigate the action menu.
	 */
	onKeyUp: function (e){
		var optionElements = this.$el.find('.action-option');
		var currOptionEl = optionElements.filter('.selected');
		var numOptions = optionElements.length;
		var currIndex = currOptionEl.data('action-index');
		var prevIndex = currIndex === 0 ? numOptions - 1 : currIndex - 1;
		var nextIndex = currIndex === numOptions - 1 ? 0 : currIndex + 1;

		if (Key.matches(e.keyCode, ['SPACE', 'ENTER'])){
			this.onActionClick({target: currOptionEl});
		} else if (Key.matches(e.keyCode, ['UP'])){
			this.highlightOption(optionElements[prevIndex]);
		} else if (Key.matches(e.keyCode, ['DOWN'])){
			this.highlightOption(optionElements[nextIndex]);
		} else if (Key.matches(e.keyCode, ['LEFT'])){

		} else if (Key.matches(e.keyCode, ['RIGHT'])){

		}
	},

});


// TODO: Move these sets to a different file.
// Define sets of actions.
var ActionSets = [
	['Fire', 'Water', 'Wait', 'Cancel'],
	['Light', 'Water', 'Wait', 'Cancel'],
	['Heal', 'Light', 'Wait', 'Cancel']
];
