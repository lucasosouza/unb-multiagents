app.factory('agent', function(env){
	//ReactiveAgent - only react to what it perceives
	class ReflexAgent {	  
		constructor() {
			this.id = Math.round(Math.random()*1000)
			this.position = Math.round(Math.random()*15)
			this.actionsCount = 0
			this.cleansCount = 0
		}
		act(state){
			this.actionsCount++
			var availableActions = env.Board.getAvailableActions(state, this.position)
			//reactive agent - clean if it is dirty, otherwise move randomly in a direction
			if (availableActions.indexOf('clean') > -1) {
				this.cleansCount++
				return 'clean'
			} else {
				return availableActions[Math.floor(Math.random() * availableActions.length)]
			}
		}
	}
	//Agent with State - stores the visited squares and number of tiles cleaned, and uses the info to base its decision
	class ModelBasedReflexAgent extends ReflexAgent {
		constructor(){
			super();
			this.visitedStates = [];
			this.cleanedStates = [];
			for (var i;i<16;i++) { this.visitedStates[i] = 0 }
		}
		act(state) {
			this.actionsCount++
			this.visitedStates.push(this.position)
			var availableActions = env.Board.getAvailableActions(state, this.position, this.visitedStates)
			//reactive agent with state - clean if it is dirty, otherwise chooses the least visited state
			if (availableActions.indexOf('clean') > -1) {
				this.cleanedStates.push(this.position)
				this.cleansCount++
				return 'clean'
			} else {
				//get the list of states based on actions
				var nextStates = env.Board.mapStates(this.position, availableActions) 
				//chooses the action with least previous visits
				var minVisits=99999;
				for (var i in nextStates) {
					var state = nextStates[i]
					var numberOfVisits = this.visitedStates.reduce(function(n, val) {
					    return n + (val === state);
					}, 0);
					if (numberOfVisits < minVisits) {
						minVisits = numberOfVisits;
						var selectedAction = availableActions[i]
					} 					
				}
				//return
				return selectedAction
			}
		}
	}

	return {
		'Reflex Agent': ReflexAgent,
		'Model-Based Reflex Agent': ModelBasedReflexAgent
	}
})


