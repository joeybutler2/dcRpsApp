const Rps = require("../src/Rps").Rps;
const FakeRoundRepo = require("./FakeRoundRepo");

describe("playRound", function () {
    let rps

    beforeEach(function () {
        rps = new Rps(new FakeRoundRepo())
    })
    
    describe("p1 win scenarios", function () {
        let observer
        
        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["p1Wins"])
        })
        
        it("rock v scissors", function () {
            rps.playRound("rock", "scissors", observer)

            expect(observer.p1Wins).toHaveBeenCalled()
        })

        it("paper v. rock", function () {
            rps.playRound("paper", "rock", observer)

            expect(observer.p1Wins).toHaveBeenCalled()
        })

        it("scissors v. paper", function () {
            rps.playRound("scissors", "paper", observer)

            expect(observer.p1Wins).toHaveBeenCalled()
        })
    })

    describe("p2 win scenarios", function () {
        let observer

        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["p2Wins"])
        })
        
        it("scissors v rock", function () {
            rps.playRound("scissors", "rock", observer)

            expect(observer.p2Wins).toHaveBeenCalled()
        })

        it("rock v. paper", function () {
            rps.playRound("rock", "paper", observer)

            expect(observer.p2Wins).toHaveBeenCalled()
        })

        it("paper v. scissors", function () {
            rps.playRound("paper", "scissors", observer)

            expect(observer.p2Wins).toHaveBeenCalled()
        })
    })

    describe("tie", function () {
        let observer

        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["tie"])
        })
        
        it("rock v. rock", function () {
            rps.playRound("rock", "rock", observer)

            expect(observer.tie).toHaveBeenCalled()
        })
        
        it("paper v. paper", function () {
            rps.playRound("paper", "paper", observer)

            expect(observer.tie).toHaveBeenCalled()
        })
        
        it("scissors v. scissors", function () {
            rps.playRound("scissors", "scissors", observer)

            expect(observer.tie).toHaveBeenCalled()
        })
    })


    describe("invalid throws", function () {
        let observer

        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["invalid"])
        })

        it("rock v. [invalid throw]", function () {
            rps.playRound("rock", Math.random(), observer)

            expect(observer.invalid).toHaveBeenCalled()
        })

        it("invalid throw v. rock", function () {
            rps.playRound(Math.random(), "rock", observer)

            expect(observer.invalid).toHaveBeenCalled()
        })

        it("invalid v. same invalid", function () {
            rps.playRound("sailboat", "sailboat", observer)

            expect(observer.invalid).toHaveBeenCalled()
        })
    })
})