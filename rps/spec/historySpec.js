/**
 * Created by pivotal on 6/15/17.
 */
const Rps = require("../src/Rps").Rps;
const Round = require("../src/Rps").Round;
const FakeRoundRepo = require("./FakeRoundRepo");

describe("when no rounds have been played", function () {
    it("tells the UI noRounds", function () {
        let observerSpy = jasmine.createSpyObj("observerSpy", ["noRounds"])
        let roundRepo = new FakeRoundRepo();
        new Rps(roundRepo).history(observerSpy, new FakeRoundRepo())

        expect(observerSpy.noRounds).toHaveBeenCalled();
    });

    describe("some rounds have been played", function () {
        it("sends some rounds to the UI", function () {
            let observerSpy = jasmine.createSpyObj("observerSpy", ["p1Wins", "tie", "invalid", "p2Wins", "rounds"])
            let roundRepo = new FakeRoundRepo();

            const rps = new Rps(roundRepo);
            rps.playRound("rock", "paper", observerSpy)
            rps.playRound("paper", "rock", observerSpy)
            rps.playRound("paper", "paper", observerSpy)
            rps.playRound("sailboat", "paper", observerSpy)
            rps.history(observerSpy)

            expect(observerSpy.rounds).toHaveBeenCalledWith([
                new Round("rock", "paper", "p2"),
                new Round("paper", "rock", "p1"),
                new Round("paper", "paper", "tie"),
                new Round("sailboat", "paper", "invalid")
            ])
        });
    });
});

function roundRepoContract(buildRoundRepo) {
    describe('round repo', function () {
        describe("when no rounds have been saved", function () {
            it("is empty", function () {
                let fakeRoundRepo = buildRoundRepo();
                expect(fakeRoundRepo.isEmpty()).toBe(true)
            })
        });

        describe("when rounds have been saved", function () {
            it("is NOT empty", function () {
                let fakeRoundRepo = buildRoundRepo();
                fakeRoundRepo.save(new Round())
                expect(fakeRoundRepo.isEmpty()).toBe(false)
            })

            it("findAll returns all saved Rounds", function () {
                let fakeRoundRepo = buildRoundRepo();
                let round = new Round("p1 throw");
                fakeRoundRepo.save(round)
                expect(fakeRoundRepo.findAll()).toContain(round)
            });

        });
    })
}

roundRepoContract(() => new FakeRoundRepo());
