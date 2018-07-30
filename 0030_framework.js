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
        trigger_error(ERROR_FORMAT);
    }
    // timeline counter is incremented anytime a significative input is recognized
    TIMELINE+=1;
    debug_out("["+TIMELINE+"]: "+verb+"/"+whatactions, 2);
    HISTORY.input.push( verb+" "+object_name(whatobj[0]) );
    HISTORY.done.push(whatactions);
    function myReplace(str, group1, group2) {
        return group1+ "||" + group2;
    }
    var tmp=whatactions.replace(/(\);)(\D\D\D\()/g, myReplace );
    // '||' is used as a separator
    tmp.split("||").forEach(
        function(elem){
            CRITTER.chores.push(elem);
            });
    CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(upto).offset().top }, "+UI_FIGURES[0]+")" );
}

//
// ## instruction: removes an object from scope (does not destroy the object)
//
function rem(objt) {
// ex: rem("casa");
    debug_out(objt,2);
    var ogg = objt.trim();
    var undef;
    if (typeof(eval(ogg))=="object"){
        for (var i=0 ; i < eval(ogg.toLowerCase()).lnkFr.length ; i+=1) {
            // removes lnkTo from any other linked-object
            array_remove( ogg.toLowerCase() , eval(eval(ogg.toLowerCase()).lnkFr[i]).lnkTo );
        }
        // deletes lnkFrom of the object itself
        eval(ogg.toLowerCase()).lnkFr = [];
    }
    else {
        try {
            eval(ogg);
        }
        catch(err){
            trigger_error(ERROR_RAW+" "+err.message+" eval >> "+ogg);
        }
    }
    return;
}

//
// ## instruction: object moving
//
function mov(stringofinstr) {
// ex: mov("fungo, cappuccetto_rosso");
    debug_out(stringofinstr,2);
    var splitting = stringofinstr.split(',');
    var ogg = $.trim(splitting[0]);
    var dove = $.trim(splitting[1]);
    var undef;
    for (var i=0 ; i < eval(ogg.toLowerCase()).lnkFr.length ; i+=1) {
        // removes link-to from any element found in link-from of the moved object
        array_remove( ogg.toLowerCase() , eval(eval(ogg.toLowerCase()).lnkFr[i]).lnkTo );
    }
    // deletes link-from
    eval(ogg.toLowerCase()).lnkFr = [];
    if ( !(dove.toLowerCase() == "" || dove==undef) ) {
        // new connection setup
        connetti(dove.toLowerCase(),ogg.toLowerCase());    
    }
    return;    
}

//
// ## instruction: moves "player" special object => modifies FOCUS link
//
function plt(moveto) {
    debug_out(moveto,2);
    if ( eval(PLAYER.toLowerCase()).typ.indexOf("player") >= 0 ) {
        mov(PLAYER+','+moveto);
        // FOCUS manipulation, following player movement:
        // important: modifies the point of view
        // current point of view is stored in the last position of the FOCUS.lnkTo array => substituted
        FOCUS.lnkTo.pop();
        FOCUS.lnkTo.push( moveto.toLowerCase() );
        debug_out("NEW FOCUS: "+FOCUS.lnkTo[FOCUS.lnkTo.length-1],2);
        return;
    }
    else {
        trigger_error(ERROR_NOPLY);
    }
}

//
// ## object => object-name (string)
//
function object_name(di) {
    debug_out(typeof(di),3);
    try {
        return di.syn[0];
    }
    catch (err) {
        trigger_error(ERROR_FATAL);
        return false;
    }
}

//
// ## removes "undefined" elements from an array
//
function elimina_indefiniti(vettore) {
    debug_out("elimina_indefiniti "+vettore,3);
    var undef;
    vettore = vettore.filter(function(item){
        return item !== undef;
    });
    return vettore;
}

//// elimina tutti gli elementi ripetuti lasciando un unico esemplare per ciascuno
function elimina_elementi_ripetuti(array) {
    debug_out("elimina_elementi_ripetuti "+array,3);
    var unique = $.makeArray($(array).filter(function(i,itm){ 
        // note: 'index', not 'indexOf'
        return i == $(array).index(itm);
    }));
    return unique;
}




// builds the list of the objects currently in-scope and returns it as an array of strings
function inscope_objs_list(oggetto) {
// ex: console.log(inscope_objs_list( FOCUS ) );
    // check if it's a "focus" type object
    if ( oggetto.typ.indexOf("focus") <0 ) {
        trigger_error(ERROR_FORMAT);
        return false;
    }
    debug_out(object_name(oggetto),3);
    var listainscope=[""];
    var ogvalutati=[""];
    function cercatrailink(og) {
        // if the object has not yet been evaluated
        if ( ogvalutati.indexOf(object_name(og))<0 ) {
            ogvalutati.push(object_name(og));
            if ( og.lnkTo.length > 0 ) {
                for (var i in og.lnkTo) {
                    if ( listainscope.indexOf(og.lnkTo[i]) < 0 ) {
                    listainscope.push(og.lnkTo[i]); // add it in list
                    }
//                    console.log(listainscope);
                    // if the link is NOT sit, verb, closed, focus TBD?
                    //if ( ( (eval(og.lnkTo[i]).typ.indexOf("sit")<0) && (eval(og.lnkTo[i]).typ.indexOf("verb")<0) && (eval(og.lnkTo[i]).typ.indexOf("closed")<0) ) || ( og.typ.indexOf( "focus" ) >= 0 ) ) {
                    if ( (eval(og.lnkTo[i]).typ.indexOf("sit")<0) && (eval(og.lnkTo[i]).typ.indexOf("verb")<0) && (eval(og.lnkTo[i]).typ.indexOf("closed")<0) ) {
                        cercatrailink(eval(og.lnkTo[i])); // percorro i suoi link (ricorsivamente) se non sono di tipo sit o verb
                    }
                }
            }
        }
    }
    cercatrailink(oggetto);
    array_remove("",listainscope);
    return listainscope;
}

//// cerca in un vettore di oggetti se tra i loro sinonimi e` presente la parola indicata, se si` restituisce l'oggetto, se no false
function sinonimo_to_oggetto (parola,vettore) {
    debug_out("sinonimo_to_oggetto "+parola+"/"+vettore,3);
    var found = false;
    vettore.map( function (el) {
        if ( eval(el).syn.indexOf(parola) >= 0 ) {
            found = eval(el);
            return;
        }
    } );
    return found;
}


//// framework error
function trigger_error(message) {
	debug_out(callerName() +" >> "+"[!]");
    // stops UI input
    UI_ENABLED = false;
    alert(ERROR_FATAL+": "+message+"\nUI: "+UI_ENABLED);
    throw ERROR_FATAL;
}



//// verifica se due elementi sono uguali (se confrontabili), restituisce true o false
function confronta(un,du) {
// es: confronta(oggettoa, oggettob)
    debug_out("confronta "+un+" "+du,3);
    if ( typeof(un) != typeof(du) ) {
      //return -1; // restituisce -1 se i due elementi non sono del medesimo tipo
    trigger_error(ERROR_GEN);
    }
    if (un==du)
        return true; // restituisce true se sono uguali
    else
        return false; // restituisce false se sono diversi
}

//// verifica se il link e` nella lista "To" dell'oggetto indicato (true / false)
function verifica_lnkTo(oggetto, parola) {
// es: verifica_links(oggetto, "casa")
    debug_out("verifica_lnkTo "+object_name(oggetto)+" "+parola,3);
    //console.log("verifica_lnkTo",object_name(oggetto),parola, oggetto.lnkTo, oggetto.lnkTo.indexOf(parola));
    return oggetto.lnkTo.indexOf(parola) >= 0;
}

//// verifica se il link e` nella lista "From" dell'oggetto indicato (true / false)
function verifica_lnkFr(oggetto, parola) {
// es: verifica_links(oggetto, "casa")
    debug_out("verifica_lnkFr "+object_name(oggetto)+" "+parola,3);
    return oggetto.lnkFr.indexOf(parola) >= 0;
}

// defines a link from an object to another
function connetti(da,a) {
// ex: connetti("cestino","fungo")
    debug_out("connetti "+da+"->"+a,3);
    if ( ! ( DICTIONARY.indexOf(da) >= 0 ) ) {
        trigger_error(ERROR_OBJNOTDEFINED+" "+da);
    }
    if ( ! ( DICTIONARY.indexOf(a) >= 0 ) ) {
        trigger_error(ERROR_OBJNOTDEFINED+" "+a);
    }
    // devono essere diversi...
    if ( !( confronta(da,a) || verifica_lnkTo(eval(da),a) || verifica_lnkFr(eval(a),da) ) ) {
        //e il link non deve essere gia` presente (verificato in aggiungi_links())
        // aggingo i link:
        eval(da).lnkTo.push(a);
        eval(a).lnkFr.push(da);       
        return true;
    }
    else {
        // link gia` presenti o errore di tipo
        trigger_error(ERROR_NOTFOUND);
        return false;
    }
} // fine: connetti

// removes an element from an array an returns the removed element or false if fails
function array_remove(element,array) {
    debug_out("array_remove "+element+"/"+array,3);
    var newarray=[];
    if (array.indexOf(element) >= 0) {
        newarray = array.splice( array.indexOf(element) , 1 /* = rimuove 1 elemento */ );
        return newarray;
    }
    return false;
}


// default verbs are linked to the FOCUS
//  TBD
FOCUS.lnkTo.unshift("v_0");
FOCUS.lnkTo.unshift("v_1");
FOCUS.lnkTo.unshift("v_2");
FOCUS.lnkTo.unshift("v_3");

// object cloning via jquery method to remember the starting point (for the "CRAWLER")
var FOCUS_atstart = jQuery.extend(true, {}, FOCUS);

// decoding objectsDefinition content
// TBD if (DEBUG==0){}
objectsDefinition=JSON.parse(basesixtyfourdecode(objectsDefinition));
//objectsDefinition=JSON.parse( decodeURIComponent(atob(objectsDefinition)) );

// first loop run: building objects
for ( var ob in objectsDefinition ) {
    var deffocus=false;
    var og = ob.toLowerCase();
    // costruzione oggetto
//    debug_out("OBJECT GENERATION: "+og);
    eval( "var " + og + ' = new fin_object("'+og+'");' );
    // if not present, adds the word to the dictionary
    if (DICTIONARY.indexOf(og)<0){
        DICTIONARY.push(og);
    }
}

// checks if default verb objects exist
if ( typeof(v_0)=="undefined" || typeof(v_1)=="undefined" || typeof(v_2)=="undefined" || typeof(v_3)=="undefined") {
    trigger_error(ERROR_OBJNOTDEFINED+": "+"verb");
}

// second loop run: adding attributes to objects: types, links, synonims, ... 
for ( var o in objectsDefinition ) {
    var og = o.toLowerCase();
    for ( var what in objectsDefinition[og] ) {

        // se la proprieta` non e` definita (tipicamente un verbo custom) la aggiungo all'oggetto specifico
        var undef;
        if ( eval(og)[what] === undef ) {
            eval(og)[what]=[];
        }
        debug_out( "ATTRIBUTES: "+og+"/"+what+"/"+objectsDefinition[og][what], 3 );
        for ( var i in objectsDefinition[og][what] ) {
            // se non c'e` gia` l'aggiunge -- verificando il tipo di oggetto js
            // se "lista" (istruzioni)...
            if ( typeof(objectsDefinition[og][what][i]) == typeof([]) ) {
                var t = objectsDefinition[og][what][i]
            }
            // tutto il resto e` "stringa"
            else {
                var t = objectsDefinition[og][what][i].trim();
            }
            debug_out("COSTRUZIONE: "+og+" "+what+" "+i+" "+t, 3);

            // forza il minuscolo se non si tratta di istruzioni associate ai verbi
            // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////working
//            if (what!="v_0" && what!="v_1" && what!="v_2" && what!="v_3") {
            // doppia negazione per forzare il tipo booleano sugli attributi di tipo "verbo"
            if ( !what.match(/v_.+/) ) {
                var wd = t.toLowerCase();
            }
            else {
                var wd = t;
            }
            // esegue la verifica di elemento gia` presente
            // if the attribute is not present yet, it is added
            // except for the raw javascipt
            if ( eval(og)[what].indexOf( wd ) < 0 || wd.match(/raw/) ) {
                // type link
                if (what=="lnkTo") {
                    connetti(og,wd);
                }
                // type synonim
                else if (what=="syn") {
                    // agginge ai sinonimi globali DICTIONARY
                    DICTIONARY.push( wd );
                    eval(og)[what].push( wd );
                }
                // all other attributes
                else {
                    eval(og)[what].push( wd );
                }
            }
        }
    }
} // fine: startup loops


//-// resets all object links and actions to what stated in the story file
function fin_story_reset(){
    debug_out("fin_story_reset",1);
    CRAWLER.story_end = 0;
    CRAWLER.step_n = 0;
    //FOCUS = FOCUS_atstart;
    FOCUS = jQuery.extend(true, {}, FOCUS_atstart);
    outputarea_cleanup();
    for ( var i in ALLOBJECTS) {
//        console.log("CLEANING");
        ALLOBJECTS[i].lnkTo=[];
        ALLOBJECTS[i].lnkFr=[];
    }
    // reset HISTORY variables
    //HISTORY_RAW = [];
    HISTORY.done = [];
    HISTORY.input = [];

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

}

// automatic execution of in-scope objects v_0 content
function autoexec_v0s(){
    var listaogg = inscope_objs_list(FOCUS);
    for (var i in listaogg){
        if (eval(listaogg[i]).v_0.length > 0){
//            console.log(listaogg[i],">>",eval(listaogg[i]).v_0 );
            var taken = eval(listaogg[i]).v_0.shift();
//console.log(listaogg[i],">>",eval(listaogg[i]).v_0 ); /// XXXXXXXXXXXXXX
            // for repetition prefix '_' the instruction is injected again
            if (taken[0]=="_"){
                eval(listaogg[i]).v_0.push(taken);
//                console.log(taken.substr(1));
                CRITTER.chores.push(taken.substr(1));
            }
            else{
                CRITTER.chores.push(taken);
            }
        }
    }
}


// looks for v_0 duties in the in-scope objects for execution TBD OLD non usato XXXXX
function execute_periodic_v0s() {
    var iter = inscope_objs_list(FOCUS);
    for ( var el in iter ) {
    debug_out(iter[el],2);
        if ( eval(iter[el]).typ.indexOf( "verb" ) < 0 && eval(iter[el]).v_0.length > 0 ) {
            // IMPORTANT: manages "v_0" instructions with ONE string only!
            // takes out the instruction to be executed
            // CRITTER.chores.push( eval(iter[el]).v_0.shift() );
            // if the instruction in v_0 is preceded by a '_' it must be kept (repetitive instruction), so..
            if ( eval(iter[el]).v_0[0][0]=="_" ){
            // it's retrieved...
                var istr = eval(iter[el]).v_0.shift();
                CRITTER.chores.push( istr.substr(1) );
            // then pushed again where found
                eval(iter[el]).v_0.push(istr);
//                CRITTER.chores.push( eval(iter[el]).v_0[0].substr(1) );                
            }
            else {
                CRITTER.chores.push( eval(iter[el]).v_0.shift() );
            }
        }
    }
}

// main interpreter function: from instruction to object-action
function command_input_manager(stringa,chiamante) {
    //// parse_input_text() -- function definition -- closure of command_input_manager() that returns a corrected string
    function parse_input_text( stringa , focus ) {
        if ( typeof(chiamante) == "undefined") {
            chiamante="doubleclick";
        }
        // records command history
        HISTORY.raw.push(stringa+" / "+chiamante);
        if(typeof(secondary_window)!="undefined"){
			write_in_secondary_window("[ "+TIMELINE+" ] "+stringa+" / "+chiamante);
		}
        oggettiinscope = inscope_objs_list(focus);
        // STEP 1: looks for exact correspondance of composite words
        var filtering = stringa.replace(/["`:()]/g,' ').replace(/'/g," ");
        // converts " " -> "__" (doubles to avoid confusing "v_..." 
        var underscored = filtering.replace(/ /g,'__');
        debug_out("filtering received input: "+stringa+">>"+filtering+">>"+underscored,3);
        // first loop looks for composite words
        for (var i in oggettiinscope) {
            eval(oggettiinscope[i]).syn.forEach( function (el) {
                if (eval(oggettiinscope[i]).typ.indexOf('verb')<0 && el.match("_")) {
                    if (underscored.match(el.replace(/_/g,'__'))) {
                        found_composite = el;
                        // "#" is used as a placeholder for a composite word
                        underscored = replaceString(found_composite,"#",underscored);
                    }
                }
            } );
        }
        // STEP 2: corrects the wrong words
        var wk = underscored.split("__");
        wk = wk.map(
            function (og) {
                if ( og == "#" ) {
                    return og;
                }
                else if ( (DICTIONARY.indexOf(og) >= 0) || (UNUSEFUL.indexOf(og) >= 0) ) {
                    return og;
                }
                else {
                    return correttore_parole(og, DICTIONARY, UI_FIGURES[1]);
                }
        } );
        // STEP 3: loop to find verb and object
        //var objs = [];
        var found_obj=false;
        var ogg = false;
        var corretta = "";
        // "wk" contains the inputstring corrected and splitted in an array of words
        if (DEBUG >4 && typeof(secondary_window)!="undefined") {
//            txt("<i>>> >"+objs[0].syn[0]+"</i>");
            secondary_window_write("<i>>>"+stringa.toString()+"</i>");
        }
        wk = elimina_indefiniti(wk);
        for ( var i in wk ) {
            // composite words //per la parola composta TBD NON FUNZIONA!
            if (wk[i] == "#") {
                // ricostruisce il testo di input dopo la correzione
                corretta += found_composite.replace(/_/g," ")+" ";
                debug_out("PAROLA COMPOSTA? "+found_composite+" "+corretta,3);
                // cerca l'oggetto corrispondente
                ogg = sinonimo_to_oggetto (found_composite,oggettiinscope);
                // se e` un verbo...
                if ( ogg.typ.indexOf("verb") >= 0 ) {
                    found_verb = object_name(ogg);
                }
                else {
                // ricostruisce il testo di input dopo la correzione
                    corretta += wk[i]+" ";
                // cerca l'oggetto corrispondente
                    //objs.push( ogg );
                    found_obj=ogg;
                }
            }
            // generic single words
            else {
                try {
                   // sinonimo_to_oggetto(wk[i],inscope_objs_list(FOCUS)).syn[0]);
                    ogg = sinonimo_to_oggetto(wk[i].trim(),oggettiinscope);
                    // if it's a verb
                    if ( ogg!=false && ogg.typ.indexOf("verb") >= 0 ) {
                        found_verb = object_name(ogg);
                    }
                    // if it's a different type of object
                    else if (typeof(ogg)=="object") {
                        //objs.push( ogg );
                        found_obj=ogg;
                    }
                    // ricostruisce il testo di input dopo la correzione
                    corretta += wk[i]+" ";                    
                }
                catch (err){
                    trigger_error(ERROR_OBJ+" - "+err); ////TBD
                }                
            }
            if ( found_verb && found_obj ) {
                break;
            }
        } // fine del ciclo for parole->oggetti
    // >> now objs contains the object and found_verb the verb group
    corretta = corretta.trim().replace(/#/,""); // solo una sostituzione? TBD
    debug_out("WATCH-correzione dell'input: "+corretta+" :V: "+found_verb+" soglia: "+UI_FIGURES[1], 3);
    if (chiamante=="keyboard" && FEEDBACK_MESSAGE) {
        // messaggio sulla barra di feedback
        msg( corretta );
    }
    return found_obj; //objs;
    } // -- parse_input_text() definition end -- //

    // verb icons "disabled"
    if (UI_INPUT=="touch") {
        $(verb_icons).fadeTo(UI_FIGURES[3], UI_FIGURES[4]);
    }
    //$(verb_icons).css({ opacity: 0.5 });
    // verifica lunghezza massima input
    if (stringa.length > UI_FIGURES[2]) {
        trigger_error(ERROR_INPUT);
    }
    debug_out(stringa+" << ["+chiamante+']',2);
    var undef;
    var found_verb=false;
    var oggettiinscope = false;
    var found_composite = false;
    // pre-parsing: splitting multiple instructions
///XXXXXXXXXXXXXXXXXXXXXXXXXXX
// check if there is any grammatical separator: , . ;
    var tmp=false;
    if ( /;|,|\./.test(stringa) ) {
        var tmp = stringa.replace(/;|\./g,",").split(',');
//        for (i in tmp) {
 //          tmp[i];
  //      }
    }
    //console.log("MULTIPLE INSTRUCTIONS, in:",stringa);

    ///////////////////////////////////////YYY
    //tmp.toString().split(",")
    if ( tmp ) {
        for (i in tmp) {
            debug_out("MULTIPLE INSTRUCTIONS "+i+": "+tmp[i],2);
//console.log("STOP QUI");
        }
    }

//// TBD

    // scompongo l'input con parse_input_text(): vettoreinput contiene gli oggetti identificati
    // al "parse_input_text" viene passato l'oggetto FOCUS
    // I PRIMI DUE OGGETTI SOLTANTO!
    vettoreinput = parse_input_text(stringa.toLowerCase(),FOCUS);
    // a questo punto vettoreinput contiene gli OGGETTI identificati (se esistono e sono in-scope) o dei "false" se esistono ma non sono in-scope, altrimenti scarta le parole
    // la stringa actions conterra` i comandi da eseguire accodati in ordine di identificazione
    // i comandi vengono estratti dagli oggetti, ovvero eseguiti una volta sola
    actions = "";
    // se non sono stati indicati verbi, per default si considera: v_1 = esamina
    if (found_verb == false) {
        found_verb="v_1";
    }
    debug_out("FOUND-VERB: "+found_verb, 3);
    // se gli oggetti indicati non sono in-scope vettoreinput e` uguale a "false"
    // forzatura del check a string per la verifica del contenuto "false" (valore iniziale) di vettoreinput
    // utile nel caso in cui l'input contenga riferimenti a oggetti esistenti ma out-of-scope
    /*
    // depuro il vettore dagli elementi "false"    
    for (i in vettoreinput) {
        if ( $.inArray(false, vettoreinput) >= 0 ) {
            vettoreinput.splice( $.inArray(false, vettoreinput), 1 );
        }
    }
    
    */
    // depuro il vettore dagli elementi doppi
    vettoreinput = elimina_elementi_ripetuti(vettoreinput);
    debug_out("INPUT CORRETTO E DEPURATO: "+vettoreinput+"/Verb: "+found_verb+" soglia: "+UI_FIGURES[1], 3);
    // STEP 5: looks for actions linked to the verb for each identified object
    for (var i in vettoreinput) {
        if ( vettoreinput[i] !=false && found_verb!=false ) {
            // takes out the instruction from the object if it's not a special one _...
// TBD perche' non funziona la risposta fissa?
//            if ( vettoreinput[i][found_verb][0].match( '^_' ) ) {
                // cuts out the special char _
//                actions += vettoreinput[i][found_verb][0].substring(1);
//            }
//            else {
            if ( typeof(vettoreinput[i][found_verb][0]) != "undefined" ) {
                actions += vettoreinput[i][found_verb].shift();
            }
//            }
        }
        else {
	    // l'input non e` stato compreso dal framework
            msg(UI_DONTUNDERSTAND);
            INPUT_FAILED+=1;
            debug_out("INPUT_FAILED: "+INPUT_FAILED,2);
            clr();
        }
    }
    // nel caso di meta-verbo v_0, porta per default al suo contenuto su v_1
//    if (found_verb == "v_0") {
//        actions += v_0.v_1[0];
//    } */    //TBD no
    debug_out("VERB: "+found_verb+" V-INPUT: "+vettoreinput, 2);
    // esegue le istruzioni (potenzialmente piu` elementi di un vettore)
    //console.log("LOG:",actions);
    if (actions.length > 0 && actions!="undefined") {
        // reset of fail-counter
        INPUT_FAILED=0;

        // executes recognized instructions considering the verb identified
        execute_instructions(found_verb, vettoreinput, actions);
        // cleans-up input space
        clr();
        // TBD stub
        // evaluates in-scope objects and executes all v_0 instructions
    }
    // ...oppure segnala di non aver compreso l'input
    else {
        msg(UI_DONTUNDERSTAND);
        INPUT_FAILED+=1;
        debug_out("INPUT_FAILED: "+INPUT_FAILED,2);
        clr();
    }
    // verifica se command_input_manager e` stata chiamata da keyboard / touch / system
    if (chiamante="keyboard") {
        // porta il focus su inputstring
        $(inputstring).focus();
    }
    // periodic instructions (v0 verbs)
    CRITTER.chores.push( "autoexec_v0s()" );
    return;
} // fine: command_input_manager
