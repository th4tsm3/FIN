function clean_up_array(array) { 
    return array.map( function(el) {
        return el.toLowerCase().trim() } );
};

function check_or(names) {
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
// 
//
// an -> AND, overall function name length must be 8 characters
function check_ad(names) {
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

