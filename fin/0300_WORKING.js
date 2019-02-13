function clean_up_array(array) { 
    return array.map( function(el) {
        return el.toLowerCase().trim() } );
};

//
// ## test instrucion: at least one of the mentioned elements is visible
//
function chk_or_(names) {
    // names is translated to an array
    if ( names.indexOf(',')>0 ) {
        names = names.split(',');
    }
    else {
        names = [ names ];
    }
    names = clean_up_array(names);
    var list_to_be_checked = inscope_objs_list(FOCUS);
    for (nm in names) {
        console.log(names[nm], list_to_be_checked);
        if ( list_to_be_checked.indexOf( names[nm] ) >=0 ) {
            return true;
        }
    }
    return false;
};

//
// ## test instrucion: all the mentioned elements are visible
//
function chk_and(names) {
    // names is translated to an array
    if ( names.indexOf(',')>0 ) {
        names = names.split(',');
    }
    else {
        names = [ names ];
    }
    names = clean_up_array(names);
    var all = names.length;
    var list_to_be_checked = inscope_objs_list(FOCUS);
    for (var i=0; i<names.length; i++) {
        if ( list_to_be_checked.indexOf( names[i] ) >=0 ) {
            all-=1;          
        }
    }
    if (all>0) {
        return false;
    }
    else {
        return true;
    }
};

