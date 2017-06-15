function FakeRoundRepo() {
    let data = [];
    this.isEmpty = function () {
        return data.length === 0
    }
    this.save = function (round) {
        data.push(round)
    }
    this.findAll = function () {
        return data
    }
}

module.exports = FakeRoundRepo