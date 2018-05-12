var RegExpStack = require('..');
var stack = new RegExpStack ();
stack.add ('test1', /test1/g);
stack.add ('test2', /test2/g, 'group1 group2');

TestSuit.Case (()=>{
    stack.add ('test3', /not-global-or-sticky-flag/);
}).Throws(TypeError);

if (! stack.expStack.test1)
    throw new Error ('Test failed: test1 was not appended');

if (! stack.expStack.test2)
    throw new Error ('Test failed: test2 was not appended');

if (! (stack.expStack.test1.exp instanceof RegExp))
    throw new Error ('Test failed: test1 was not configured properly (expecting test1.exp field)');

if (! (stack.expStack.test1.names instanceof Array))
    throw new Error ('Test failed: test1 was not configured properly (expecting test1.names field)');

if (stack.expStack.test2.names[0] !== 'group1')
    throw new Error ('Test failed: test2 was not configured properly (expecting "group1" as group name)');

if (! stack.$test1 || ! stack.$test2)
    throw new Error ('Test failed: expecting stack.$test1 and stack.$test2 to be set');

if (! stack.all$test1 || ! stack.all$test2)
    throw new Error ('Test failed: expecting stack.all$test1 and stack.all$test2 to be set');

if (! stack.each$test1 || ! stack.each$test2)
    throw new Error ('Test failed: expecting stack.each$test1 and stack.each$test2 to be set');

// End of file