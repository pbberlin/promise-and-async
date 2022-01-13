const msg = "outer var"
let fc = null;

fc =    function () { return `inside 1, ${msg}` };

console.log( fc() );



        () =>       {} ;


fc =    () =>       { return `inside 2, ${msg}` };

console.log( fc() );



/* 
    No `this` functionality in arrow funcs

    Arrow funcs cannot be "instantiated" using `new`

    Arrow funcs 
*/