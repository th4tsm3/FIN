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
    ],
    test_instructions : [
        "chk_and",
        "chk_or_"
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
