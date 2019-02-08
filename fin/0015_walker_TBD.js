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
