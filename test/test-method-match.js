var RegExpStack = require ('..');
var stack = new RegExpStack ();
var text = 'Hello world';
stack.add ('word', /(\w)\w*/g, 'captured');
stack.add ('space', /\s+/g, 'chars');

/**
 * Capture "Hello" of "Hello world"
 */

var result = stack.match ('word', text);

if (result[0] !== 'Hello')
    throw new Error ('Test failed: word "Hello" did not match the result ("'+result[0]+'")');

if (! result.match)
    throw new Error ('Test failed: default field "match" was not added in the result');

if (result.match !== 'Hello')
    throw new Error ('Test failed: field "match" has wrong value (expected "Hello", got "'+result.match+'")');

if (! result.captured)
    throw new Error ('Test failed: field "captured" was not added as group name');

if (result.captured !== 'H')
    throw new Error ('Test failed: field "captured" has wrong value (expected "H", got "'+result.captured+'")');

/**
 * Capture " " of "Hello world"
 */

var result = stack.match ('space', text);

if (! result)
    throw new Error ('Test failed: regular expression failed');
    
if (result.match !== ' ')
    throw new Error ('Test failed: expecting "match" to be " ", but "'+result.match+'" found');

if (result.chars !== undefined)
    throw new Error ('Test failed: expecting "chars" to be undefined, as there is no group in the RegExp, but it has value');

/**
 * Fail propositally
 */

var result = stack.match ('space', text);

if (result)
    throw new Error ('Test failed: expecting null result, as the RegExp should not match anything at this time');

/**
 * Capture "world" of "Hello world"
 */

var result = stack.$word (text);

if (! result[0])
    throw new Error ('Test failed: Did not match the word with .$id syntax');

if (result.match !== 'world')
    throw new Error ('Test failed: Did not match "world" with .$id syntax');

// End of "test-match-sequence.js"