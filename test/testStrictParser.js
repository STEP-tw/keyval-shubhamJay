const src = function(filePath) {
  return "../src/" + filePath
};
const errors = function(filePath) {
  return "../src/errors/" + filePath
};

const chai = require('chai');
const chaiAssert = chai.assert;
const expect = chai.expect;
const StrictParser = require(src('index.js')).StrictParser;
const InvalidKeyError = require(errors('invalidKeyError.js'));

var invalidKeyErrorChecker = function(key, pos) {
  return function(err) {
    if (err instanceof InvalidKeyError && err.invalidKey == key && err.position == pos)
      return true;
    return false;
  }
}

describe("strict parser", function() {
  it("should only parse keys that are specified for a single key", function() {
    let kvParser = new StrictParser(["name"]);
    try {
      var p = kvParser.parse("age=23");
    } catch (e) {
      chaiAssert.isOk(invalidKeyErrorChecker("age", 5)(e));
    };
  })

  it("should only parse keys that are specified for multiple keys", function() {
    let kvParser = new StrictParser(["name", "age"]);
    let actual = kvParser.parse("name=john age=23");
    let expected = {
      name: "john",
      age: "23"
    };
    chaiAssert.ownInclude(expected, actual);
    try {
      var p = kvParser.parse("color=blue");
    } catch (e) {
      chaiAssert.isOk(invalidKeyErrorChecker("color", 9)(e));
    }
  });

  it("should throw an error when one of the keys is not valid", function() {
    let kvParser = new StrictParser(["name", "age"]);
    try {
      var p = kvParser.parse("name=john color=blue age=23");
    } catch (e) {
      chaiAssert.isOk(invalidKeyErrorChecker("color", 20)(e));
    }
  });

  it("should throw an error on invalid key when there are spaces between keys and assignment operators", function() {
    let kvParser = new StrictParser(["name", "age"]);
    try {
      var p = kvParser.parse("color   = blue");
    } catch (e) {
      chaiAssert.isOk(invalidKeyErrorChecker("color", 13)(e));
    }
  });

  it("should throw an error on invalid key when there are quotes on values", function() {
    let kvParser = new StrictParser(["name", "age"]);
    try {
      var p = kvParser.parse("color   = \"blue\"");
    } catch (e) {
      chaiAssert.isOk(invalidKeyErrorChecker("color", 15)(e));
    }
  });

  it("should throw an error on invalid key when there are cases of both quotes and no quotes", function() {
    let kvParser = new StrictParser(["name", "age"]);
    try {
      var p = kvParser.parse("name = john color   = \"light blue\"");
    } catch (e) {
      chaiAssert.isOk(invalidKeyErrorChecker("color", 33)(e));
    }
  });

  it("should throw an error when no valid keys are specified", function() {
    let kvParser = new StrictParser([]);
    try {
      var p = kvParser.parse("name=john");
    } catch (e) {
      chaiAssert.isOk(invalidKeyErrorChecker("name", 8)(e));
    }
  });

  it("should throw an error when no array is passed", function() {
    let kvParser = new StrictParser(["name"]);
    try {
      var p = kvParser.parse("name=john");
    } catch (e) {
      chaiAssert.isOk(invalidKeyErrorChecker("name", 9)(e));
    }
  });
});
