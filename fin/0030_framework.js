//
// # framework management functions
//
//
// ## programmed instructions executioner
//
// verb = verb type
// whatobj = target objects (array)
// whatactions = actions extracted from object
function execute_instructions(verb,whatobj,whatactions) {
    if ( !( typeof(verb)=="string" && typeof(whatobj)=="object" && typeof(whatactions)=="string") ) {
        trigger_error(FIN_localization.ERROR_FORMAT);
    }
    // timeline counter is incremented anytime a significative input is recognized
    FIN_framework.TIMELINE+=1;
    debug_out("["+FIN_framework.TIMELINE+"]: "+verb+"/"+whatactions, 2);
    FIN_framework.HISTORY.input.push( verb+" "+object_name(whatobj[0]) );
    FIN_framework.HISTORY.done.push(whatactions);
    function myReplace(str, group1, group2) {
        return group1+ "||" + group2;
    }
    var tmp=whatactions.replace(/(\);)(\D\D\D\()/g, myReplace );
    // '||' is used as a separator
    tmp.split("||").forEach(
        function(elem){
            CRITTER.chores.push(elem);
            });
    CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(upto).offset().top }, "+FIN_framework.UI_FIGURES[0]+")" );
};

//
// ## find object-name (string)
//
function object_name(di) {
    debug_out(typeof(di),3);
    try {
        // returns object name (first synonim)
        return di.syn[0];
    }
    catch (err) {
        trigger_error(FIN_localization.ERROR_FATAL);
        return false;
    }
};

//
// ## removes "undefined" elements from an array
//
function elimina_indefiniti(vettore) {
    debug_out("elimina_indefiniti "+vettore,3);
    var undef;
    vettore = vettore.filter(function(item){
        return item !== undef;
    });
    // returns cleaned up array
    return vettore;
};

//
// ## removes multiple instances (uniq)
//
function elimina_elementi_ripetuti(array) {
    debug_out("elimina_elementi_ripetuti "+array,3);
    var unique = $.makeArray($(array).filter(function(i,itm){ 
        // note: 'index', not 'indexOf'
        return i == $(array).index(itm);
    }));
    // returns cleaned up array
    return unique;
};

//
// ##  in-scope objects list
//
// builds the list of the objects currently in-scope
function inscope_objs_list(oggetto) {
// ex: console.log(inscope_objs_list( FOCUS ) );
    // checks if it's a "focus" type special object
    if ( oggetto.typ.indexOf("focus") <0 ) {
        trigger_error(FIN_localization.ERROR_FORMAT);
        return false;
    }
    debug_out(object_name(oggetto),3);
    var listainscope=[""];
    var ogvalutati=[""];
    function cercatrailink(og) {
        // looks inside only if the object has not been evaluated yet
        if ( ogvalutati.indexOf(object_name(og))<0 ) {
            ogvalutati.push(object_name(og));
            if ( og.lnkTo.length > 0 ) {
                for (var i in og.lnkTo) {
                    if ( listainscope.indexOf(og.lnkTo[i]) < 0 ) {
                    listainscope.push(og.lnkTo[i]);
                    }
                    // in-scope search goes on through linked objects only if starting object is not any of the following types: sit, verb, closed
                    if ( (eval(og.lnkTo[i]).typ.indexOf("sit")<0) && (eval(og.lnkTo[i]).typ.indexOf("verb")<0) && (eval(og.lnkTo[i]).typ.indexOf("closed")<0) ) {
                        cercatrailink(eval(og.lnkTo[i]));
                    }
                }
            }
        }
    }
    cercatrailink(oggetto);
    array_remove("",listainscope);
    // returns in-scope objects list as an array of strings (object names)
    return listainscope;
};

//
// ## synonim to object
//
// looks for a word among synonims inside an array of objects
function sinonimo_to_oggetto(parola,vettore, verbo=false) {
    debug_out("sinonimo_to_oggetto "+parola+"/"+vettore+"/"+verbo,0);
    var found = false;
    for (elemento in vettore) {
//console.log(elemento, eval(parola, vettore[elemento]). syn,verbo,eval(vettore[elemento]).v_1[verbo] );
        if ( eval( vettore[elemento] ).syn.indexOf(parola) >= 0 ) {
        	if ( verbo != false ) {
            	if ( eval( vettore[elemento] )[verbo].length > 0 ) {
            		found = eval( vettore[elemento] );
            		break;
        		}
        		else {
                    continue;
                }
            }
            else {
            	found = eval( vettore[elemento] );
                break;
            }
        }
    }
    // returns the corresponding object
    return found;
};



//
// ## synonim to object
//
// looks for a word among synonims inside an array of objects
function sinonimo_to_oggetto_old (parola,vettore) {
    debug_out("sinonimo_to_oggetto "+parola+"/"+vettore,3);
    var found = false;
    vettore.map( function (el) {
        if ( eval(el).syn.indexOf(parola) >= 0 ) {
            found = eval(el);
            return;
        }
    } );
    // returns the corresponding object
    return found;
};

//
// ## framework error signal
//
// stops with custom message when a FIN framework error occurs
function trigger_error(message) {
    // always printed in console.
    debug_out("ERROR "+ callerName() +" >> "+"[!]", -1);
    // stops UI input
    FIN_framework.UI_ENABLED = false;
    ////alert(FIN_localization.ERROR_FATAL+": "+message+"\nUI: "+FIN_framework.UI_ENABLED);
    system_popup(FIN_localization.ERROR_FATAL+": "+message+"\nUI: "+FIN_framework.UI_ENABLED, "", 100);
    // throws fatal javascript error
    throw FIN_localization.ERROR_FATAL;
};

//
// ## elements comparison
//
function confronta(un,du) {
// ex: confronta(oggettoa, oggettob)
    debug_out("confronta "+un+" "+du,3);
    if ( typeof(un) != typeof(du) ) {
        trigger_error(FIN_localization.ERROR_GEN);
    }
    // returns "true" or "false"
    if (un==du)
        return true;
    else
        return false;
};

//
// ## verifies link-to presence in an object
//
function verifica_lnkTo(oggetto, parola) {
// ex: verifica_links(oggetto, "casa")
    debug_out("verifica_lnkTo "+object_name(oggetto)+" "+parola,3);
    // returns "true" or "false"
    return oggetto.lnkTo.indexOf(parola) >= 0;
};

//
// ## verifies link-from presence in an object
//
function verifica_lnkFr(oggetto, parola) {
// ex: verifica_links(oggetto, "casa")
    debug_out("verifica_lnkFr "+object_name(oggetto)+" "+parola,3);
    // returns "true" or "false"
    return oggetto.lnkFr.indexOf(parola) >= 0;
};

//
// ## defines a link from an object to another
//
function connetti(da,a) {
// ex: connetti("cestino","fungo")
    debug_out("connetti "+da+"->"+a,3);
    if ( ! ( FIN_framework.DICTIONARY.indexOf(da) >= 0 ) ) {
        trigger_error(FIN_localization.ERROR_OBJNOTDEFINED+" "+da);
    }
    if ( ! ( FIN_framework.DICTIONARY.indexOf(a) >= 0 ) ) {
        trigger_error(FIN_localization.ERROR_OBJNOTDEFINED+" "+a);
    }
    if ( !( confronta(da,a) || verifica_lnkTo(eval(da),a) || verifica_lnkFr(eval(a),da) ) ) {
        // set up link-TO
        eval(da).lnkTo.push(a);
        // set up link-FROM
        eval(a).lnkFr.push(da);
        // returns "true" if everything worked as expected
        return true;
    }
    else {
        trigger_error(FIN_localization.ERROR_NOTFOUND);
        debug_out(FIN_localization.ERROR_NOTFOUND+" " + da + " " + a, 1);
        return false;
    }
};

//
// ## removes an element from an array
//
function array_remove(element,array) {
    debug_out("array_remove "+element+"/"+array,3);
    var newarray=[];
    if (array.indexOf(element) >= 0) {
        newarray = array.splice( array.indexOf(element) , 1);
        // returns the purged array or false if it fails
        return newarray;
    }
    return false;
};

//
// ## base sixtyfour decoder
//
function basesixtyfourdecode(what){
    if (DEBUG > 0) {
        // return it as is if we are in debug mode
        return what;
    }
    else {
        // decodes the array (also converting URI characters) and returns the plain-text version
        return decodeURIComponent( atob( what ) );
    };
};


//////////////////CLEANED UP UP TO HERE
//
// ## story reset function
//
// resets all object links and actions to what stated in the story file at the beginning
function fin_story_reset(){
    debug_out("fin_story_reset",1);
    CRAWLER.story_end = 0;
    CRAWLER.step_n = 0;
    //FOCUS = FOCUS_atstart;
    FOCUS = jQuery.extend(true, {}, FOCUS_atstart);
    outputarea_cleanup();
    for ( var i in FIN_framework.ALLOBJECTS) {
//        console.log("CLEANING");
        FIN_framework.ALLOBJECTS[i].lnkTo=[];
        FIN_framework.ALLOBJECTS[i].lnkFr=[];
    }
    // reset FIN_framework.HISTORY variables
    //FIN_framework.HISTORY_RAW = [];
    FIN_framework.HISTORY.done = [];
    FIN_framework.HISTORY.input = [];

    for ( var o in objectsDefinition ) {
        var og = o.toLowerCase();
        for ( var what in objectsDefinition[og] ) {
            if (what=="lnkTo" || /^v_.+/.test(what) ) {
    //            console.log( " OBJ-ATTRIBUTES REWRITE: "+og+"/"+what+"/"+objectsDefinition[og][what], eval(og)[what] );
                var element=objectsDefinition[og][what];
                for ( var i in element ) {
    //                console.log( og, what, element[i] );
                    if ( eval(og)[what].indexOf( element[i].trim() ) < 0 ) {
                        if (what=="lnkTo") {
                            connetti(og,element[i].trim());
                        }
                        else {
                            eval(og)[what].push( element[i].trim() );   /// stub YYY
                        }
                    }
                }
            }
        }
    }

};

//
// ## automatic execution of in-scope objects v_0 content
//
function autoexec_v0s(){
    var listaogg = inscope_objs_list(FOCUS);
    for (var i in listaogg){
        if (eval(listaogg[i]).v_0.length > 0){
            var taken = eval(listaogg[i]).v_0.shift();
            // for repetition prefix '_' the instruction is injected again
            if (taken[0]=="_"){
                eval(listaogg[i]).v_0.push(taken);
                CRITTER.chores.push(taken.substr(1));
            }
            else{
                CRITTER.chores.push(taken);
            }
        }
    }
};

//
// ## main interpreter function: from instruction to object-action
//
function command_input_manager(stringa,chiamante) {
	var parola_oggetto;
    function parse_input_text( stringa , focus ) {
        if ( typeof(chiamante) == "undefined") {
            chiamante="doubleclick";
        }
        // records command history
        FIN_framework.HISTORY.raw.push(stringa+" / "+chiamante);
        if( FIN_framework.secondary_window != false ){
            secondary_window_write("[ "+FIN_framework.TIMELINE+" ] "+stringa+" / "+chiamante);
        }
        oggettiinscope = inscope_objs_list(focus);
        // STEP 1: looks for exact correspondance of composite words
        var filtering = stringa.replace(/["`:()]/g,' ').replace(/'/g," ");
        // converts " " -> "__" (doubles to avoid confusing "v_..." 
        var underscored = filtering.replace(/ /g,'__');
        debug_out("filtering received input: "+stringa+">>"+filtering+">>"+underscored,3);
        // first loop looks for composite words
        ////???
        for (var i in oggettiinscope) {
            for (var j in eval(oggettiinscope[i]).syn) {
                if (eval(oggettiinscope[i]).typ.indexOf('verb')<0 && eval(oggettiinscope[i]).syn[j].match("_") != null) {
                    if (underscored.match(eval(oggettiinscope[i]).syn[j].replace(/_/g,'__')) != null) {
                        found_composite = eval(oggettiinscope[i]).syn[j];
                        // "#" is used as a placeholder for a composite word
                        underscored = replaceString(found_composite.replace(/_/g,'__'),"#",underscored);
                    }
				}
			}
                
              /*  
            eval(oggettiinscope[i]).syn.forEach( function (el) {
                if (eval(oggettiinscope[i]).typ.indexOf('verb')<0 && el.match("_")) {
                    if (underscored.match(el.replace(/_/g,'__'))) {
                        found_composite = el;
                        // "#" is used as a placeholder for a composite word
                        underscored = replaceString(found_composite,"#",underscored);
                    }
                }
            } );
            */
        }
        
        // STEP 2: corrects the wrong words
        var wk = underscored.split("__");
        wk = wk.map(
            function (og) {
                if ( og == "#" ) {
                    return og;
                }
                else if ( (FIN_framework.DICTIONARY.indexOf(og) >= 0) || (FIN_localization.UNUSEFUL.indexOf(og) >= 0) ) {
                    return og;
                }
                else {
                    return correttore_parole(og, FIN_framework.DICTIONARY, FIN_framework.UI_FIGURES[1]);
                }
        } );
        // STEP 3: loop to find verb and object
        //var objs = [];
        var found_obj=false;
        var ogg = false;
        var corretta = "";
        // "wk" contains the inputstring corrected and splitted in an array of words
        if (DEBUG >4 && typeof(FIN_framework.secondary_window)!="undefined") {
			//// TBD verificarer che la window sia aperta!
            secondary_window_write("<i>>>"+stringa.toString()+"</i>");
        }
        wk = elimina_indefiniti(wk);
        for ( var i in wk ) {
            // composite words TBD/TBC
            if (wk[i] == "#") {
                // after correction: text rebuild
                corretta += found_composite.replace(/_/g," ")+" ";
                debug_out("PAROLA COMPOSTA? "+found_composite+" "+corretta,3);
                // looks for the corresponding object
                ogg = sinonimo_to_oggetto (found_composite,oggettiinscope);
                parola_oggetto = found_composite;
                if ( ogg.typ.indexOf("verb") >= 0 ) {
                    found_verb = object_name(ogg);
                }
                else {
                    corretta += wk[i]+" ";
                // looks for the corresponding object
                    found_obj=ogg;
                }
            }
            // generic single words
            else {
                try {
                    ogg = sinonimo_to_oggetto(wk[i].trim(),oggettiinscope);
                    parola_oggetto = wk[i].trim();
                    // if it's a verb
                    if ( ogg!=false && ogg.typ.indexOf("verb") >= 0 ) {
                        found_verb = object_name(ogg);
                    }
                    // if it's a different type of object
                    else if (typeof(ogg)=="object") {
                        found_obj=ogg;
                    }
                    corretta += wk[i]+" ";                    
                }
                catch (err){
                    trigger_error(FIN_localization.ERROR_OBJ+" - "+err);
                }                
            }
            if ( found_verb && found_obj ) {
                break;
            }
        }
        // >> now found_obj contains the object and found_verb the verb group
        corretta = corretta.trim().replace(/#/,"");
        debug_out("WATCH-correzione dell'input: "+corretta+" :V: "+found_verb+" soglia: "+FIN_framework.UI_FIGURES[1], 3);
        if (chiamante=="keyboard" && FIN_framework.FEEDBACK_MESSAGE) {
            msg( corretta );
        }
        return found_obj;
    }

// TBD e` necessario?
    // verb icons "disabled"
    if (FIN_framework.UI_INPUT=="touch") {
        $(FIN_layout.verb_icons).fadeTo(FIN_framework.UI_FIGURES[3], FIN_framework.UI_FIGURES[4]);
    }
    // verifies maximum input length
    if (stringa.length > FIN_framework.UI_FIGURES[2]) {
        trigger_error(FIN_localization.ERROR_INPUT);
    }
    debug_out(stringa+" << ["+chiamante+']',2);
    var found_verb=false;
    var oggettiinscope = false;
    var found_composite = false;
    // pre-parsing: splitting multiple instructions
    // check if there is any grammatical separator: , . ;
    var tmp=false;
    
    ////??? TBD
    if ( /;|,|\./.test(stringa) ) {
        var tmp = stringa.replace(/;|\./g,",").split(',');
    }
    
    /////???
    if ( tmp ) {
        for (i in tmp) {
            debug_out("MULTIPLE INSTRUCTIONS "+i+": "+tmp[i],2);
        }
    }

    // the identified objects are stored here
    var vettoreinput = parse_input_text(stringa.toLowerCase(),FOCUS);
    var actions = "";
    // default action: in case no verbs have been found -> v_1
    if (found_verb == false) {
        found_verb="v_1";
    }
    
    debug_out("FOUND-VERB: "+found_verb, 3);
    vettoreinput = elimina_elementi_ripetuti(vettoreinput);
    debug_out("INPUT CORRETTO E DEPURATO: "+vettoreinput+"/Verb: "+found_verb+" soglia: "+FIN_framework.UI_FIGURES[1], 3);
    // STEP 5: looks for instructions linked to the verb for each identified object
    for (var i in vettoreinput) {
        if ( vettoreinput[i] !=false && found_verb!=false ) {


				    //// HERE
    // checks if the instruction content of the object is not empty, in this case looks for an analogous object
    if ( vettoreinput[i][found_verb].length == 0 ) {
	vettoreinput[i] = sinonimo_to_oggetto(parola_oggetto, inscope_objs_list(FOCUS), found_verb)
	}
    console.log(">>>>>>>>>>>>>>",parola_oggetto,found_verb);
    //console.log( sinonimo_to_oggetto(parola_oggetto, inscope_objs_list(FOCUS), found_verb) );
    


         if ( vettoreinput[i] != false ) {
            // takes out the instruction from the object
            if ( typeof(vettoreinput[i][found_verb][0]) != "undefined" ) {
            var taking = vettoreinput[i][found_verb].shift();
                // substring to check the first characters (7)
                if ( FIN_framework.test_instructions.indexOf( taking.substr(0,7).toLowerCase().trim() ) >=0 ) {
                    debug_out("TEST INSTRUCTION",4);
                    // a test instruction is immediately evaluated/executed
                    eval(taking);
                    if ( FIN_framework.test_truefalse ) {
                        // true -> going on the next
                        actions += vettoreinput[i][found_verb].shift();
                        // FIN_framework.test_truefalse reset
                        FIN_framework.test_truefalse = false;
                    }
                    else {
                        // false -> reinjecting test instruction
                        vettoreinput[i][found_verb].unshift( taking );
                    }
                }
                else {
                    // regular instruction
                    actions=taking;
                }
            }
		 }
        }
        else {
            // input not understood by the framework
            msg(FIN_localization.UI_DONTUNDERSTAND);
            FIN_framework.INPUT_FAILED+=1;
            debug_out("INPUT_FAILED: "+FIN_framework.INPUT_FAILED,2);
            clr();
        }
    }
    debug_out("VERB: "+found_verb+" V-INPUT: "+vettoreinput, 2);
    // instructions execution
//    console.log(">>",actions.length,actions);
    if (actions.length > 0 && actions!="undefined") {
        // reset of fail-counter
        FIN_framework.INPUT_FAILED=0;
        // executes recognized instructions considering the verb identified
        execute_instructions(found_verb, vettoreinput, actions);
        // cleans-up input space
        clr();
        // TBD stub
        // evaluates in-scope objects and executes all v_0 instructions
    }
    // input not understood by the framework
    else {
        msg(FIN_localization.UI_DONTUNDERSTAND);
        FIN_framework.INPUT_FAILED+=1;
        debug_out("INPUT_FAILED: "+FIN_framework.INPUT_FAILED,2);
        clr();
    }
    // caller? keyboard / touch / system
    if (chiamante="keyboard") {
        $(inputstring).focus();
    }
    // periodic instructions (v0 verbs)
    CRITTER.chores.push( "autoexec_v0s()" );
    return;
};

//
// ## wrapper to retrieve current focus object name
//
// ex: current_focus()
function current_focus(){
    try {
        return FOCUS.lnkTo[FOCUS.lnkTo.length-1];
    }
    catch (ERR) {
        trigger_error("Focus: "+ERROR_NOTFOUND, 1);
    }
};

