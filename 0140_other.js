


//-// verb synonims substitutor TBD USATO?
// es: verb_substitution("1, fare") >> v_1.syn = ["disfare"] >> ["fare"]
function verb_substitution(what) {
    debug_out("NEW VERB GROUP DEFINITION: "+what, 2);
    var wordlist = what.split(',');
    if (wordlist.length < 2) {
        trigger_error(ERROR_RAW);
        return false;
    }
    else {
        // the first is the number that identifies the verb group (it is removed)
        whatgroup = wordlist.shift();
        // adds verb and trims content
        var p = wordlist.unshift('v_'+whatgroup);
        // trimming and forcing lowercase before loading in the verb object
        for (var i = 0; i < wordlist.length; i++) {
            wordlist[i] = wordlist[i].toLowerCase().trim()
        }
        eval('v_'+whatgroup).syn = wordlist;
        debug_out("NEW VERB GROUP DEFINED: "+'v_'+whatgroup+" // "+eval('v_'+whatgroup).syn,3);
        console.log('v_'+whatgroup);
        return true;
    }
}

