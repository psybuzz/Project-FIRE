/* global describe, it */

(function () {
    'use strict';

    describe('The Application class', function () {
    	beforeEach(function (){
    		Mocks.mockFunctions([
    			'ViewManager',
    			'IntroView',
    			'MenuView',
    			'FieldView']);
    	});

        describe('playing/pausing', function () {
            it('should correctly update state', function () {
            	var game = new Application();
            	game.pause();
            	expect(game.isPaused).to.equal(true);

            	game.resume();
            	expect(game.isPaused).to.equal(false);

            	game.pause();
            	expect(game.isPaused).to.equal(true);
            });
        });
    });
})();
