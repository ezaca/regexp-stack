module.exports =
class RegExpStack
{
    constructor ()
    {
        this.expStack = {};
        this.globalLastIndex = 0;
    }

    add (name, exp, passNamingGroups)
    {
        var namingGroups = passNamingGroups;
        if (typeof namingGroups === 'string')
            namingGroups = passNamingGroups.split(/\s*[,;]\s*|\s+/);
        if (! (exp instanceof RegExp))
            throw new TypeError ('RegExpStack::add 2nd argument must be the regular expression');
        if (! exp.global && ! exp.sticky)
            throw new TypeError ('RegExpStack::add regular expression must be global (/g) or sticky (/y)');
        if (namingGroups && !(namingGroups instanceof Array))
            throw new TypeError ('RegExpStack::add 3rd argument must be an array with group names to set on result');
        this.expStack[name] = {
            exp,
            names: namingGroups || [],
        }
        this['$'+name] = text=>this.match(name, text);
        this['all$'+name] = text=>this.all(name, text);
        this['each$'+name] = text=>this.each(name, text);
        return this;
    }

    reset ()
    {
        this.globalLastIndex = 0;
        return this;
    }

    match (name, text)
    {
        var item = this.expStack[name];
        item.exp.lastIndex = this.globalLastIndex;
        var result = item.exp.exec (text);
        if (! result)
            return result;
        this.globalLastIndex = item.exp.lastIndex;
        result = NormalizeResult (result, item.names);
        if (result)
            result.RegExp = item.exp;
        return result;
    }

    all (name, text)
    {
        var item, result = true;
        var stack = [];
        while (result)
        {
            item = this.expStack[name];
            item.exp.lastIndex = this.globalLastIndex;
            result = item.exp.exec (text);
            this.globalLastIndex = item.exp.lastIndex;
            result = NormalizeResult (result, item.names);
            if (! result)
                break;
            stack.push (result);
        }
        return stack;
    }

    * each (name, text)
    {
        var item, result = true;
        while (result)
        {
            item = this.expStack[name];
            item.exp.lastIndex = this.globalLastIndex;
            result = item.exp.exec (text);
            this.globalLastIndex = item.exp.lastIndex;
            result = NormalizeResult (result, item.names);
            if (! result)
                return;
            yield result;
        }
    }
}

function NormalizeResult (match, names)
{
    if (! match)
        return match;
    var result = match;
    result.match = match[0];
    if (! names.length)
        return match;
    if (names[0] === '')
        return {match};
    var groupName, groupIndex;
    for ([groupIndex, groupName] of names.entries())
    {
        if (groupName === '-')
            continue;
        if (result[groupName])
        {
            if (typeof result[groupName] === 'function')
                throw new Error ('RegExp group name "'+groupName+'" conflicts with an array function, you must choose unique names to results');
            else
                throw new Error ('RegExp group name "'+groupName+'" is already taken, use another name to your group');
        } else
            result[groupName] = match[groupIndex+1];
    }
    return result;
}