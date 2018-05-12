StartTests ();
RunTest ('Create and add');
RunTest ('Method Match');
RunTest ('Method All');
RunTest ('Method Each');

// ------------------------------------------------------------------
//  Algorithm to run tests (explained)
// ------------------------------------------------------------------

/**
 * This function makes some override to prettify the output.
 */
var writeOnConsole;
function StartTests ()
{
    console.clear();

    RegisterTestSuit();

    // Console is now under our domain (mwahahahaha)
    var console_log = console.log;
    writeOnConsole = function(...args){
        console_log.apply(console, args)
    };
    console.log = function (...args) {
        var parsed = [];
        for (var item of args)
        {
            if (typeof item === 'string')
                parsed.push (item.replace(/^./gm, '| | $&').substr(4));
            else
                parsed.push (item);
        }
        writeOnConsole ('| Echo:', ...parsed);
    }
}

/**
 * Run the test by its filename.
 * The module with the text is required in the directory of this file.
 * All spaces in the name are replaced by hyphen (-) and text is converted
 * to lower case.
 * 
 * WARNING: async functions in tests are not supported by now!
 */
function RunTest (testName)
{
    // Start test
    writeOnConsole('+----------------------------------------')
    writeOnConsole('| Test: '+testName)
    var script;
    // Catch any sync exception and finish
    try {
        script = require('./test-'+testName.toLowerCase().replace(/\s+/g, '-'))
        writeOnConsole ('| Finished with success.');
    } catch (e)
    {
        writeOnConsole(e.stack.replace(/^(.)/gm, '| $1'));
    }
    writeOnConsole('+----------------------------------------')
}

function RegisterTestSuit ()
{
    // Call TestSuit.Case(()=>{...}).Throws(Error)
    global.TestSuit = {
        Case: function (code)
        {
            return {
                Throws: function(ExceptionClass, Message){
                    let didNotThrow=false;
                    try {
                        code();
                        didNotThrow = true;
                    } catch (e)
                    {
                        if (! (e instanceof Error))
                            throw TypeError ('Test failed: expecting descendant of Error class, but non-error value has been thrown');

                        if (e.constructor !== ExceptionClass)
                            throw TypeError ('Test failed: expecting error "'+ExceptionClass.name+'", but "'+e.constructor.name+'" has been thrown');
                        if (Message && e.message !== Message)
                            throw new TypeError ('Test failed: error message should say "'+Message+'"');
                    }
                    if (didNotThrow)
                        throw new Error('Test failed: this code should throw an '+ExceptionClass.name+', but it bypassed');
                }
            }
        }
    };
};