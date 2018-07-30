//
// # The CRITTER manages sequential instructions execution
//
//  ## CRITTER definition
//
var oldCRITTER = {
    // staus flag
    alive : 0,
    // start method
    start : function() {
        CRITTER.alive = setInterval( function(){
//            if ( slowPrinter.count <= 0 && CRITTER.chores.length > 0 && UI_ENABLED ) {
            if ( CRITTER.chores.length > 0 && UI_ENABLED ) {
    
                var what = CRITTER.chores.shift();
                // only for the START content special case removes '\' ? TBD
                what= what.replace(/\\"/g,'"')
                debug_out( what, 4 );
                // instruction content is passed to the browser as code
                try {
                    eval( what );
                }
                catch(err) {
                    trigger_error(ERROR_RAW+" "+err.message);
                }            
            }
        }, UI_FIGURES[11])
    },
    // stop method
    kill : function() {
        clearInterval(this.alive);
        debug_out("your critter was killed! "+this.alive,2);
    },
    // commands queue to be executed
    chores : []
}

var CRITTER = {
    // staus flag
    alive : 0,
    // start method

    run : false,
    runner : function(yesno) {
        if ( CRITTER.chores.length > 0 && yesno && UI_ENABLED) {
            if (!FIN_framework.printing){
                try{
                    eval(CRITTER.chores.shift().replace(/\\"/g,'"'));
                //what= what.replace(/\\"/g,'"')
		            if (CRITTER.chores.length>0){
                        CRITTER.runner(true);
                    }
                    else {
                        CRITTER.runner(false);
                    }
                }
                catch(err){
                    trigger_error(ERROR_RAW+" "+err);
                }
            }
         //   else {
                
         //   }
        }
    },


    // commands queue to be executed
    chores : []
}
