var RegExpStack = require ('..');

var stack = new RegExpStack;
stack.add ('global', /\w+/g);
stack.add ('sticky', /(\w+)\s*/y);

var text = 'Hello world! How are you?';

var all1 = stack.reset().all$global (text);
var all2 = stack.reset().all('global', text);
var sticky = stack.reset().all$sticky (text);

if (! all1) throw new Error ('Test failed: could not match any result using shortcut call');
if (all1[0].match !== 'Hello') throw new Error ('Test failed: expecting "Hello" to be found when using shortcut call');
if (all1[1].match !== 'world') throw new Error ('Test failed: expecting "world" to be found when using shortcut call');
if (all1[2].match !== 'How') throw new Error ('Test failed: expecting "How" to be found when using shortcut call');
if (all1[3].match !== 'are') throw new Error ('Test failed: expecting "are" to be found when using shortcut call');
if (all1[4].match !== 'you') throw new Error ('Test failed: expecting "you" to be found when using shortcut call');
if (all1[5] !== undefined) throw new Error ('Test failed: expecting to end results, but other word were found when using shortcut call');

if (! all2) throw new Error ('Test failed: could not match any result using method "all"');
if (all2[0].match !== 'Hello') throw new Error ('Test failed: expecting "Hello" to be found when calling with method "all"');
if (all2[4].match !== 'you') throw new Error ('Test failed: expecting "you" to be found when calling with method "all"');
if (all2[5] !== undefined) throw new Error ('Test failed: expecting to end results, but other word were found when using method "all"');

if (! sticky) throw new Error ('Test failed: could not match any result using shortcut call with sticky flag');
if (sticky[0].match.trim() !== 'Hello') throw new Error ('Test failed: expecting "Hello" to be found in sticky RegExp');
if (sticky[1].match.trim() !== 'world') throw new Error ('Test failed: expecting "Hello" to be found in sticky RegExp');
if (sticky[2] !== undefined) throw new Error ('Test failed: expecting to end RegExp, as there is an "!" preventing sticky RegExp to continue the capture');
