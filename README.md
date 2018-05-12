# RegExp Stack

This library contains a class which allows creating a stack of multiple regular expressions and executes against one or more texts, capturing and working with results in many ways.

[TOC]

## Usage

Require the class:
```javascript
var RegExpStack = require("regexp-stack");
```
Instantiate an object to use, here we will call it "myStack":
```javascript
var myStack = new RegExpStack;
```
### Adding expressions
You can add regular expressions using the method `add` giving it a name and the expression itself:
```js
myStack.add('word', /\w+/g)
```
**Flags:** Remember, as we'll work with many expressions, it does make sense to have these expressions with global (`g`) or sticky (`y`) flags. In fact, the library will throw an error if some regular expression does not have /g or /y flags. All other flags are accepted and optional.

If your expression includes groups, you can give a name for each group in the third parameter:
```js
myStack.add('contact', /^(\w+) (\w+)$/gm, ['name', 'surname']);
```
In this example, we have an expression named "contact", a poorly designed expression that matches lines with names and surnames and names for the groups. Each result will have a field `name` with the same value as the group 1, and a field `surname` with the same value of group 2.

Results are still the same as obtained by RegExp::exec method, but they have additional fields. An example of a result would be:
```
[
  'Eliakim Zacarias',
  'Eliakim',
  'Zacarias',
  index: 0,
  input: 'Eliakim Zacarias',
  match: 'Eliakim Zacarias',
  name: 'Eliakim',
  surname: 'Zacarias'
]
```
For your comfort, you can pass the group names as a plain string, we'll parse it for you:
```js
myStack.add('contact', /^(\w+) (\w+) (\w+)$/gm, 'name surname')
```
Like before, this will cause the result to have a field `name` with the value of group 1 and `surname` with the value of group 2.

### Matching a result
Method `match` allows you to match results of an expression:
```js
myStack.match('contact', myListOfContacts);
```
The line above will match 1 result and return its resulting array.

You can repeat the call with the same or another expression, the index is shared among all registered expressions.

Consider the example:
```js
stack = new RegExpStack;
stack.add('who', /(\w+)\s*/g, 'name');
stack.add('what', /(loves|hates) (\w+)\s*/g, 'verb subject');

list =
`Eliakim loves computers
John hates coffee`;

stack.match('who', list);
// Returns [..., name:'Eliakim']

stack.match('what', list);
// Returns [..., verb:'loves', subject:'dogs']

stack.match('who', list);
// Returns [..., name:'John']

stack.match('who', list);
// Returns [..., verb:'hates', subject:'coffee']
```
As you can see, John is a monster! Oh, and the index is shared with the expressions `what` and `who`.

### Shortcuts

The other way to call the `match` method is through the `$` shortcut.

```js
// Insead of:
myStack.match ('contact', text);

// You can use:
myStack.$contact (text);
```

Every expression that you add with the `add` method generates a `$name` field in the object.

To call `match(name,...)` method you should use `$name` function.

To call `all(name,...)`, use `all$name` function, where *name* is the name of the expression.

To call `each(name,...)`, use `each$name` function, where *name* is the name of the expression.

### Restarting captures
Sometimes you will want to reset the index of the captures to zero, so you can match another text with the same stack, for example.

For these situations, we  have the `reset` method:
```js
myStack.reset();
```
This will cause the next `match` to start from the beginning of the text. Other functions that have the same effect are `all` and `each`, and their shortcuts.

### Getting all matches

You can get a list of results **while** the expression can match something, using the method `all`.

```js
stack.add('myWord', /\w+/g);
stack.all('myWord', 'Lorem ipsum dolor');
// Returns: [['Lorem',...], ['ipsum',...], ['dolor',...]]

// Or use the short version:
stack.all$myWord('Lorem ipsum dolor');
```

**Note** that if you use the `/g` flag, the result may not be the exact next. In the example above, we did not match the whitespaces, but the expression ignored them. This is the common behavior of the global `/g` flag. If you want to get the text exactly in the index, use the sticky `/y` flag.

### Getting results with for..of

When we don't want to save an array of matches, we can iterate directly with the results of each call.

For that, we can use the `each` method or the `each$...` shortcut.

```js
stack.add('num', /\d+/g);
for (var result of stack.each$num ('1, 2, 3'))
  console.log (result.match);

// Will output:
//   1
//   2
//   3
```
Like before, we used the `/g` flag to ignore characters between the numbers. The loop will stop when it can't match anything.

# Reference

`new RegExpStack ()`
Instantiates the object. Does not accept any argument.

`stack.globalLastIndex`
Returns the lastIndex position shared among expressions.

`stack.add (name, expression, groups);
Add an expression to the stack, where *name* is the name of the expression (to call it), *expression* is an instance of RegExp, including a literal regular expression, and *groups* is an array or string with the names of the fields in the result corresponding to capturing groups.

`stack.match (name, text)` or `stack.$name (text)`
Matches the *text* using the expression referenced by *name*. Similar to the "exec" method on common regular expressions.
The capture starts from the last global index, and updates the index to the new position after the capture, if return something, or let it untouched if not.

`stack.all (name, text)` or `stack.all$name (text)`
Matches *text* using the expression reference by *name* while the last match returns something. When nothing more is captured, it returns an array with the obtained results.
The capture starts from the last global index and resets the index after it ran.

`stack.each (name, text)` or `stack.each$name (text)`
Intended to use in a for..of loop, this function returns a Generator that yields results while there is something to match. The loop will stop when nothing more is matched.
The capture starts from the last global index and resets the index after it ran.

`stack.reset ()`
Set the "globalLastIndex" to zero, what causes the next capture to start from the begin of the string. It is useful when used in combination with `match`.

-------