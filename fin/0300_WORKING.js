
//
// ## Special button for DEBUG purposes
//
function DEBUGGER_button() {
    //raw("PROVAAAA");
    debug_out("DEBUG-BUTTON PRESSED:",2);
    debug_out("FOCUS: << "+current_focus()+" >> "+FOCUS.lnkTo, 1);
    debug_out("IN-SCOPE: "+inscope_objs_list(FOCUS), 2);
    debug_out("DICTIONARY:"+FIN_framework.DICTIONARY, 3);
    debug_out("FIN_framework.HISTORY INPUT: "+FIN_framework.HISTORY.input,4);
    debug_out("FIN_framework.HISTORY DONE:"+FIN_framework.HISTORY.done,4);
};

function debug_force_out(x) {
    console.log(x);
    // TBD usato solo qui
};

function inscope() {
    let list=inscope_objs_list(FOCUS);
    for (i in list) {
        debug_force_out(i+" - "+list[i]);
    };
};

function alldefinedobjects() {
    let list=FIN_framework.ALLOBJECTS;
    for (i in list) {
        debug_force_out(i+" - "+object_name(list[i]));
    }
};

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
