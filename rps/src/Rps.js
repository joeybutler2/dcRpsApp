function Rps(roundRepo) {
    this.roundRepo = roundRepo;

    this.playRound = function (p1Throw, p2Throw, observer) {
        new PlayRoundRequest(p1Throw, p2Throw, observer).execute(this.roundRepo)
    }

    this.history = function (observer) {
        if (this.roundRepo.isEmpty()) {
            observer.noRounds()
        } else {
            observer.rounds(this.roundRepo.findAll())
        }
    }
}

function Round(p1Throw, p2Throw, result) {
    this.p1Throw = p1Throw;
    this.p2Throw = p2Throw;
    this.result = result;
}

function PlayRoundRequest(p1Throw, p2Throw, observer) {
    this.execute = function (roundRepo) {
        if (invalid(p1Throw) || invalid(p2Throw)) {
            observer.invalid()
            roundRepo.save(new Round(p1Throw, p2Throw, "invalid"))
        }
        else if (throwsAreTheSame()) {
            observer.tie()
            roundRepo.save(new Round(p1Throw, p2Throw, "tie"))
        }
        else if (p1ThrowBeatsP2Throw()) {
            observer.p1Wins()
            roundRepo.save(new Round(p1Throw, p2Throw, "p1"))
        }
        else {
            roundRepo.save(new Round(p1Throw, p2Throw, "p2"))
            observer.p2Wins()
        }
    }

    const ROCK = "rock"
    const PAPER = "paper"
    const SCISSORS = "scissors"

    const validThrows = [ROCK, PAPER, SCISSORS]

    function invalid(t) {
        return !validThrows.includes(t)
    }

    function throwsAreTheSame() {
        return p1Throw === p2Throw
    }

    function p1ThrowBeatsP2Throw() {
        return p1Throw === ROCK && p2Throw === SCISSORS ||
            p1Throw === PAPER && p2Throw === ROCK ||
            p1Throw === SCISSORS && p2Throw === PAPER
    }
}

module.exports = {Rps, Round}