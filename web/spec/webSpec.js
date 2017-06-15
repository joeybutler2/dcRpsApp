const React = require('react')
const ReactDOM = require('react-dom')
const {Round} = require('rps')

class PlayForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultText: "",
            p1Throw: "",
            p2Throw: "",
            roundsText: "",
            rounds: []
        }
    }

    componentDidMount() {
        this.props.rps.history(this);
    }

    noRounds() {
        this.setState({roundsText: "NO ROUNDS"})
    }

    rounds(theRounds) {
        this.setState({roundsText: "", rounds: theRounds})
    }

    renderRounds() {
        return this.state.rounds.map((round, index) =>
            <div key={index}>
                {round.p1Throw}
                {round.p2Throw}
                {round.result}
            </div>
        )
    }

    handleClick() {
        this.props.rps.playRound(this.state.p1Throw, this.state.p2Throw, this)
    }

    invalid() {
        this.setState({resultText: "INVALID"})
    }

    p1Wins() {
        this.setState({resultText: "p1Wins"})
    }

    handleThrowChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }

    render() {
        return (
            <div>
                <div className="result">{this.state.resultText}</div>
                <button onClick={this.handleClick.bind(this)}>PLAY</button>
                <input name="p1Throw" onInput={this.handleThrowChange.bind(this)}></input>
                <input name="p2Throw" onInput={this.handleThrowChange.bind(this)}></input>
                {this.state.roundsText}
                {this.renderRounds()}
            </div>
        )
    }
}

describe("play form", function () {
    let domFixture;
    beforeEach(function () {
        setupDom();
    });

    afterEach(function () {
        domFixture.remove();
    });

    describe("rps tells us invalid", function () {
        beforeEach(function () {
            // This is a stub, not a fake.
            mountApp({
                playRound(p1Throw, p2Throw, ui) {
                    ui.invalid()
                },
                history() {}
            });
        });

        it("then the UI should display 'INVALID'", function () {
            expect(domFixture.querySelector("div.result").innerText).toBe("");

            let buttonText = domFixture.querySelector("button").innerText;
            expect(buttonText).toBe("PLAY");

            submitForm();
            expect(domFixture.querySelector("div.result").innerText).toBe("INVALID");
        });
    });

    describe("rps tells us p1 wins", function () {
        beforeEach(function () {
            // This is a stub, not a fake.
            mountApp({
                playRound(p1Throw, p2Throw, ui) {
                    ui.p1Wins()
                },
                history() {}
            });
        });

        it("then the UI should display 'p1Wins'", function () {
            expect(domFixture.querySelector("div.result").innerText).toBe("");

            let buttonText = domFixture.querySelector("button").innerText;
            expect(buttonText).toBe("PLAY");

            submitForm();
            expect(domFixture.querySelector("div.result").innerText).toBe("p1Wins");
        });
    });

    describe("accepts user input", function () {
        it("sends the user's input to the rps module", function () {
            const playSpy = jasmine.createSpy("play");
            mountApp({
                playRound: playSpy,
                history: () => {}
            });

            changeThrowInput("p1Throw", "p1 throw");
            changeThrowInput("p2Throw", "p2 throw");

            submitForm();
            expect(playSpy).toHaveBeenCalledWith("p1 throw", "p2 throw", jasmine.any(Object));
        });

        function changeThrowInput(throwName, throwValue) {
            let input = document.querySelector(`input[name='${throwName}']`);
            input.value = throwValue;
            input.dispatchEvent(new Event("input", {bubbles: true, cancelable: false}));
        }
    });

    describe("when the rps module says there are no rounds", function () {
        beforeEach(function () {
            mountApp({
                history(observer) {
                    observer.noRounds()
                }
            })
        })

        it("displays NO ROUNDS", function () {
            expect(domFixture.innerText).toContain("NO ROUNDS");
        });
    });

    describe("when the rps module says there are rounds", function () {
        beforeEach(function () {
            mountApp({
                history(observer) {
                    observer.rounds([new Round("bar", "foo", "baz")])
                }
            })
        })

        it("displays the rounds", function () {
            expect(domFixture.innerText).not.toContain("NO ROUNDS");
            expect(domFixture.innerText).toContain("bar", "foo", "baz");
        });
    });

    describe("rps tells us p2 wins", function () {

    });

    describe("rps tells us tie", function () {

    });

    function setupDom() {
        domFixture = document.createElement('div');
        domFixture.id = 'testPlayForm';
        document.querySelector('body').appendChild(domFixture);
    }

    function mountApp(rps) {
        ReactDOM.render(
            <PlayForm rps={rps}/>,
            domFixture
        );
    }

    function submitForm() {
        document.querySelector("button").click();
    }
});