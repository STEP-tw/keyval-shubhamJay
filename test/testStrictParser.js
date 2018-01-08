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
        expect(
          () => {
            var p = kvParser.parse("age=23")(p);
            p == invalidKeyErrorChecker("age",5)(p);
          }).to.throw(InvalidKeyError);
      })

      it("should only parse keys that are specified for multiple keys", function() {
        let kvParser = new StrictParser(["name", "age"]);
        let actual = kvParser.parse("name=john age=23");
        let expected = {
          name: "john",
          age: "23"
        };
        chaiAssert.ownInclude(expected, actual);
        expect(
          () => {
            var p = kvParser.parse("color=blue");
            p == invalidKeyErrorChecker("color", 9)(p);
          }).to.throw(InvalidKeyError);
      });

      it("should throw an error when one of the keys is not valid", function() {
        expect(
          () => {
            let kvParser = new StrictParser(["name", "age"]);
            var p = kvParser.parse("name=john color=blue age=23");
            p == invalidKeyErrorChecker("color", 20)(p);
          }).to.throw(InvalidKeyError);
      });

      it("should throw an error on invalid key when there are spaces between keys and assignment operators", function() {
        expect(
          () => {
            let kvParser = new StrictParser(["name", "age"]);
            var p = kvParser.parse("color   = blue");
            p == invalidKeyErrorChecker("color", 13)(p);
          }).to.throw(InvalidKeyError);
      });

      it("should throw an error on invalid key when there are quotes on values", function() {
        expect(
          () => {
            let kvParser = new StrictParser(["name", "age"]);
            var p = kvParser.parse("color   = \"blue\"");
            p == invalidKeyErrorChecker("color", 15)(p);
          }).to.throw(InvalidKeyError);
      });

      it("should throw an error on invalid key when there are cases of both quotes and no quotes", function() {
        expect(
          () => {
            let kvParser = new StrictParser(["name", "age"]);
            var p = kvParser.parse("name = john color   = \"light blue\"");
            p == invalidKeyErrorChecker("color", 33)(p);
          }).to.throw(InvalidKeyError);
      });

      it("should throw an error when no valid keys are specified", function() {
        expect(
          () => {
            let kvParser = new StrictParser([]);
            var p = kvParser.parse("name=john");
            p == invalidKeyErrorChecker("name", 8)(p);
          }).to.throw(InvalidKeyError);
      });

      it("should throw an error when no array is passed", function() {
          expect(
            () => {
              let kvParser = new StrictParser();
              var p = kvParser.parse("name=john");
              p == invalidKeyErrorChecker("name", 8)(p);
            }).to.throw(InvalidKeyError);
          });
      });
