var RegExpStack = require ('..');

var stack = new RegExpStack;
stack.add ('global', /\w+/g);
stack.add ('sticky', /(\w+)\s*/y);

var text = 'Hello world! How are you?';
var i, result;

var all_expected = ['Hello', 'world', 'How', 'are', 'you'];
i = 0;
for (result of stack.each ('global', text))
{
    if (! result)
        throw new Error ('Test failed: "each" method is passing null/undefined result');
    if (result.match === all_expected[i])
        i++;
    else
        throw new Error ('Test failed: on method "each" with global flag, expecting "'+all_expected[i]+'", but "'+result.match+'" found');
}
if (i < 5)
    throw new Error ('Test failed: expecting 5 matches, but only '+i+' were found');

i = 0;
for (result of stack.each$global (text))
{
    if (! result)
        throw new Error ('Test failed: shortcut method is passing null/undefined result');
    if (result.match === all_expected[i])
        i++;
    else
        throw new Error ('Test failed: on shortcut with global flag, expecting "'+all_expected[i]+'", but "'+result.match+'" found');
}

var sticky_expected = ['Hello ', 'world'];
i = 0;
for (result of stack.each$sticky (text))
{
    if (! result)
        throw new Error ('Test failed: "each$sticky" shortcut method is passing null/undefined result');
    if (result.match === sticky_expected[i])
        i++;
    else
        throw new Error ('Test failed: shortcut with sticky flag, expecting "'+sticky_expected[i]+'", but "'+result.match+'" found');
}