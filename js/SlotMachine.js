function SlotMachine(rows = 3, columns = 3) {
	this.winnings = 0
	this.highscore = 0
	this.totalKinds = 4
	this.bid = 10
	this.slots = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	]
	this.winnerSlots = []
	this.slotsWon = 0
	this.play = function () {
		// randomize slots
		for (let x = 0; x < rows; x++) {
			for (let y = 0; y < columns; y++) {
				let slot = this.slots[x][y]
				this.slots[x][y] = Math.floor(Math.random() * this.totalKinds) + 1
			}
		}
		// Calculate top middle bottom row wins
		this.winnings = 0
		this.slotsWon = 0
		// Track winning slots and reset it every play
		this.winnerSlots = [
			[false, false, false],
			[false, false, false],
			[false, false, false]
		]
		for (let i = 0; i < rows; i++) {
			let row = this.slots[i]
			if (row[0] === row[1] && row[1] === row[2]) {
				console.log('horizontal win', row[0]);
				this.winnings += row[0]
				this.winnerSlots[i][0] = this.winnerSlots[i][1] = this.winnerSlots[i][2] = true
				this.slotsWon += 3
			}
		}
		// Check diagonal wins
		if (this.slots[0][0] === this.slots[1][1] && this.slots[1][1] === this.slots[2][2]) {
			console.log('diagonal win', this.slots[0][0]);
			this.winnings += this.slots[1][1]
			this.winnerSlots[0][0] = true
			this.winnerSlots[1][1] = true
			this.winnerSlots[2][2] = true
			this.slotsWon += 3
		}
		if (this.slots[2][0] === this.slots[1][1] && this.slots[1][1] === this.slots[0][2]) {
			console.log('diagonal win', this.slots[2][0]);
			this.winnings += this.slots[1][1]
			this.winnerSlots[2][0] = true
			this.winnerSlots[1][1] = true
			this.winnerSlots[0][2] = true
			this.slotsWon += 3
		}
		if (this.winnings) this.winnings *= this.bid * this.slotsWon
		if (this.winnings > this.highscore) this.highscore = this.winnings
		return this.winnings
	}
}