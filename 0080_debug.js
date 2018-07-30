// # debugger functions


//// TBD prova
function prova() {
   console.log("PROVA BUTTON"); 
//TBD    document.onclick.stopPropagation();
}


//// pulsante TRY
function try_button() {
/// TBD
    debug_out("TRY BUTTON PRESSED",1);
    if (typeof(CRAWLER)!="undefined") {    
        if (!CRAWLER.working) {
            CRAWLER.start();
        }
        else {
            CRAWLER.stop();
        }
    }
    else {
        trigger_error(ERROR_GEN);
    }
}

//// pulsante "debug" TBD
function debug_button() {
    //raw("PROVAAAA");
    debug_out("DEBUG-BUTTON PRESSED:",2);
//    console.log($("body").css("font-size"));
//    console.log("SLOWPRINTING: "+UI_SLOWPRINTING);
    debug_out("FOCUS: << "+FOCUS.lnkTo[FOCUS.lnkTo.length-1]+" >> "+FOCUS.lnkTo, 1);
    debug_out("IN-SCOPE: "+inscope_objs_list(FOCUS), 2);
    debug_out("DICTIONARY:"+DICTIONARY, 3);
    debug_out("HISTORY INPUT: "+HISTORY.input,4);
    debug_out("HISTORY DONE:"+HISTORY.done,4);
    debug_out("CRITTER:"+CRITTER.chores,4);
}

/* ************************************ 
//// debug snippet frpom the web
////from: http://jsfiddle.net/bladnman/EhUm3/ TBD
************************************  */

function callerName() {
    try {
        var myCallee = arguments.callee;
        var hisCallee = myCallee.caller.arguments.callee;
        var hisCallerName = hisCallee.caller.name;

        if (isNoE(hisCallerName)) {
            var hisCallersFunction = hisCallee.caller.toString();
            if (!isNoE(hisCallersFunction)) {
                hisCallerName = fBetween(hisCallersFunction, "function", "(");
            }
        }
        hisCallerName = trim(hisCallerName);
    }
    catch (ex) {
        hisCallerName = "";
    }

    if (isNoE(hisCallerName)) {
        return "(anonymous)";
    }

    return hisCallerName;
}

function trim(inString) {
    return inString.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
function getStringValue(inString) {
    if (inString == null || inString == "undefined" || inString == "null" || inString == "[object]" || inString == "[object NodeList]") {
        return "";
    }

    try {
        var tString = new String(inString);
        return tString.toString();
    } catch (e) {
        return "";
    }
}

function fLeft(inText, delim) {
    inText = getStringValue(inText);
    delim = getStringValue(delim);
    var outText = "";
    var theSpot = inText.indexOf(delim);
    if (theSpot > -1) {
        outText = inText.substring(0, theSpot);
    }
    return outText;
}

function fLeftBack(inText, delim) {
    inText = getStringValue(inText);
    delim = getStringValue(delim);
    var outText = "";
    var theSpot = inText.lastIndexOf(delim);
    if (theSpot > -1) outText = inText.substring(0, theSpot);
    return outText;
}

function fRight(inText, delim) {
    inText = getStringValue(inText);
    delim = getStringValue(delim);
    var outText = "";
    var theSpot = inText.indexOf(delim);
    if (theSpot > -1) {
        outText = inText.substring(theSpot + delim.length, inText.length);
    }
    return outText;
}

function fRightBack(inText, delim) {
    inText = getStringValue(inText);
    delim = getStringValue(delim);
    var outText = "";
    var theSpot = inText.lastIndexOf(delim);
    if (theSpot > -1) outText = inText.substring(theSpot + delim.length, inText.length);
    return outText;
}

function fBetween(inText, delimLeft, delimRight) {
    return fLeft(fRight(inText, delimLeft), delimRight);
}

function isNoE(obj) {
    return isNullOrEmpty(obj);
}

function isNullOrEmpty(obj) {

    // must test type of base object first
    if (typeof obj == "undefined") {
        return true;
    }

    // immediate
    if (obj == undefined || obj == null) {
        return true;
    }

    // STRING
    return getStringValue(obj) == "";
}

/* ************************************************************************  */

//
// ## opens a secondary window to output log files etc
//
var secondary_window;
function open_secondary_window(){
    secondary_window = window.open('', '_blank');
    if(typeof(secondary_window)!="undefined"){
    // the browser has allowed the opening
        
        secondary_window.document.write('<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><title>FIN-LOG</title><style>body { padding:1em; } div { background-color: #eee; line-height: 1.3; font-family: Sans-Serif; padding: 2em; line-height: 1em; }</style></head><body><div if="logger"><h1>'+STORY+'</h1>'+FIN_framework.startingtime+'<br><br>');
        //+'</div></body></html>');  << tags to be closed... TBD
        for (var i in HISTORY.raw) {
			// puts current HISTORY content in the window
			write_in_secondary_window(HISTORY.raw[i]);
		}
    }
    else {
        // the browser has blocked it
        system_popup(UI_MESSAGES.alertwarning);
    }
}

// writes a line of text in the secondary window (SecondaryWindow)
function write_in_secondary_window(what){
    debug_out("SECONDARY: "+what,3);
    try{
        secondary_window.document.writeln(what+"<br>");
    }
    catch(err){
        trigger_error(ERROR_NOTFOUND);
    }
}

// prints debug information if DEBUG global variable is set >0 (see DEBUG)
function debug_out(it,verbosity){
    //to_stream('</br><i style="font-size: 9pt;">'+it+'</i></br>');
    if (DEBUG >= verbosity) {
        console.log(callerName() +" >> "+it.toString());
    }
    if (DEBUG >5){
        secondary_window_write(it);
    }
}

//// funzione che scrive nella finestra di stream di testo TBD
// ora non usata
function to_stream(what) {
    ;
    //$(popupwin.document.body).append(what);
}

//// WATCH per un oggetto
function ispeziona_oggetto(ogg) {
    debug_out("* obj: "+object_name(ogg).toUpperCase()+"\n - typ:"+ogg.typ+"\n - syn: "+ogg.syn+"\n - az: "+"\n v_0:"+ogg.v_0+"\n v_1:"+ogg.v_1+"\n v_2:"+ogg.v_2+"\n v_3:"+ogg.v_3+"\n "+"\n - punta   -->:\t"+ogg.lnkTo+"\n - puntato <--:\t"+ogg.lnkFr,1);
}

//// ispeziona tutti gli oggetti definiti
function ispeziona_allobjects(vettogg) {
    debug_out("* OGGETTI: ",1);
    for (i in vettogg) {
        //if ( vettogg[i].typ.indexOf("verb") >=0 ) {
//            debug_out( vettogg[i].syn[0],1 );
 //           debug_out( vettogg[i].lnkTo,1 );
        //}
        ispeziona_oggetto( vettogg[i]);
    }
}

// inspection of the in-scope objects
function ispeziona_scope (oggpart) {
    debug_out("* ISPEZIONA_SCOPE:",1);
    var objs = inscope_objs_list( oggpart );
    for (var i in objs) {
        ispeziona_oggetto(eval(objs[i]));
//        ispeziona_oggetto(eval(objs[i]));
    }
    //ispeziona_allobjects(objs);
}

// inspection of current verbs synonims
function ispeziona_verbi() {
    for (var i=0; i<4; i+=1) {
        var verb = "v_"+i;
        for (j in eval(verb).syn) {
            debug_out(verb+": "+eval(verb).syn[j]+"\n",1);
        }
    }
    
}




//POSIZIONE PLAYER TBD
function POS() {
    debug_out(FOCUS.lnkTo[FOCUS.lnkTo.length-1]+">>"+inscope_objs_list(FOCUS),1);
}

