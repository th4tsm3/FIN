//
// # global objects definitions
//
//
// ## debug status
//
// if DEBUG variable is not defined it is forced to '0' -> debug mode off
// verbosity levels: 0 (off=production), 1-minimum, up to 5-maximum
if (typeof(DEBUG)=="undefined") {
    var DEBUG=0;
};

//
// ## main FIN object: framework
//
var FIN_framework = {
    // version build
    version : "FIN 1-Goldfish",
    // Flag to be raised when FIN is printing on-screen
    printing : false,
    verbs_attr : ['v_0','v_1','v_2','v_3'],
    startingtime : "",
    // feedback message enabling
    FEEDBACK_MESSAGE : true,
    // understandable words dictionary: FIN_framework.DICTIONARY
    DICTIONARY : [],
    // consecutively failed inputs: global > FIN_framework.INPUT_FAILED
    INPUT_FAILED : 0,
    // time (turns) counter: global > FIN_framework.TIMELINE
    TIMELINE : 0,
    // interface default settings
    UI_settings : {
        "stylesheet" : "styles/style_bright.css",
        "wordhighlight" : true,
        "fontsize" : 14,
        "showclock" : false,
        "fullscreen" : false,
        "marginfactor" : 2.1,
        "soundplayer" : false
    },

    // user-framework interaction history trackers: HISTORY raw, input, done
    HISTORY : {
        raw : [],
        done : [],
        input : []
    },

    // all the generated objects are listed here: FIN_framework.ALLOBJECTS
    ALLOBJECTS : [],
    // specific story name identifier (prefix + 6 letters substring + _settings/_bookmark): STORY_STORAGE
    STORY_STORAGE : "",
    // default input method (for the UI startup): keyboard, touch, (system)
    UI_INPUT : "keyboard",
    // when set to "false" locks interface input methods (after fatal error for example)
    UI_ENABLED : true,

    //
    // ## UI timings and other figures
    //
    UI_FIGURES : [
        // 0 / scrolling delay
         2700,
        // 1 / word correction %
         50,
        // 2 / max char length of input string
         100,
        // 3 / fading time for verb icons
         500,
        // 4 / non-active UI object opacity
         0.4,
        // 5 / text fade-in effect delay
         2200,
        // 6 / ms delay for putchar in slow-print
         27,
        //  7 / ms delay for message fade-in & fade-out
         1500,
        //  8 / ms delay for message to be shown 
         2500,
        //  9 / ms delay for updating the real clock
         1000,
        // 10 / ms fading for feedback & inputwidgets when interrupted (quick)
         200,
        // 11 / ms for the CRITTER to execute its chores
         250,
        // 12 / ms for very slow messages
         4600
    ]
};

//
// ## layout object
//
// main page html structure and related definitions:
// image zone (up) if present (see global variable)
var FIN_layout = {
    //0 #imagezonecontainer
    imagezonecontainer : "#imagezonecontainer",
    //0 #imagezone
    imagezone : "#imagezone",
    //0 #main_div
    main_div : "#main_div",
    //1   #outputarea
    outputarea : "#outputarea",
    //2     #previously
    previously : "#previously",
    //2     #placeholder
    placeholder : "#placeholder",
    //2     #separator
    separator : "#separator",
    //2     #upto
    upto : "#upto",
    //1   #inputarea
    inputarea : "#inputarea",
    //2     #feedback
    feedback : "#feedback",
    //3       #inputwidgets
    inputwidgets : "#inputwidgets",
    //4         #menu
    //4         #inputstring
    inputstring : "#inputstring",
    //4         #verb_icons
    verb_icons : "#verb_icons",
    //4         #reqtxtinput
    reqtxtinput : "#reqtxtinput",
    //4         #CLOCK
    realclock : "#CLOCK",
    //1   #topgradient
    topgradient : "#topgradient",
    //1   #sysmessage
    sysmessage : "#sysmessage",
    //1   #overlaywin
    //2     #tabcont
    overlaywin : "#overlaywin",
    //3       #overlaywin_a, b, c
    overlay_a : "#overlay_a",
    overlay_b : "#overlay_b",
    overlay_c : "#overlay_c",
    configuration : "#configuration",
    //3       #overlay_content
    overlay_content : "#overlay_content",
    //4         #closeoverlay
    closeoverlay : "#closeoverlay",
    //1   #fader
    fader : "#fader",
    //1   #noaudioicon
    noaudioicon : "#noaudioicon",
    //1   #audioplayer
    audioplayer : "#audioplayer",
    //2     #audiofile
    audiofile : "#audiofile",
    // placeholder text for reqtxtinput
    UI_TXTIN : "...",
    // pseudo-window state
    UI_OVERLAY : false
};

//
// ## basic FIN object constructor
//
function fin_object(nome){
    // object type:
    // object -> generic
    // player -> only one per story, ... TBD
    // focus -> identifies the point of view (to calculate objects in scope)
    // verb -> special objects that are used to trigger actions
    // closed -> a "closed" object stops scope propagation 
    this.typ = ["object"];
    // synonims
    this.syn = [];
    // points to...
    this.lnkTo = [];
    // is pointed from...
    this.lnkFr = [];
    // connected verbs: type 0 / automatically triggered
    this.v_0 = [];
    // connected verbs: type 1 / superficial interaction
    this.v_1 = [];
    // connected verbs: type 2 / light interaction
    this.v_2 = [];
    // connected verbs: type 3 / heavy interaction
    this.v_3 = [];
    // first synonym is equal to object name (automatically pushed-in the synonims array by the object constructor)
    this.syn.push(nome.toString());
    // each generated object is stored in the global array: FIN_framework.ALLOBJECTS
    FIN_framework.ALLOBJECTS.push(this);
};
//
//  # CRITTER
//
// The CRITTER manages sequential instructions execution
var CRITTER = {
    // staus flags
    alive : 0,
    run : false,
    runner : function(yesno) {
        // if has some instructions in its queue, executes them one by one
        if ( CRITTER.chores.length > 0 && yesno && FIN_framework.UI_ENABLED) {
            if (!FIN_framework.printing){
                try{
                    eval(CRITTER.chores.shift().replace(/\\"/g,'"'));
		            if (CRITTER.chores.length>0){
                        CRITTER.runner(true);
                    }
                    else {
                        CRITTER.runner(false);
                    }
                }
                catch(err){
                    trigger_error(FIN_localization.ERROR_RAW+" "+err);
                }
            }
        }
    },
    // commands queue to be executed
    chores : []
};
//
// # The StoryWalker looks for all the possible playing paths
//

//
// ## StoryWalker critters constructor
//
// initial focus object and objects array are mandatory, id is optional (default value is 0, which forces a new id definition)
//

//
// ## StoryWalker constructor
// 
var StoryWalker = function(focus, objectsArrayParam, identifier) {
    this.id = identifier;
    this.focus = focus;
    this.objectsArray = objectsArrayParam;
}

//
// StoryWalkers collection with methods is added to the FIN_framework object
//
FIN_framework.STORYWALKERS = {
    checkids : function(iddef) {
                for (var i=0; i < FIN_framework.STORYWALKERS.Walkers.length; i+=1) {
                    if (FIN_framework.STORYWALKERS.Walkers[i].id == iddef) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            },
    createWalker : function(entryPointFocus, objectsArrayParameter, id=0) {
        // StoryWalker-id is a unique number: 0000--9999
        function define_id() {
            var iddef = 0;
            while ( iddef == 0 || iddef > 9999 || FIN_framework.STORYWALKERS.checkids(iddef) ) {
                iddef = Math.floor(Math.random()*10000);
            }
            return iddef;
        }
        if ( this.Walkers.length >= this.maxWalkers ) {
            return 1;
        }
        if ( typeof(entryPointFocus) == "undefined" || typeof(objectsArrayParameter) == "undefined" ) {
            trigger_error(FIN_localization.ERROR_FORMAT);
            return 1;
        }
        if ( id == 0 || FIN_framework.STORYWALKERS.checkids(id) ) {
            id = define_id();
        }
        var newWalker = new StoryWalker(entryPointFocus, objectsArrayParameter, id);
        this.Walkers.push(newWalker);
        return 0;
    },
    walk : function() {
        ;//// WORKING HERE TBD
    },
    Walkers :  [],
    maxWalkers : 10
};

//
// ## fuzzy decision maker: throws a die
//
// parameter resembles the number of possibilities among we have to choose
function take_decision(possibilities) {
    if (typeof(possibilities)=="undefined") {
        return "Error";
    }
    var die = Math.floor(Math.random()*10000);
    var range = 10000 / possibilities;
    var take = 1;
    while( take*range < die ) {
        take +=1;
    }
    // possibilities enumeration starts from 0, so the return value is reduced by 1
    return take-1;
};

//
// ## deep copy
//
// returns a deep copy of a json object
function deep_copy(what){
    // make a deep copy of an object
    try {
        return JSON.parse(JSON.stringify( what ));
    }
    catch (ERR) {
        trigger_error("deep copy failed! "+ERR);
        return 1;
    }
};


// debug
function walkers(){
    FIN_framework.STORYWALKERS.Walkers.forEach( function(el){
        console.log(el.id)
    } );
}
//
// # listeners definitions
//
// ## listener: document.ready
//
// sets up display, prints "intro" text, etc.
$(document).ready(function() {
	debug_out("document.ready",1);
	var now = new Date;
    FIN_framework.startingtime = now;
    // just for debug intents: adds special purpose interface button
    if (DEBUG > 1) {
        $(FIN_layout.inputwidgets).append(
            '<div style="position: fixed; bottom: 0px; left: 0px; height: 2em; z-index:100;">'+
            '<span class="mybutton" onClick="DEBUGGER_button();">LOGGER</span>'+
            '</div>');
    }
    // step 1:
        if (bootstrap_UI_setup()) {
            // after a certain time removes the "curtain" (fader div) and gives the first output of the story
            setTimeout(function() {
                if (FIN_framework.UI_INPUT=="keyboard"){
                    adjust_for_keyb();
                }
                else {
                    adjust_for_touch();
                }
                // layout fine tuning setup
                layout_setup();
                // START variable must be defined (basic entry point)
                if (typeof(START)=="undefined") {
                    trigger_error(FIN_localization.ERROR_OBJNOTDEFINED+" START");
                }
                START=basesixtyfourdecode(START);
                // START content is pushed in the critter queue as first element
                CRITTER.chores.push(START);
                // removes the "curtain" (fader) element
                $(FIN_layout.fader).fadeOut(FIN_framework.UI_FIGURES[7] );
            }, FIN_framework.UI_FIGURES[7] );
            $(FIN_layout.inputarea).fadeTo(FIN_framework.UI_FIGURES[5],1);
            if ( $(FIN_layout.imagezonecontainer).css('display') == 'none' && FIXEDIMAGE ) {
                setup_image(FIXEDIMAGE);
            }
        }
        if ( !recall_data_in_browser(FIN_framework.STORY_STORAGE+'_settings') && !recall_data_in_browser(FIN_framework.STORY_STORAGE+'_bookmark') ) {
            overlaywin_change("open");
        }
});

//
// ## listener: mouse-click/touch
//
document.onclick = function (w) {
    debug_out("TOUCH/CLICK: "+w.clientX+'/'+w.clientY+" - "+w.target,4);
    // dynamic interface adjustment for click/tuch or keyboard
    if (w.target.id != FIN_layout.reqtxtinput.substr(1,FIN_layout.reqtxtinput.length) && w.target.id != FIN_layout.inputstring.substr(1,FIN_layout.inputstring.length)) {
        adjust_for_touch();
    }
    // stops slow-print effect if it is running
    if (typeof(slowPrinter.fifo)!='undefined') {
        if (slowPrinter.fifo.length > 0) {
            slowPrinter.stop();
        }
    }
    // stops the mouse-click/touch from further propagation in the DOM
    w.stopPropagation();
};

//
// ## listener: generic mouse-click/touch
//
// prevents text selection on double-click
document.addEventListener('mousedown', function (event) {
    $("html, body").stop(true,true);
    $(FIN_layout.upto).stop(true,true);
    if (event.detail > 1) {
        event.preventDefault();
    }
}, false);

//
// ## listener: keyboard-keypress
//
$( document ).keydown(function(key) {
    debug_out("KEYBOARD: "+key.which, 4);
    // stops auto-scrolling animation
    $("html, body").stop(true,true);
    $(FIN_layout.upto).stop(true,true);
    // preventing the first keypress from getting lost when switching from touch interface
    if ( $(FIN_layout.inputstring).css('display')=="none" && key.which<=90 && key.which>=48){
        $(FIN_layout.inputstring).val(key.key);
    }
    //
    // ### key [F5]
    //
    // code 116 key on keyboard (standard for browser-reload page) is locked if not in DEBUG mode.
    if (DEBUG == 0) {
        if (key.which == 116) {
            system_popup(FIN_localization.UI_MESSAGES.keylocked);
            key.preventDefault();
            return;
        }
    }
    //
    // ### key [F1] / [ESC]
    //
    // code 112 / 27 keys on keyboard (standard for "help") calls overlaywin/menu
    if (key.which == 112 || key.which == 27) {
        if ( $(FIN_layout.overlaywin).css('display') == 'none' ) {
            overlaywin_change("open");
        }
        else {
            overlaywin_change("close");
        }
        return;
    }
    //
    // ### key [F4]
    //
    // code 115 key on keyboard opens the secondary output window
    if (key.which == 115) {
        open_secondary_window();
        return;
    }
    // after all key checks gives focus to FIN_layout.inputstring
    $(FIN_layout.inputstring).focus();
    // if FIN_layout.feedback is shown
    if ( $(FIN_layout.feedback).css('display') != 'none' ) {
        $(FIN_layout.feedback).fadeOut(FIN_framework.UI_FIGURES[10]);
        $(FIN_layout.inputwidgets).fadeIn(FIN_framework.UI_FIGURES[10]);
    }
    if (FIN_layout.UI_OVERLAY && ( key.which == 8 || key.which == 46)) {
        overlaywin_change("close");
    }
    // stopping slow-print
    if (typeof(slowPrinter.fifo)!='undefined') {
        if (slowPrinter.fifo.length > 0) {
            slowPrinter.stop();
        }
    }
    // ignoring ctrl, shift, or other unuseful keys. Codes: 16, 17, 18, 37, 38, 39, 40
    if ( key.which != 16 && key.which != 17 && key.which != 18 && key.which != 37 && key.which != 38 && key.which != 39 && key.which != 40 ) {
        adjust_for_keyb();
    }
    if (FIN_framework.UI_ENABLED) {
        //
        // ### key [ENTER]
        //
        // code 13 launches inserted commands
        if (key.which == 13) {
            debug_out("Pressed ENTER key",3);
            if ( $(FIN_layout.inputstring).val().trim().length > 0 ) {
                command_input_manager( $(FIN_layout.inputstring).val(), "keyboard" );
            }
        }
    }
    else {
        // stops further keypress propagation
        key.preventDefault();
    }
});
//
// # Special effects: text slow-print
//
var slowPrinter = {
    timer : -1,
    count : 0,
    activetag : "",
    // flag to manage html tags
    intag : false,
    fifo  : [],
    // adds text to be printed to the buffer
    add : function(x){
        slowPrinter.count+=x.length;
        for (i in x) {
        slowPrinter.fifo.push(x[i]);
        }
    },
    // gets characters to be printed out of the buffer
    get : function(){
        var out = slowPrinter.fifo.shift();
        debug_out("SLOW-PRINT: "+slowPrinter.count.toString()+" "+out+" ... "+slowPrinter.fifo[0],4);
        if (out=='<') {
            if ( slowPrinter.fifo[0] =='/') {
                slowPrinter.intag = false;
            }
            // ignoring in case of <br> only TBD: non gestisce correttamente tutti i tag
            else if (slowPrinter.fifo[0]=='b' && slowPrinter.fifo[1]=='r'){
                out+=slowPrinter.fifo.shift();
                out+=slowPrinter.fifo.shift();
            }
            else {
                slowPrinter.intag = true;
            }
            while( slowPrinter.fifo[0]!='>' ) {
                out+=slowPrinter.fifo.shift();
            }
            if (slowPrinter.fifo[0]=='>') {
                out+=slowPrinter.fifo.shift();
            }
        }
        //else if (out=='&' && slowPrinter.fifo[0]!=' ') {
        else if (out=='&' && slowPrinter.fifo[0]!=' ') {
            while( slowPrinter.fifo[0]!=';' ) {
                out+=slowPrinter.fifo.shift();
            }
            if (slowPrinter.fifo[0]==';') {
                out+=slowPrinter.fifo.shift();
            }
        }
        var writeto = document.getElementById( FIN_layout.placeholder.substr(1) );
        slowPrinter.activetag = writeto.innerHTML.substr ( writeto.innerHTML.lastIndexOf('</') );
        if (slowPrinter.intag && writeto.innerHTML.indexOf('</')>=0) {
            writeto.innerHTML = writeto.innerHTML.substr( 0, writeto.innerHTML.lastIndexOf('</') ) + out + slowPrinter.activetag;
        }
        else {
            writeto.innerHTML += out;
        }
        slowPrinter.activetag = "";
        // manages scrolling effect
        if ( ! $(upto).visible(true, true) ) {
            $('html,body').scrollTop( $(upto).offset().top );
        }
        if (slowPrinter.fifo.length==0) {
            slowPrinter.stop();
        }
    },
    // delay time between two characters
    delay : function(ms) {
                slowPrinter.get();
                slowPrinter.count-=1;
                var l=slowPrinter.fifo.length;
                slowPrinter.timer = setTimeout( function(){
            // recursion: there is still text to be printed
            if (slowPrinter.count>0 && l>0) {
                slowPrinter.delay(ms);
            }
            // at the end, it stops
            else {
                slowPrinter.stop();
            }
        },ms);
    },
    // operations to be executed at the end:
    stop : function(){
        clearTimeout(slowPrinter.timer);
        // moves printed text to to "previously" area
        $(FIN_layout.previously).append( add_custom_html_tags( $(FIN_layout.placeholder).html() + slowPrinter.fifo.join('') , FIN_framework.DICTIONARY )+'<br>' );
        $(FIN_layout.placeholder).html("");
        slowPrinter.fifo=[];
        slowPrinter.count=0;
        // animated scroll-up effect
        CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(upto).offset().top }, "+FIN_framework.UI_FIGURES[0]+")" );
        FIN_framework.printing= false;
    }
};
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
            trigger_error(FIN_localization.ERROR_RAW+" "+err.message+" eval >> "+ogg);
        }
    }
    return;
};

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
        // new connection link-from/link-to setup
        connetti(dove.toLowerCase(),ogg.toLowerCase());    
    }
    return;    
};

//
// ## instruction: moves "player" special object
//
function plt(moveto) {
    debug_out(moveto,2);
    if ( eval(PLAYER.toLowerCase()).typ.indexOf("player") >= 0 ) {
        mov(PLAYER+','+moveto);
        // FOCUS special object manipulation, following player movement:
        // important: modifies the point of view!
        // current point of view is stored in the last position of the FOCUS.lnkTo array => substituted
        FOCUS.lnkTo.pop();
        FOCUS.lnkTo.push( moveto.toLowerCase() );
        debug_out("NEW FOCUS: "+current_focus(), 2);
        //FOCUS.lnkTo[FOCUS.lnkTo.length-1],2);
        return;
    }
    else {
        trigger_error(FIN_localization.ERROR_NOPLY);
    }
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
function sinonimo_to_oggetto (parola,vettore) {
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
	debug_out(callerName() +" >> "+"[!]");
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
    function parse_input_text( stringa , focus ) {
        if ( typeof(chiamante) == "undefined") {
            chiamante="doubleclick";
        }
        // records command history
        FIN_framework.HISTORY.raw.push(stringa+" / "+chiamante);
        if(typeof(secondary_window)!="undefined"){
			write_in_secondary_window("[ "+FIN_framework.TIMELINE+" ] "+stringa+" / "+chiamante);
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
        if (DEBUG >4 && typeof(secondary_window)!="undefined") {
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
    // >> now objs contains the object and found_verb the verb group
    corretta = corretta.trim().replace(/#/,"");
    debug_out("WATCH-correzione dell'input: "+corretta+" :V: "+found_verb+" soglia: "+FIN_framework.UI_FIGURES[1], 3);
    if (chiamante=="keyboard" && FIN_framework.FEEDBACK_MESSAGE) {
        msg( corretta );
    }
    return found_obj;
    }

    // verb icons "disabled"
    if (FIN_framework.UI_INPUT=="touch") {
        $(FIN_layout.verb_icons).fadeTo(FIN_framework.UI_FIGURES[3], FIN_framework.UI_FIGURES[4]);
    }
    // verifies maximum input length
    if (stringa.length > FIN_framework.UI_FIGURES[2]) {
        trigger_error(FIN_localization.ERROR_INPUT);
    }
    debug_out(stringa+" << ["+chiamante+']',2);
    var undef;
    var found_verb=false;
    var oggettiinscope = false;
    var found_composite = false;
    // pre-parsing: splitting multiple instructions
    // check if there is any grammatical separator: , . ;
    var tmp=false;
    if ( /;|,|\./.test(stringa) ) {
        var tmp = stringa.replace(/;|\./g,",").split(',');
    }
    if ( tmp ) {
        for (i in tmp) {
            debug_out("MULTIPLE INSTRUCTIONS "+i+": "+tmp[i],2);
        }
    }

    // the identified objects are stored here
    vettoreinput = parse_input_text(stringa.toLowerCase(),FOCUS);
    actions = "";
    // default action: in case no verbs have been found -> v_1
    if (found_verb == false) {
        found_verb="v_1";
    }
    debug_out("FOUND-VERB: "+found_verb, 3);
    vettoreinput = elimina_elementi_ripetuti(vettoreinput);
    debug_out("INPUT CORRETTO E DEPURATO: "+vettoreinput+"/Verb: "+found_verb+" soglia: "+FIN_framework.UI_FIGURES[1], 3);
    // STEP 5: looks for actions linked to the verb for each identified object
    for (var i in vettoreinput) {
        if ( vettoreinput[i] !=false && found_verb!=false ) {
            // takes out the instruction from the object if it's not a special one _...
            if ( typeof(vettoreinput[i][found_verb][0]) != "undefined" ) {
                actions += vettoreinput[i][found_verb].shift();
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

//
// # grammar
// 
// ## 2-words-alike?
function stima_similitudine(a,b) {
// ex: stima_similitudine("bosco","boschetto")
    debug_out("stima_similitudine "+a+" vs "+b,3);
    if ( (typeof(a)!="string") || (typeof(b)!="string") )
        return false;
    var indb;
    var sim = 0;
    var va = a.split('');
    var vb = b.split('');
    // compares va and vb end eventually switches them
    if (vb.length > va.length) {
        var switcher = va;
        va = vb;
        vb = switcher;
    }
    var qmax = 100 / va.length;
    // for each character
    for ( var c in va ) {
        if ( va[c] == vb[c] ) {
            sim += qmax;
        }
        else {
            indb = vb.indexOf( va[c] );
            if ( indb > 0 ) {
                // calculates the proximity value from the relative distance in the two arrays
                sim += qmax / (Math.abs(c-indb));
            }
        }
    }
    return sim;
};

//
// ## word-changer
//
// tries to guess the most similar word
function correttore_parole (paroladacontrollare,dizionario,soglia) {
// ex: correttore_parole ("boxco",FIN_framework.DICTIONARY) >> bosco
    // if the word is very short it is returned as it is
    if (paroladacontrollare.length < 4){
        return paroladacontrollare;
    }
    debug_out("correttore_parole "+paroladacontrollare+"/"+soglia,3);
    if (typeof(paroladacontrollare)!="string"){
        trigger_error(FIN_localization.ERROR_OBJ);
    }
    paroladacontrollare= paroladacontrollare.trim();
    var correzioneprobabile;
    var similitudine = 0;
    var ultimocalcolo;
    var tmpvect = [];
    // for each word in the dictionary
    dizionario.map(
        function (og) {
            ultimocalcolo = stima_similitudine ( paroladacontrollare , og );
            // considered only if above the % threshold
            if ( ultimocalcolo > similitudine && ultimocalcolo >= soglia ) {
                correzioneprobabile = og;
                similitudine = ultimocalcolo;
            }
        } );
    // returns the new word
    return correzioneprobabile;
};

// 
// ## substring substitution
//
// Mozilla: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
function replaceString(trova, sostituisci, qui) { 
    return qui.split(trova).join(sostituisci);
};
//
// # interface management functions
//
// ## system message pseudo pop-up
//
// "qna" parameter can be used to inject code to manage question and answer cases, timeout is measured in seconds
// ex: qnacode = '<a onClick="\
//    $(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]);\
//    ">Y</a>/<a onClick="\
//    $(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]);\
//    ">N</a>'
// timeout [sec]
function system_popup(text, qnacode, timeout){
    debug_out(text+" / "+timeout+ " / "+qnacode);
    // if already present (only one popup at a time can be present)
    if ($(FIN_layout.sysmessage).css('display')!='none'){
        $(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[2]);
        setTimeout( function (){'system_popup('+text+','+qnacode+', '+timeout+')', FIN_framework.UI_FIGURES[2]} );
    }
    if (FIN_layout.UI_OVERLAY) {
        $(overlaywin).fadeTo(FIN_framework.UI_FIGURES[7],FIN_framework.UI_FIGURES[4]);
    }
    if (typeof(timeout) == 'undefined' ) {
        // default timeout is 30 seconds
        timeout = 30;
    }
    // if "qna" is "undefined" the window fades away (informative popup)
    if (typeof(qnacode) == 'undefined' ) {
        $(FIN_layout.sysmessage).html(text);
        $(FIN_layout.sysmessage).fadeIn(FIN_framework.UI_FIGURES[7]);
        setTimeout('$(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]); if (FIN_layout.UI_OVERLAY) { $(overlaywin).fadeTo(FIN_framework.UI_FIGURES[7],1); if (FIN_layout.UI_OVERLAY) {$(overlaywin).fadeIn(FIN_framework.UI_FIGURES[7]);} }', FIN_framework.UI_FIGURES[12]);
        // ridondanza? TBD setTimeout('if $(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]); if (FIN_layout.UI_OVERLAY) { $(overlaywin).fadeTo(FIN_framework.UI_FIGURES[7],1); if (FIN_layout.UI_OVERLAY) {$(overlaywin).fadeIn(FIN_framework.UI_FIGURES[7]);} }', FIN_framework.UI_FIGURES[12]*2);
    }
    else {
        $(FIN_layout.sysmessage).html(text+'<br>'+qnacode);
        $(FIN_layout.sysmessage).fadeIn(FIN_framework.UI_FIGURES[7]);
        setTimeout('$(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]); if (FIN_layout.UI_OVERLAY) { $(overlaywin).fadeTo(FIN_framework.UI_FIGURES[7],1); if (FIN_layout.UI_OVERLAY) {$(overlaywin).fadeIn(FIN_framework.UI_FIGURES[7]);} }', timeout*1000);
    }
};

//
// ## full-screen questioning
//
// asks for activation of full-screen mode via system_popup (fullscreen requires user interaction)
function toggleFull(){
    debug_out("FULLSCREEN",1);
    system_popup(FIN_localization.UI_MESSAGES.fullscreenrequest,'<a onClick="$(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]);screenfull.request();">'+FIN_localization.UI_MESSAGES.yes+'</a>/<a onClick="$(FIN_layout.sysmessage).fadeOut(FIN_framework.UI_FIGURES[7]);">'+FIN_localization.UI_MESSAGES.no+'</a>');
};

//
// ## word highlighting
//
// toggles word-highlighting or forces it to on/off (true/false)
function toggle_wordhighlight(force){
    debug_out("WD-HL change "+force,1);
    // forcing
    if (force==true){
        FIN_framework.UI_settings.wordhighlight = true;
        $("wd").replaceTagName("wdh");
        return;
    }
    else if (force==false){
        FIN_framework.UI_settings.wordhighlight = false;
        $("wdh").replaceTagName("wd");
        return;
    }
    // toggling
    if (FIN_framework.UI_settings.wordhighlight) {
        FIN_framework.UI_settings.wordhighlight = false;
        $("wdh").replaceTagName("wd");
        system_popup(FIN_localization.UI_MESSAGES.wordhlno);
    }
    else {
        FIN_framework.UI_settings.wordhighlight = true;
        $("wd").replaceTagName("wdh");
        system_popup(FIN_localization.UI_MESSAGES.wordhlyes);
    }
};

//
// ## shows or hides options pseudo-window
//
function overlaywin_change(todo) {
    debug_out("OVERLAY-request: "+todo,3);
    var arr = get_display_size();
    if (todo=="open"){
        $(FIN_layout.outputarea).fadeTo("slow",FIN_framework.UI_FIGURES[4]/2);
        $(FIN_layout.inputarea).fadeTo("slow",FIN_framework.UI_FIGURES[4]/2);
        $(FIN_layout.overlaywin).show("slow","swing" );
        // scrolls to the top of the overlaywin contents
        $(FIN_layout.overlaywin).animate( { scrollTop: 0 } );
        FIN_layout.UI_OVERLAY=true;
    }
    else {
        $(FIN_layout.overlaywin).hide("slow","swing");
        $(FIN_layout.outputarea).fadeTo("slow",1);
        $(FIN_layout.inputarea).fadeTo("slow",1);
        FIN_layout.UI_OVERLAY=false;
    }
    // Adds FIN version information to the overlay window (operates only at the 2nd opening)
    $("#FINVERSION").html(FIN_framework.version);
};

//
// ## overlaywin commands: change stylesheet
//
function overlaywin_change_stylesheet(to) {
    debug_out("STYLESHEET CHANGE-TO: "+to,1);
    // changes stylesheet reference
    $("#css_sheet[rel=stylesheet]").attr("href", to);
    // timeout set for DOM load/startup synchronization
    setTimeout(function(){
        // selected stylesheet effective load check, based on the presence of a tag-style with the same basename of the stylesheet file in the ./styles/ directory
        try{
            var selectors_list = getAllCssSelectors();
            var tmp = to.split('.')[0];
            tmp = tmp.split('/')[tmp.split('/').length-1];
            if ( selectors_list.indexOf(tmp) >= 0 ) {
                debug_out("stylesheet found");
            }
        }
        catch (ERR) {
            debug_out("stylesheet found");
            // system popup to inform of the stylesheet load failure
            system_popup( FIN_localization.ERROR_NOTFOUND);
            debug_out(ERR, 1);
        }
        // changes icons style reference
        // white icons
        if ( $(".icons_color").css("color") == "rgb(255, 255, 255)" ){
            $(FIN_layout.verb_icons).html(FIN_localization.verb_buttons.white);
        }
        // black icons
        else if ( $(".icons_color").css("color") == "rgb(0, 0, 0)" ){
            $(FIN_layout.verb_icons).html(FIN_localization.verb_buttons.black);
        }
        // default (black)
        else {
            $(FIN_layout.verb_icons).html(FIN_localization.verb_buttons.black);
        }
    },FIN_framework.UI_FIGURES[7]);
};

//
// ## gets display info to adapt the elements to the current view
//
function get_display_size() {
    debug_out("getting display-size info",3);
    var txts = parseFloat($(FIN_layout.placeholder).css("font-size"));
    if (document.body.style.fontSize == "") {
        document.body.style.fontSize = txts+"px";
    }
    return [
        // 0 returns height of browser viewport
        parseInt( $(window).height() ),
        // 1 returns width of browser viewport
        parseInt( $(window).width() ),
        // 2 returns height of HTML document
        parseInt( $(document).height() ),
        // 3 returns width of HTML document
        parseInt( $(document).width() ),
        // 4 font-size
        txts
        ];
};

//
// ## adds custom html tags a(wd or wdh) to the text to recognize word-click/touch
//
function add_custom_html_tags( text , dizionario ) {
    var raw_split = text.split(/([ '\.])/);
    var got_words = text.split(/\b/);
    var out = "";
    for (i in raw_split) {
        // deletes tags and punctuation for comparison
        var epurated = raw_split[i].replace(/(<\/{0,1}\w*>)/g, "").replace(/[\.,;!\?]/g,"").trim();
        var epuratedLowercased = epurated.toLowerCase();
        debug_out(raw_split[i]+" // "+epuratedLowercased+" /?/ "+isNullOrEmpty(epurated),3);
        // it's not a word, copy as it is
        if ( isNullOrEmpty(epurated) ) {
            out += raw_split[i];
        }
        else {
            // if it's included in the dictionary, adds the <wd> tag
            if ( dizionario.indexOf(epuratedLowercased) >= 0 ) {
                if (FIN_framework.UI_settings.wordhighlight) {
                    out += "<wdh onClick=\'pick_a_word(\""+ epuratedLowercased +"\");\'>"+ raw_split[i] +"</wdh>";
                }
                else {
                    out += "<wd onClick=\'pick_a_word(\""+ epuratedLowercased +"\");\'>"+ raw_split[i] +"</wd>";
                }
            }
            else {
                out += raw_split[i];
            }
        }
    }
    return out;
};

//
// ## input-icons: verbs
//
// ### verbs group 1
//
function verb1 () {
    if (FIN_framework.UI_ENABLED) {
        var pre = $(FIN_layout.inputstring).val();
        // invio il comando v_1 insieme al contenuto preacquisito della stringa input
        command_input_manager( v_1.syn[0]+" "+ pre.toLowerCase() , "touch");
    }
};
//
// ### verbs group 2
//
function verb2 () {
    if (FIN_framework.UI_ENABLED) {
        var pre = $(FIN_layout.inputstring).val();
        // se era gia` stato indicato un verbo pulisco e aggiungo il nuovo
        command_input_manager( v_2.syn[0]+" "+ pre.toLowerCase() , "touch" );
    }
};
//
// ### verbs group 3
//
function verb3 () {
    if (FIN_framework.UI_ENABLED) {
        var pre = $(FIN_layout.inputstring).val();
        // se era gia` stato indicato un verbo pulisco e aggiungo il nuovo
        command_input_manager( v_3.syn[0]+" "+ pre.toLowerCase() , "touch" );
    }
};

//
// ## realclock show or hide
//
function toggle_realclock() {
    if ( $(FIN_layout.realclock).css('display') != 'none' ) {
        $(FIN_layout.realclock).hide();
        system_popup( FIN_localization.UI_STR.clockno );
    }
    else {
        $(FIN_layout.realclock).show();
        system_popup( FIN_localization.UI_STR.clockyes );
    }
};

// TBD-TBC
function right_UI_button() {
    adjust_for_keyb();
    // resets text in right UI button
    $(FIN_layout.reqtxtinput).html(FIN_layout.UI_TXTIN);
    // resets text in input string space
    $(FIN_layout.inputstring).val("");
};



//
// ## cleans up input space
//
function clr() {
    if (FIN_framework.UI_ENABLED) {
        $(FIN_layout.inputstring).val("");
        $(FIN_layout.reqtxtinput).fadeOut(FIN_framework.UI_FIGURES[3], function(){ $(this).text(FIN_layout.UI_TXTIN).fadeIn(FIN_framework.UI_FIGURES[3]); });
    }
};

//
// ## feedback string visualization
//
function msg(text) {
    debug_out(text,2);
    $(FIN_layout.inputwidgets).fadeTo("slow", FIN_framework.UI_FIGURES[4]);
    $(FIN_layout.feedback).html(text.replace(/_/g," ")).fadeIn(FIN_framework.UI_FIGURES[7]);
    setTimeout('$(FIN_layout.feedback).fadeOut('+FIN_framework.UI_FIGURES[7]+'); $(FIN_layout.inputwidgets).fadeTo("slow", 1);', FIN_framework.UI_FIGURES[8] );
};

//
// ## real-clock updater
//
function clock_update() {
    var clk = new Date();
    var h = clk.getHours();
    var m = clk.getMinutes();
    var s = clk.getSeconds();
    if (m < 10) {
        m="0"+m.toString();
    }
    if (s < 10) {
        s="0"+s.toString();
    }
    $(FIN_layout.realclock).html( h+":"+m );
    if (!FIN_framework.printing && CRITTER.chores.length>0) {
        CRITTER.runner(true);
    }
};

//
// ## identifies click/touch on a word in the text stream (works with tags)
//
function pick_a_word(arg) {
    if (FIN_framework.UI_ENABLED) {
        debug_out("CLICKED/TOUCHED WORD: "+arg.toLowerCase(),4);
        $(FIN_layout.verb_icons).fadeTo(FIN_framework.UI_FIGURES[3], 1.0);
        // applies graphic effects and shows word in "FIN_layout.inputarea"
        $(FIN_layout.verb_icons).fadeTo(FIN_framework.UI_FIGURES[3], 1.0);
        $(FIN_layout.inputwidgets).fadeOut(FIN_framework.UI_FIGURES[3], function(){
            $(FIN_layout.reqtxtinput).text(arg);
            $(this).fadeIn(FIN_framework.UI_FIGURES[3]);
        });
        var pre = $(FIN_layout.inputstring).val().toLowerCase();
        if ( ! pre.match(arg.toLowerCase()) ) {
            $(FIN_layout.inputstring).val( pre + " " + arg);
            $(FIN_layout.verb_icons).fadeTo(FIN_framework.UI_FIGURES[3], 1);
        }
        // on 2nd click, v_1 interaction is fired as default
        else {
            command_input_manager( v_1.syn[1]+" "+ pre.toLowerCase() );
        }
    }
};

//
// ## adjusts UI for the keyboard input
//
function adjust_for_keyb() {
    debug_out("ADJUST UI FOR KEYBOARD, "+FIN_framework.UI_INPUT,3);
    if (FIN_framework.UI_INPUT=="keyboard") {
        return;
    }
    // hides icons & show FIN_layout.inputstring
    $(FIN_layout.reqtxtinput).show("slow","swing");
    $(FIN_layout.verb_icons).hide("slow","swing");
    $(FIN_layout.verb_icons).fadeTo("slow", FIN_framework.UI_FIGURES[4]);
    $(FIN_layout.inputstring).show("slow","swing");
    FIN_framework.UI_INPUT="keyboard";
};

//
// ## adjusts UI for the touch input
//
function adjust_for_touch(){
    debug_out("ADJUST UI FOR TOUCH, "+FIN_framework.UI_INPUT,3);
    if (FIN_framework.UI_INPUT=="touch") {
        return;
    }
    $(FIN_layout.reqtxtinput).show("slow","swing");
    $(FIN_layout.verb_icons).show("slow","swing");
    $(FIN_layout.inputstring).hide("slow","swing");
    FIN_framework.UI_INPUT="touch";
};

//
// ## font set increase
//
function font_increase(){
    var size = $("body").css("font-size");
    debug_out("Font "+size,2);
    var newSize = parseInt(size.replace(/px/, "")) + 1;
    $("body").css("font-size",newSize+'px');
    // FIN_layout.inputstring must be explicitly targeted (why? TBD)
    $(FIN_layout.inputstring).css("font-size", newSize+'px');
    return;
};

//
// ## font set decrease
//
function font_decrease(){
    var size = $(FIN_layout.placeholder).css("font-size");
    debug_out("Font "+size,2);
    var newSize = parseInt(size.replace(/px/, "")) - 1;
    $("body").css("font-size",newSize+'px');
    // FIN_layout.inputstring must be explicitly targeted (why? TBD)
    $(FIN_layout.inputstring).css("font-size", newSize+'px');
    return;
};

//
// ## sets content of the overlaywin with some visual effects
//
function set_overlay_content(what){
    $(FIN_layout.overlay_content).fadeOut(FIN_framework.UI_FIGURES[10], function(){
    $(FIN_layout.overlay_content).html(what);
    $(FIN_layout.overlay_content).fadeIn(FIN_framework.UI_FIGURES[10]);
    });
};

//
// ## cleans all the output areas
//
function outputarea_cleanup() {
    $(FIN_layout.previously).html('');
    $(FIN_layout.placeholder).html('');
};

//
// ## initial UI building and tuning
//
function bootstrap_UI_setup() {
    // clock start, setting update interval (ms)
    FIN_layout.realclock_interval=setInterval("clock_update()",FIN_framework.UI_FIGURES[9]);
    // setting overlaywin tab denominations
    $(FIN_layout.overlay_a).html(FIN_localization.UI_TABHLP);
    $(FIN_layout.overlay_b).html(FIN_localization.UI_TABSET);
    $(FIN_layout.overlay_c).html(FIN_localization_2.UI_TABABT);
    // default overlay content:
    $(FIN_layout.overlay_content).html( FIN_localization_3.MENU_HELP );
    // setting default tab: a, or b, or c 
    $(FIN_layout.overlay_a).addClass('atab');
    // put default message on "FIN_layout.reqtxtinput"
    $(FIN_layout.reqtxtinput).html(FIN_layout.UI_TXTIN);
    // takes cookie-stored settings if available and overwrites standard "FIN_framework.UI_settings"    
    recall_settings();
    return true;
};

//
// ## wraps all dynamic setups of the graphical layout
//
function layout_setup() {
    $(FIN_layout.inputstring).css("width", parseInt($(FIN_layout.previously).css('width'))*4/5+"px" );
    if (typeof(FIXEDIMAGE)!="undefined") {
        if (FIXEDIMAGE>0){
            setup_image(FIXEDIMAGE);
        }
    }
    // fine tuning lower stop-point for the output stream
    $(FIN_layout.separator).css('margin-bottom', parseInt($(FIN_layout.inputarea).outerHeight()) * FIN_framework.UI_settings.marginfactor + 'px' );

};

//
// ## get all defined CSS selectors
//
// useful to implement checks on css rules definition
function getAllCssSelectors() {
    var ret = [];
    for(var i = 0; i < document.styleSheets.length; i++) {
        var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
        for(var x in rules) {
            if(typeof rules[x].selectorText == 'string') ret.push(rules[x].selectorText);
        }
    }
    return ret;
};

//
// ## sound play manager
//
function play_sound(soundobject) {
// html must contain:
// <embed src="piece.wav" autostart="false" width="0" height="0" id="sound1" enablejavascript="true" enablejavascript="true"/>
    if (typeof(soundobject)=="string"){
        // if sound data is base64 encoded
        var sound = new Audio("data:audio/wav;base64,"+soundobject);  
    }
    else {
        var sound = document.getElementById(soundobject);
    }
    try{
        sound.Play();
    }
    catch(err){
        trigger_error(FIN_localization.ERROR_NOTFOUND+'\n'+sound);
    }
};

//
// ## toggles audioplayer html5 standard interface visualization
//
function toggle_audioplayer(){
    debug_out("AUDIO");
    if (!FIN_framework.UI_settings.soundplayer){
        FIN_framework.UI_settings.soundplayer=true;
        $(FIN_layout.audioplayer).fadeIn(FIN_framework.UI_FIGURES[7]);
        system_popup(FIN_localization.UI_STR.playeryes);
        $(FIN_layout.noaudioicon).fadeOut(FIN_framework.UI_FIGURES[7]);
        $(FIN_layout.audioplayer)[0].load();
    }
    else {
        FIN_framework.UI_settings.soundplayer=false;
        $(FIN_layout.audioplayer).fadeOut(FIN_framework.UI_FIGURES[7]);
        system_popup(FIN_localization.UI_STR.playerno);
        $(FIN_layout.noaudioicon).fadeOut(FIN_framework.UI_FIGURES[7]);
    }
};

//
// ## overlaywin tab switcher
//
function overlay_tab(what){
    // 1 = CONFIG
    if (what == 1){
        set_overlay_content( FIN_localization_3.MENU_CONFIG );
        $(FIN_layout.overlay_b).addClass('atab');
        $(FIN_layout.overlay_a).removeClass('atab');
        $(FIN_layout.overlay_c).removeClass('atab');
    }
    // 2 = ABOUT
    else if (what ==2){
        set_overlay_content( FIN_localization_3.MENU_ABOUT );
        $(FIN_layout.overlay_c).addClass('atab');
        $(FIN_layout.overlay_a).removeClass('atab');
        $(FIN_layout.overlay_b).removeClass('atab');
    }
    // 0 = HELP
    else {   
        set_overlay_content( FIN_localization_3.MENU_HELP );
        $(FIN_layout.overlay_a).addClass('atab');
        $(FIN_layout.overlay_b).removeClass('atab');
        $(FIN_layout.overlay_c).removeClass('atab');
    }
};
/*
store.js

https://github.com/marcuswestin/store.js#user-content-basic-usage

// Store current user
store.set('user', { name:'Marcus' })

// Get current user
store.get('user')

// Remove current user
store.remove('user')

// Clear all keys
store.clearAll()

// Loop over all stored values
store.each(function(value, key) { console.log(key, '==', value)})

store.each(function(value, key) {console.log(key, '==', value)})
*/

// stores some data in browser
function store_data_in_browser(thing, content){
    try {
        // stores data via storage.js lib
        store.set(thing, content);
        debug_out("STORED: "+thing+" = "+ recall_data_in_browser(thing) ,1);
    }
    catch (err) {
        trigger_error(ERROR_FATAL);
    }
};

// recalls data (settings or bookmark)
function recall_data_in_browser(thing){
    debug_out(thing,3);
    var x = store.get(thing);
    //if ( typeof(x) != 'undefined' && ( x.split('_')[x.split('_').length-1] == 'settings' || x.split('_')[x.split('_').length-1] == 'bookmark') ) {
    if ( typeof(x) != 'undefined' ) {
        return x;
    }
    else {
        return false;
    }
};

// recalls FIN bookmark
function overlaywin_restore() {
    debug_out("RESTORE-BOOKMARK",1);
    var form=FIN_framework.STORY_STORAGE+'_bookmarks';
    var recalled = recall_data_in_browser(form);
 //TBD   if (){ 
 //   .split('||');
    // TBD che fare per applicare?
    console.log("TBD APPLICARE E VERIFICARE COMANDI APPLICATI",recalled);
    system_popup(FIN_localization.UI_MESSAGES.restoreok);
};

// saves FIN bookmark
function overlaywin_savegame() {
    debug_out("SAVE-BOOKMARK",1);
    var form = FIN_framework.STORY_STORAGE+'_bookmarks';
    var str = FIN_framework.HISTORY.input.join('||');
    store_data_in_browser( form, str );
    // TBD XXXX
    system_popup(FIN_localization.UI_MESSAGES.saveok);
};

// saves FIN settings
function overlaywin_savesettings() {
    debug_out("STORE SETTINGS",1);
    var str = [];
    // forming settings name
    var form=FIN_framework.STORY_STORAGE+'_settings';
    // gets current settings
    FIN_framework.UI_settings['stylesheet']=$("#css_sheet[rel=stylesheet]").attr("href");
    FIN_framework.UI_settings['fontsize']=$("body").css("font-size").replace('px','');
    if ( $(FIN_layout.realclock).css('display') != 'none' ) {
        FIN_framework.UI_settings['showclock']='true';
    }
    else {
        FIN_framework.UI_settings['showclock']='false';
    }
    if (screenfull.isFullscreen) {
        FIN_framework.UI_settings['fullscreen']='true';
    }
    else {
        FIN_framework.UI_settings['fullscreen']='false';
    }
    for (var x in FIN_framework.UI_settings) {
        str.push(FIN_framework.UI_settings[x]);
    }
    str = str.join('||');
    store_data_in_browser( form, str );
    system_popup( FIN_localization.UI_MESSAGES.settingssaved );
};

// recalls FIN settings
function recall_settings() {
    var form=FIN_framework.STORY_STORAGE+'_settings';
    // recalls
    var recalled = recall_data_in_browser(form)
    if (recalled) {
        recalled = recalled.split('||');
        var i = 0;
        for (var x in FIN_framework.UI_settings) {
            debug_out( x+" >> "+recalled[i],1);
            if (recalled[i]=='true'){
                recalled[i] = true;
            }
            else if (recalled[i]=='false'){
                recalled[i] = false;
            }
            FIN_framework.UI_settings[x] = recalled[i];
            i+=1;
        }
    }
    else {
        system_popup(FIN_localization.UI_MESSAGES.nosettingssaved);
    }
    // applies settings
    overlaywin_change_stylesheet(FIN_framework.UI_settings.stylesheet);
    $("body").css("font-size", FIN_framework.UI_settings.fontsize+'px');
    // inputstring must be explicitly targeted (why? TBD)
    $(FIN_layout.inputstring).css("font-size", FIN_framework.UI_settings.fontsize+'px');
    if ( FIN_framework.UI_settings.showclock=='true' && $(FIN_layout.realclock).css('display') == 'none' ) {
        $(FIN_layout.realclock).show();
    }
    // full screen
    if ( FIN_framework.UI_settings.fullscreen && ! screenfull.isFullscreen ) {
        toggleFull();
    }
    setTimeout (function(){
        // word highlighting
        if (FIN_framework.UI_settings.wordhighlight) {
            toggle_wordhighlight(true);
        }
        else {
            toggle_wordhighlight(false)
        }
        // audio player
        if (FIN_framework.UI_settings.soundplayer) {
            $(FIN_layout.audioplayer).fadeIn(FIN_framework.UI_FIGURES[7]);
        }
    }, FIN_framework.UI_FIGURES[12]);
};

function remove_all_stored_data() {
    debug_out("clear storage");
    store.clearAll();
    system_popup(FIN_localization.UI_MESSAGES.removedall);
};
//
// # framework: instructions
//

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
            trigger_error(FIN_localization.ERROR_RAW+" "+err.message+" eval >> "+ogg);
        }
    }
    return;
};

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
};

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
        debug_out("NEW FOCUS: "+current_focus(),2);
        return;
    }
    else {
        trigger_error(FIN_localization.ERROR_NOPLY);
    }
};

// ## instruction: graphics/image changer
function img(imgPath){
// TBD
    change_image(imgPath);
    return;
};

//// instruction: inserisce una immagine TBD
function imgOLD(im,pc,SizeAndPlacement) {
    if (typeof(SizeAndPlacement)=="undefined") {
        SizeAndPlacement=30;
    }
    // TBD
    $(FIN_layout.previously).append(FIN_localization.OUT_IMG_PREV+im+FIN_localization.OUT_IMG_MEDI+pc+FIN_localization.OUT_IMG_POST);
    //$("#placeholder").append('</br><img src="'+im+'" class="el_fadein '+posizione+'" width="'+pc+'%"/></br>');
};

//// instruction: writes text in the "FIN_layout.placeholder" without any effect
function txt(text){
    // paragraph form customization
//TBD    text = "<p>" + text + "</p>";
//    text = "<br>" + text;
    debug_out("txt: "+text+"/", 3);
    // prints without any effect
    $(FIN_layout.previously).append( '<br>'+add_custom_html_tags( text, FIN_framework.DICTIONARY ) );
    // animated scroll-up effect
    CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(FIN_layout.upto).offset().top }, "+FIN_framework.UI_FIGURES[0]+")" );
    return;
};

//// instruction: writes text in the "FIN_layout.placeholder": slow-printing
function txs(text){
    // paragraph form customization
//    text = "<p>" + text + "</p>";
//    text = "<br>" + text;
    debug_out("txs: "+text+"/", 3);
    FIN_framework.printing= true;
    // prints with slow-print

    if(CRAWLER.working) {
        txt(text);
    }
    else {
        //txt('<br>');
        slowPrinter.add(text);
        slowPrinter.delay(FIN_framework.UI_FIGURES[6]);
    }
        
    /*
    if (typeof(CRAWLER)!="undefined") {
        if(CRAWLER.working) {
            txt(text);
        }
    }
    else {
        slowprinter_add(text);
        slowprinter_delay(FIN_framework.UI_FIGURES[6]);
    }
    */
    return;
};

// da rivedere gli altri print:!!! TBD
//// instruction: writes text in the "FIN_layout.placeholder": fade-in
function txf(text){
//TBD    text = "<p>" + text + "</p>";
//    text = "<br>" + text;
    debug_out("txf: "+text+"/", 3);
    FIN_framework.printing= true;
        if(CRAWLER.working) {
        txt(text);
    }
    else {
        var ics = '<br>'+add_custom_html_tags( text, FIN_framework.DICTIONARY );
        $(FIN_layout.placeholder).hide().html( text ).fadeIn( FIN_framework.UI_FIGURES[5], function(){
//            $(FIN_layout.previously).append(ics);
            $(FIN_layout.previously).append(ics);
            $(FIN_layout.placeholder).html("");
                // animated scroll-up effect
            CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(FIN_layout.upto).offset().top }, "+FIN_framework.UI_FIGURES[0]+")" );
            FIN_framework.printing= false;          
            CRITTER.runner(true);
        });
    }
    return;
};

//// instruction: chapter/story end with text output and link to following (optional)
// TBD
function end(what){

    setTimeout( function(){

        txf('<div style="text-align:center; padding:3em;"><a href="'+what+'.html">'+what+'</a></div>');
        //TBD
        
        /*
        shownlinktext = what.split(',')[0];
        nextlink = what.split(',')[1];
        debug_out(shownlinktext+"==>"+nextlink,1);
        if (typeof(nextlink) != "undefined") {
            txf('</br>&nbsp;<a href="'+nextlink+'">'+shownlinktext+'</a></br>');
        }
        else {
            txf('</br>&nbsp;'+shownlinktext+'</br>');
        }
        */
        CRITTER.chores.push( "$('html, body').animate( { scrollTop: $(FIN_layout.upto).offset().top }, "+FIN_framework.UI_FIGURES[0]+")" );
    }, FIN_framework.UI_FIGURES[12] );
    // << time to avoid messing up with the output stream
};

//// instruction: executes "raw" javascript code (for "count" times) - it's not possible to use " but only '
//function raw(cosa,count) {
function raw(what){
    debug_out(what,1);
    try {
        eval(what);
    }
    catch(err) {
        trigger_error(FIN_localization.ERROR_RAW+" "+err.message);
    }            


    /*
    if (typeof(count) == "undefined") {
        count=1;
    }    
    if ( cosa ) {
        debug_out("EXECUTING RAW JS: "+cosa+"/"+count, 2);
        try {
            eval(cosa);
        }
        catch(err) {
            trigger_error(FIN_localization.ERROR_RAW+" "+err.message);
        }            
    }
    else {
        trigger_error(FIN_localization.ERROR_RAW);
    }
    */
};

//// instruction: replaces synonims to verb objects
function vr0(what){
    // TBD verifiche!!!
//ex: vr0("do, doing")
//    var newarray=[];
    var toput = what.split(',');
    // the first synonim must be the v_...
    v_0.syn = ["v_0"];
    for (el in toput){
        var wd = toput[el].toLowerCase().trim();
        //newarray.push(toput[el].toLowerCase().trim());
        if ( v_0.syn.indexOf( wd ) < 0 ) {
            v_0.syn.push( wd );
        }
        if (FIN_framework.DICTIONARY.indexOf( wd )<0){
            FIN_framework.DICTIONARY.push( wd );
        }
    }
    //TBD: trigger_error();
    return true;
};
function vr1(what){
    // TBD verifiche!!!
//ex: vr1("do, doing")
//    var newarray=[];
    var toput = what.split(',');
    // the first synonim must be the v_...
    v_1.syn = ["v_1"];
    for (el in toput){
        var wd = toput[el].toLowerCase().trim();
        //newarray.push(toput[el].toLowerCase().trim());
        if ( v_1.syn.indexOf( wd ) < 0 ) {
            v_1.syn.push( wd );
        }
        if (FIN_framework.DICTIONARY.indexOf( wd )<0){
            FIN_framework.DICTIONARY.push( wd );
        }
    }
    //TBD: trigger_error();
    return true;
};
function vr2(what){
    // TBD verifiche!!!
//ex: vr2("do, doing")
    //var newarray=[];
    var toput = what.split(',');
    // the first synonim must be the v_...
    v_2.syn = ["v_2"];
    for (el in toput){
        var wd = toput[el].toLowerCase().trim();
        //newarray.push(toput[el].toLowerCase().trim());
        if ( v_2.syn.indexOf( wd ) < 0 ) {
            v_2.syn.push( wd );
        }
        if (FIN_framework.DICTIONARY.indexOf( wd )<0){
            FIN_framework.DICTIONARY.push( wd );
        }        
    }
    //TBD: trigger_error();
    return true;
};
function vr3(what){
    // TBD verifiche!!!
//ex: vr3("do, doing")
//    var newarray=[];
    var toput = what.split(',');
    // the first synonim must be the v_...
    v_3.syn = ["v_3"];
    for (el in toput){
        var wd = toput[el].toLowerCase().trim();
        //newarray.push(toput[el].toLowerCase().trim());
        if ( v_3.syn.indexOf( wd ) < 0 ) {
            v_3.syn.push( wd );
        }
        if (FIN_framework.DICTIONARY.indexOf( wd )<0){
            FIN_framework.DICTIONARY.push( wd );
        }
    }
    //TBD: trigger_error();
    return true;
};

// commute state of an object: open/closed
function com(objn) {
    if ( eval(objn).typ.indexOf("closed") >=0 ) {
        array_remove("closed", eval(objn).typ );
    }
    else {
        eval(objn).typ.push("closed");
    }
};

//
// ## play a sound
//
function pas(soundfile){
    debug_out("PLAY: "+soundfile,1);
    $(FIN_layout.audiofile).attr('src',soundfile);
    if (!FIN_framework.UI_settings.soundplayer || $(FIN_layout.audioplayer).css('display')=="none"){

        //$(FIN_layout.audioplayer).fadeIn(FIN_framework.UI_FIGURES[7]);
        //FIN_framework.UI_settings.soundplayer=true;
        msg(FIN_localization.UI_MESSAGES.nomusicplayer);
        $(noaudioicon).fadeIn(FIN_framework.UI_FIGURES[7]);
        return;
    }
    try{
        var sound = document.getElementById(FIN_layout.audioplayer.substr(1));
        // loads audio file
        $(FIN_layout.audioplayer)[0].load();
        // starts to play
        sound.play();
        sound.addEventListener('ended',function(){
            debug_out("PLAY-END",2);
            // ...
            // add here the code to auto hide the player on end or obtein other behaviour
        });
    }
    catch(err){
        trigger_error(FIN_localization.ERROR_NOTFOUND+'\n'+sound);
    }
};

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

//// pulsante "debug" TBD
function debug_button() {
    //raw("PROVAAAA");
    debug_out("DEBUG-BUTTON PRESSED:",2);
//    console.log($("body").css("font-size"));
//    console.log("SLOWPRINTING: "+UI_SLOWPRINTING);
    debug_out("FOCUS: << "+current_focus()+" >> "+FOCUS.lnkTo, 1);
    debug_out("IN-SCOPE: "+inscope_objs_list(FOCUS), 2);
    debug_out("DICTIONARY:"+FIN_framework.DICTIONARY, 3);
    debug_out("FIN_framework.HISTORY INPUT: "+FIN_framework.HISTORY.input,4);
    debug_out("FIN_framework.HISTORY DONE:"+FIN_framework.HISTORY.done,4);
    debug_out("CRITTER:"+CRITTER.chores,4);
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
        for (var i in FIN_framework.HISTORY.raw) {
			// puts current FIN_framework.HISTORY content in the window
			write_in_secondary_window(FIN_framework.HISTORY.raw[i]);
		}
    }
    else {
        // the browser has blocked it
        system_popup(FIN_localization.UI_MESSAGES.alertwarning);
    }
};

// writes a line of text in the secondary window (SecondaryWindow)
function write_in_secondary_window(what){
    debug_out("SECONDARY: "+what,3);
    try{
        secondary_window.document.writeln(what+"<br>");
    }
    catch(err){
        trigger_error(ERROR_NOTFOUND);
    }
};

// prints debug information if DEBUG global variable is set >0 (see DEBUG) to the console
function debug_out(it,verbosity){
    //to_stream('</br><i style="font-size: 9pt;">'+it+'</i></br>');
    if (DEBUG >= verbosity) {
        console.log(callerName() +" >> "+it.toString());
    }
    if (DEBUG >4){
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

// image (<img> tag) fade-out / fade-in effect TBD
function change_image(sourceimg) {
    // displays topgradient if concealed
    if ($(FIN_layout.topgradient).css('display') == 'none') {
        $(FIN_layout.topgradient).fadeIn(FIN_framework.UI_FIGURES[7]*2);
    }
    // fades out old image and fades in the new one
    $(FIN_layout.imagezone).fadeTo( FIN_framework.UI_FIGURES[7], 0.001, function(){

        //
        // NON FUNZIONA PERCHE" il cambio di src riesce sempre, cosa verificarte??? TBD XXXX
        try{
            $(FIN_layout.imagezone).attr("src",sourceimg);
        }
        catch(err){
            debug_out(ERROR_NOTFOUND+" "+sourceimg,1);
            system_popup(ERROR_NOTFOUND+" "+sourceimg);
            debug_out(FIN_localization.ERROR_NOTFOUND+" "+err);
        }
    }).fadeTo(FIN_framework.UI_FIGURES[7], 1);
};

//// setup dynamic image size
function setup_image(verticalfraction){
  	$(FIN_layout.imagezonecontainer).css('display','block');
  	///////TBD bkg img
    if (!$(FIN_layout.imagezonecontainer).css('display')) {
//        $("body").prepend('<div id="imagezonecontainer" style="max-width:100%;max-height:100%;width:auto;height:auto;z-index:9;margin-left:auto;margin-right:auto;display:none"/> <img id="imagezone" style="max-width:100%;max-height:100%;width:auto;height:auto;z-index:10;margin-left: auto;margin-right: auto;opacity: 1;" src=""></div> </div>');

$("body").prepend('<div id="imagezonecontainer" style="text-align: center;width: 100%;height: 330px;z-index: 9;position: fixed; float: block;top: 0px;"><img id="imagezone" style="max-width: 100%; max-height: 100%; width: auto; height: auto; z-index: 10; margin-left: auto; margin-right: auto; opacity: 1;" src=""/></div>');

        //$(imagezonecontainer).css('background-image','background-image: url("styles/empty.png")');
        //$("body").prepend('<div id="imagezonecontainer" style="max-width:100%; max-height:100%; width:auto; height:auto; z-index:10; margin-left: auto; margin-right: auto; display: none" id="fixedimage"/></div>');
    }
    var verticalpixels = Math.ceil( get_display_size()[0] * verticalfraction );
    debug_out(verticalpixels,2);
    $(FIN_layout.outputarea).css('margin-top',verticalpixels);
    $(FIN_layout.topgradient).css('margin-top',verticalpixels);
    //$(topgradient).css('display','none');
    $(FIN_layout.imagezonecontainer).css('height',verticalpixels);
    $(FIN_layout.imagezonecontainer).css('width','100%');
};

//// drawImageOnCanvas("http://photojournal.jpl.nasa.gov/jpeg/PIA17555.jpg")
// img.src = "http://photojournal.jpl.nasa.gov/jpeg/PIA17555.jpg";drawImage();
// $(imagezonecontainer).css('width').split('px')[0]
// $(imagezonecontainer).css('height').split('px')[0]
//https://stackoverflow.com/questions/10841532/canvas-drawimage-scaling
function drawImageOnCanvas(source){ // TBD
    var canvas = document.getElementById("imagezone");
    var context = canvas.getContext("2d");
     //document.getElementById("myImageToDisplayOnCanvas");
    var imageObj = new Image();
     // "https://panoramacouncil.org/pics/content/header/Panorama_Rouen1431_neu_4c_c-asisi(1).jpg"
        imageObj.src = source;

    imageObj.onload = function() {
    var imgWidth = imageObj.naturalWidth;
    var screenWidth  = canvas.width;
    var scaleX = 1;
    if (imgWidth > screenWidth)
        scaleX = screenWidth/imgWidth;
    var imgHeight = imageObj.naturalHeight;
    var screenHeight = canvas.height;
    var scaleY = 1;
    if (imgHeight > screenHeight)
        scaleY = screenHeight/imgHeight;
    var scale = scaleY;
    if(scaleX < scaleY)
        scale = scaleX;
    if(scale < 1){
        imgHeight = imgHeight*scale;
        imgWidth = imgWidth*scale;          
    }

    canvas.height = imgHeight;
    canvas.width = imgWidth;

//    context.drawImage(imageObj, 0, 0, imageObj.naturalWidth, imageObj.naturalHeight, 0,0, imgWidth*20, imgHeight*20);
//    context.drawImage(imageObj, 0, 0, imageObj.naturalWidth, imageObj.naturalHeight, 0,0, imgWidth*10, imgHeight*10);
//    context.drawImage(imageObj, 0, 0, imageObj.naturalWidth, imageObj.naturalHeight, 0,0, imgWidth*5, imgHeight*5);

    context.drawImage(imageObj, 0, 0, imageObj.naturalWidth, imageObj.naturalHeight, 0,0, imgWidth, imgHeight);
    }
};



//-// verb synonims substitutor TBD USATO?
// es: verb_substitution("1, fare") >> v_1.syn = ["disfare"] >> ["fare"]
function verb_substitution(what) {
    debug_out("NEW VERB GROUP DEFINITION: "+what, 2);
    var wordlist = what.split(',');
    if (wordlist.length < 2) {
        trigger_error(FIN_localization.ERROR_RAW);
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
};
//
// # FIN bootstrap
//

// ## preliminary instructions
debug_out("FIN STARTUP: "+STORY+" / BROWSER: "+navigator.userAgent,1);
// sets page title => story title
document.title=STORY;

//
// ## default verbs are linked to the FOCUS
//
FOCUS.lnkTo.unshift("v_0");
FOCUS.lnkTo.unshift("v_1");
FOCUS.lnkTo.unshift("v_2");
FOCUS.lnkTo.unshift("v_3");
// object cloning via jquery method to remember the starting point (for the "CRAWLER") TBD
var FOCUS_atstart = jQuery.extend(true, {}, FOCUS);
// decoding objectsDefinition content
// TBD bootstrap.js
objectsDefinition=basesixtyfourdecode(objectsDefinition);
// if the type is object it means that JSON has already been recognized
if ( typeof(objectsDefinition) != 'object' ) {
    objectsDefinition=JSON.parse(objectsDefinition);
};
// first loop run: building objects
for ( var ob in objectsDefinition ) {
    var deffocus=false;
    var og = ob.toLowerCase();
    eval( "var " + og + ' = new fin_object("'+og+'");' );
    // if not present, adds the word to the dictionary
    if (FIN_framework.DICTIONARY.indexOf(og)<0){
        FIN_framework.DICTIONARY.push(og);
    }
};
// checks if default verb objects exist
if ( typeof(v_0)=="undefined" || typeof(v_1)=="undefined" || typeof(v_2)=="undefined" || typeof(v_3)=="undefined") {
    trigger_error(FIN_localization.ERROR_OBJNOTDEFINED+": "+"verb");
};
// second loop run: adding attributes to objects: types, links, synonims, ... 
for ( var o in objectsDefinition ) {
    var og = o.toLowerCase();
    for ( var what in objectsDefinition[og] ) {
        // if the property is not yet defined it is added to the object
        var undef;
        if ( eval(og)[what] === undef ) {
            eval(og)[what]=[];
        }
        debug_out( "ATTRIBUTES: "+og+"/"+what+"/"+objectsDefinition[og][what], 3 );
        for ( var i in objectsDefinition[og][what] ) {
            if ( typeof(objectsDefinition[og][what][i]) == typeof([]) ) {
                var t = objectsDefinition[og][what][i]
            }
            else {
                var t = objectsDefinition[og][what][i].trim();
            }
            debug_out("BUILDING: "+og+" "+what+" "+i+" "+t, 3);
            if ( !what.match(/v_.+/) ) {
                var wd = t.toLowerCase();
            }
            else {
                var wd = t;
            }
            // if the attribute is not present yet, it is added, except for the raw javascipt
            if ( eval(og)[what].indexOf( wd ) < 0 || wd.match(/raw/) ) {
                // type link
                if (what=="lnkTo") {
                    connetti(og,wd);
                }
                // type synonim
                else if (what=="syn") {
                    // DICTONARY building
                    FIN_framework.DICTIONARY.push( wd );
                    eval(og)[what].push( wd );
                }
                // all other attributes
                else {
                    eval(og)[what].push( wd );
                }
            }
        }
    }
};

// setting specific story name identifier (prefix + 6 letters substring + _settings/_bookmark)
FIN_framework.STORY_STORAGE = 'FIN_'+STORY.substr(0,6).replace(/ /g,"_");

