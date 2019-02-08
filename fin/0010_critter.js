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
