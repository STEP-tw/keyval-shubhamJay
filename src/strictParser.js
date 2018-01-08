const Parser = require("./keyValueParser.js");
const strictParseInfoCreator = require("./parseInfoCreator.js").strict;

var StrictParser = function(listOfKeys, caseSentiviFlag = true) {
  Parser.call(this);
  if (!caseSentiviFlag) {
    listOfKeys = this.getLowerCaseValidKeys(listOfKeys);
  };
  let sanitisedListOfKeys = listOfKeys || [];
  this.parseInfoCreator = strictParseInfoCreator(sanitisedListOfKeys);
}

StrictParser.prototype = Object.create(Parser.prototype);

StrictParser.prototype.getLowerCaseValidKeys = function(listOfKeys) {
  return listOfKeys.reduce((validKeys, key) => {
    validKeys.push(key.toLowerCase());
    return validKeys;
  }, []);
};

module.exports = StrictParser;
