// # debugger functions


//// TBD prova
function prova() {
   console.log("PROVA BUTTON"); 
//TBD    document.onclick.stopPropagation();
};


//// pulsante TRY
function try_button() {
/// TBD
    debug_out("TRY BUTTON PRESSED",1);
    if (typeof(CRAWLER)!="undefined") {    
        if (!CRAWLER.working) {
			// TBD
            CRAWLER.start();
        }
        else {
            CRAWLER.stop();
        }
    }
    else {
        trigger_error(ERROR_GEN);
    }
};


//
// ## secondary window opener
//
function open_secondary_window(){
    if ( FIN_framework.secondary_window == false ) {
        FIN_framework.secondary_window = window.open();
        secondary_window_write(FIN_framework.version+": "+STORY);
    }
};

//
// ## secondary window writer
//
function secondary_window_write(whattowrite){
    if ( FIN_framework.secondary_window == false ) {
        open_secondary_window();
    }
    //$('#SECONDARYWIN').after('<br>'+whattowrite);
    FIN_framework.secondary_window.document.write(whattowrite+"<br>");
};




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
};

function trim(inString) {
    return inString.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

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
};

function fLeft(inText, delim) {
    inText = getStringValue(inText);
    delim = getStringValue(delim);
    var outText = "";
    var theSpot = inText.indexOf(delim);
    if (theSpot > -1) {
        outText = inText.substring(0, theSpot);
    }
    return outText;
};

function fLeftBack(inText, delim) {
    inText = getStringValue(inText);
    delim = getStringValue(delim);
    var outText = "";
    var theSpot = inText.lastIndexOf(delim);
    if (theSpot > -1) outText = inText.substring(0, theSpot);
    return outText;
};

function fRight(inText, delim) {
    inText = getStringValue(inText);
    delim = getStringValue(delim);
    var outText = "";
    var theSpot = inText.indexOf(delim);
    if (theSpot > -1) {
        outText = inText.substring(theSpot + delim.length, inText.length);
    }
    return outText;
};

function fRightBack(inText, delim) {
    inText = getStringValue(inText);
    delim = getStringValue(delim);
    var outText = "";
    var theSpot = inText.lastIndexOf(delim);
    if (theSpot > -1) outText = inText.substring(theSpot + delim.length, inText.length);
    return outText;
};

function fBetween(inText, delimLeft, delimRight) {
    return fLeft(fRight(inText, delimLeft), delimRight);
};

function isNoE(obj) {
    return isNullOrEmpty(obj);
};

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
};

/* ************************************************************************  */


// prints debug information if DEBUG global variable is set >0 (see DEBUG) to the console
function debug_out(it,verbosity){
    //to_stream('</br><i style="font-size: 9pt;">'+it+'</i></br>');
    if (DEBUG >= verbosity) {
        console.log(callerName() +" >> "+it.toString());
    }
    if (FIN_framework.secondary_window != false){
        secondary_window_write(it);
    }
};

//// funzione che scrive nella finestra di stream di testo TBD
// ora non usata
function to_stream(what) {
    ;
    //$(popupwin.document.body).append(what);
};

//// WATCH per un oggetto
function ispeziona_oggetto(ogg) {
    debug_out("* obj: "+object_name(ogg).toUpperCase()+"\n - typ:"+ogg.typ+"\n - syn: "+ogg.syn+"\n - az: "+"\n v_0:"+ogg.v_0+"\n v_1:"+ogg.v_1+"\n v_2:"+ogg.v_2+"\n v_3:"+ogg.v_3+"\n "+"\n - punta   -->:\t"+ogg.lnkTo+"\n - puntato <--:\t"+ogg.lnkFr,1);
};

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
};

// inspection of the in-scope objects
function ispeziona_scope (oggpart) {
    debug_out("* ISPEZIONA_SCOPE:",1);
    var objs = inscope_objs_list( oggpart );
    for (var i in objs) {
        ispeziona_oggetto(eval(objs[i]));
//        ispeziona_oggetto(eval(objs[i]));
    }
    //ispeziona_allobjects(objs);
};

// inspection of current verbs synonims
function ispeziona_verbi() {
    for (var i=0; i<4; i+=1) {
        var verb = "v_"+i;
        for (j in eval(verb).syn) {
            debug_out(verb+": "+eval(verb).syn[j]+"\n",1);
        }
    }
    
};




//POSIZIONE PLAYER TBD
function POS() {
    debug_out(current_focus()+">>"+inscope_objs_list(FOCUS),1);
};

