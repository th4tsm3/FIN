
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

