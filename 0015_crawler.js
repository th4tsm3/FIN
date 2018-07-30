//
// # The CRAWLER looks for all the possible playing paths
//
var CRAWLER = {
    alive : 0,
    working : false,
    // n of steps crawler has performed (needs reset)
    step_n : 0,
    // n of story ends crawler has found (needs reset)
    story_end : 0,
    
    iterations : 0,
    // stores the already crawled paths
    crawled_paths : [],
    
    current_path : [],
    
    PLOT_PATHS_GOOD_INPUT : [],
    PLOT_PATHS_GOOD_INSTRUCTIONS : [],
    PLOT_PATHS_WRONG_INPUT : [],
    PLOT_PATHS_WRONG_INSTRUCTIONS : [],
    // bootstraps the story crawler
    start : function (){
        // resets story objects
        fin_story_reset();
        // start crawler
        CRAWLER.working = true;
        CRAWLER.alive = setInterval( function(){
            // CRAWLER does something only if CRITTER is idling
            if ( CRITTER.chores.length == 0 ) {
                // crawls through the story possibilities...
                CRAWLER.probe(FOCUS);
            }
        }, UI_FIGURES[11]) },
    // crawler stopper
    stop : function (){
        clearInterval(this.alive);
        this.working = false;
        // TBD
        output_PATHS();
    },
    // searches through the obects for valid actions/instructions
    probe : function(starting_obj){
        var undef;
        var found_instructions = [];
        var possible_actions = [];
        // TBD object type check TBD rimuovere?
        if ( typeof(starting_obj) == typeof(undef) ) {
            debug_out("story_crawler: starting object undefined!",3);
            system_popup("story_crawler: starting object undefined!");
            return false;
        }
        // "found_here" is an array of data structures containing: object, verb, array of instructions
        var found_here = [];
        var objlist = inscope_objs_list( starting_obj );
        // populating "found_here" array with possible actions
        // for each object in scope
        for (obj in objlist) {
            // >> global: FIN_framework.var verbs_attr = ['v_0','v_1','v_2','v_3'];
            // for each verb attribute of the object
            for (var v in FIN_framework.verbs_attr) {
                // if there is at least an action
                if ( typeof( eval( objlist[obj] )[FIN_framework.verbs_attr[v]][0] ) != typeof(undef) ) {
                    found_instructions.push( eval( objlist[obj] )[FIN_framework.verbs_attr[v]][0] );
                    possible_actions.push( FIN_framework.verbs_attr[v]+'||'+objlist[obj] );
//                    found_here.push( eval( objlist[obj] ), );
//                    console.log ( objlist[obj], eval( objlist[obj] )[FIN_framework.verbs_attr[v]] ) ;
                    // if at this step all the possible actions have been evaluated, stops
                    //CRAWLER.stop();
                }
            }
        }
        // for-loop end: objects
        // if some possible actions have been found they shall be evaluated
        if (possible_actions.length > 0) {
            CRAWLER.evaluate( possible_actions );
        }
        // if no possible actions found
        else {
            debug_out(CRAWLER_FAILED,1);
            system_popup(CRAWLER_FAILED);
            out_crawler_results([CRAWLER_FAILED]);
            CRAWLER.stop();
        }
    },

    evaluate : function(possible_actions){
        // array: 0 = objectname, 1 = verbname, 2 = instructions
        // endtype: 0=no end, 1=bad end/deadlock, 2=good end
        //var endtype = 0;
        
        for ( var poss in possible_actions ) {
            if ( crawled_paths.indexOf( possible_actions[poss] ) <0 ) {
                ;
            }
        }
        // pop instruction from the object
        
        // if "end" populate good ends list
        // ( CRAWLER.iterations +=1; reset story and restart)
        
        // execute

        // TBD
  
    },
                 // end: 0 = no end, 1 = dead end, 2 = good end
    step : function(obj, verb, instr, end) {
        CRAWLER.step_n+=1;
        // executes what found
        execute_instructions(verb, eval(obj), instr);
        if (end == 2) {
            CRAWLER.PLOT_PATHS_GOOD_INSTRUCTIONS.push(HISTORY.done);
            CRAWLER.PLOT_PATHS_GOOD_INPUT.push(HISTORY.input);
            // good path found: stops CRAWLER
            CRAWLER.stop();
            out_crawler_results(HISTORY.input);
        }
    }
}

//
// ## outputs the paths found by the crawler
//
function output_PATHS(){
    console.log("GOOD:");
    var goodPaths="";
    if (CRAWLER.PLOT_PATHS_GOOD_INPUT.length > 0) {
    for (var i in CRAWLER.PLOT_PATHS_GOOD_INPUT)
    console.log(i+')'+CRAWLER.PLOT_PATHS_GOOD_INPUT[i]);
    goodPaths+='('+i+') '+CRAWLER.PLOT_PATHS_GOOD_INPUT[i]+'\n';
    }
    else {
        console.log("NONE");
    }
    console.log("WRONG:");
    if (CRAWLER.PLOT_PATHS_WRONG_INPUT.length > 0) {
    for (var i in CRAWLER.PLOT_PATHS_WRONG_INPUT)
        console.log(i+')'+CRAWLER.PLOT_PATHS_WRONG_INPUT[i]);
    }
    else {
        console.log("NONE");
    }
    //TBD
    system_popup("CRAWLER FOUND...\n"+goodPaths);
}

//
// ## outputs crawler good-paths
//
function out_crawler_results(foundpaths) {
    debug_out("CRAWLER FOUND:\n"+foundpaths,1);
//TBD
}

//
// ## automatic execution of a list of commands
//
function autoexec(instructionslist){
// ex: autoexec("v_1 start||v_1 personaggio")
	if (typeof(instructionslist) != typeof([]) ) {
		trigger_error(ERROR_FORMAT);
	}
	var cmds = instructionslist.split('||');
	for (var it in cmds) {
		CRITTER.chores.push( command_input_manager(cmds[it],"autoexec") );
	}
}
