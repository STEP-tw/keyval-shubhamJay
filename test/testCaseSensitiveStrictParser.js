const src = function(filePath) {
  return "../src/" + filePath
};

const assert = require('chai').assert;
const Parsed = require(src('parsed.js'));
const StrictParser = require(src('index.js')).StrictParser;

describe("strict parser that is case insensitive", function() {

  describe("getLowerCaseValidKeys gives lower case of given keys", () => {
    let kvParser = new StrictParser(["name"], false);
    it('should give lower case version of given key', () => {
      let expect = ["name", 'name'];
      assert.deepEqual(expect, kvParser.getLowerCaseValidKeys(["name", "NAME"]));
    })
    it('should give lower case version of given key if there are underscores', () => {
      let expect = ["your_name", "your_name"];
      assert.deepEqual(expect, kvParser.getLowerCaseValidKeys(["your_name", "YOUR_NAME"]));
    })
    it('should give lower case version of given key if key has numbers', () => {
      let expect = ["name123"];
      assert.deepEqual(expect, kvParser.getLowerCaseValidKeys(["NAME123"]));
    })
  })

  it("should parse when specified keys are in lower case and actual is not", function() {
    let kvParser = new StrictParser(["name"], false);
    let expected = new Parsed();
    expected["NAME"] = "jayanth";
    let parsed = kvParser.parse("NAME=jayanth");
    assert.deepEqual(parsed, expected);
  });

  it("should parse when specified keys are in irregular and actual is not", function() {
    let kvParser = new StrictParser(["NamE"], false);
    let expected = new Parsed();
    expected["name"] = "jayanth";
    let parsed = kvParser.parse("name=jayanth");
    assert.deepEqual(parsed, expected);
  });

  it("should parse when specified keys are in irregular case and actual is not", function() {
    let kvParser = new StrictParser(["YOUR_name"], false);
    let expected = new Parsed();
    expected["YOUR_name"] = "jayanth";
    let parsed = kvParser.parse("YOUR_name=jayanth");
    assert.deepEqual(parsed, expected);
  });

  it("should parse when specified keys are in upper case and actual is not", function() {
    let kvParser = new StrictParser(["NAME123"], false);
    let expected = new Parsed();
    expected["name123"] = "jayanth";
    let parsed = kvParser.parse("name123=jayanth");
    assert.deepEqual(parsed, expected);
  });

});
