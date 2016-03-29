app.factory('env', function($interval, $rootScope){
	class Square {
		constructor(){
			this.position = undefined
			this.situation = 'clean'
			this.occupied = false
			if (Math.random() < 0.5) {
				this.situation = 'dirty'
			}
		}
	}
	class Board {
		constructor(){
			this.squares = []
			for (var i=0;i<16;i++) {
				var sqr = new Square()
				sqr.position = i
				this.squares.push(sqr)
			}
	        this.cleaningAudio = new Audio();
    		this.cleaningAudio.src = "images/beep-02.wav"
		}
		initializeBoard(agent, boardType){
			var self=this;
			//if dynamic, set up another interval function that turns a tile from clean to dirty
			if (boardType == 'Dynamic') {
				var counterPlay = $interval(function(){
					//chooses a random square, if clean, change its situation to dirty
					var square = self.squares[Math.floor(Math.random() * self.squares.length)]
					if (square.situation == 'clean') { square.situation = 'dirty'}
				}, 1200)							
			}
			//play function, set up as a interval with one action every 600 miliseconds
			var play = $interval(function(){
				var action = agent.act(self.squares[agent.position]) //action decided by the agent
				self.translateAction(agent, action) //translates action decided by agent into motion
				self.updateCellPositions(agent) //updates board according to agent
				if (self.checkWinning()){
					$interval.cancel(play)
					if (counterPlay) { $interval.cancel(counterPlay) }					
					play = undefined
					$rootScope.victory = true
					$rootScope.initialized = false
				}
			}, 600)
		}
		updateCellPositions(agent){
			for (var sqr in this.squares) {
				if (this.squares[sqr].position == agent.position) {
					this.squares[sqr].occupied = true
				} else {
					this.squares[sqr].occupied = false					
				}
			}
		}
		checkWinning(){
			for (var sqr in this.squares) {
				var square = this.squares[sqr]
				if (square.situation == 'dirty') {
					return false
				} 
			}
			return true
		}
		static getAvailableActions(state, position){
			var availableActions = []
			var pos = position+1
			if (state.situation=='dirty') {
				availableActions.push('clean')
			}
			if (pos % 4 != 0) { //not on the right side
				availableActions.push('right')
			}
			if (pos % 4 != 1) { //not on the left side
				availableActions.push('left')
			}
			if (pos>4) { //not on the first row
				availableActions.push('up')
			}
			if (pos<13) { //not on the last row
				availableActions.push('down')
			}
			return availableActions
		}
		static mapState(position, action){
			if (action == 'left') {
				return position-1
			} else if (action == 'right'){
				return position+1
			} else if (action =='up') {
				return position-4
			} else if (action =='down') {
				return position+4
			}			
		}
		translateAction(agent, action){
			if (action=='clean') {
				this.squares[agent.position].situation = 'clean';
	            this.cleaningAudio.play();
    		} else {
				agent.position = Board.mapState(agent.position, action)
			}
		}
		static mapStates(position, actions){
			return actions.map(function(val, idx){
				return Board.mapState(position, val)
			})
		}		
	}	
	return {
		Square: Square,
		Board: Board
	};	
})