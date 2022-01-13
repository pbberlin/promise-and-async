// https://www.freecodecamp.org/news/javascript-promise-tutorial-how-to-resolve-or-reject-promises-in-js/

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

/*  

1.) promise constructor takes a function as argument.

2.) function argument is called *executor*.

*/ 

const promWait1 = ms => new Promise( resolve => setTimeout(resolve, ms));   // executor with one argument:   resolve: (value:   any) => void
const promWait2 = ms => new Promise((resolve, reject) => {                  // executor with two arguments:  resolve: (value:   any) => void
                                                                            //                               reject:  (reason?: any) => void
    if (ms < 100) {
        resolve('fine');
    } else if (ms < 1000) {
        setTimeout(resolve, ms)
    } else {
        reject('too big');
    }
});


/* 

3.) resolve and reject are callback functions.
    They are provided to the executor func as arguments.
    Both funcs are optional.
    Both funcs have an optional argument ("value" and "error/reason"). 
    But they can be called without arg:  Promise.resolve()
    
    The callback function bodies are implemented in a suffixed  THEN( impl-1 [, impl-2] ).
    .THEN() is only executed in the next event loop 
      (provided that the promise has "resolved")

    The implementation of resolve() is part of the *consumer*

    
4.) Custom logic goes inside the executor function.  
    Custom logic should *call* resolve() XOR reject()  

    => executor() is implemented in promise constructor
    => resolve() and reject() are implemented later


5.)
   a promise has the property
     state == [pending|fulfilled|rejected]
   
   a promise has the property
    result == [undefined|value|error]

*/




function log(msg) {     console.log(msg);  }  // shortening console.log() to log()

const aPromiseSeed = Promise.resolve();       // a promise without executor, not going to the event queue, instantly resolved, seed for chaining more promises


promWait1(0).then( () => log(4) );
aPromiseSeed.then( () => log(2) ).then( () => log(3) );
log(1); 
// output: 1, 2, 3, 4



// fuctions passed to then() will never be called synchronously,
//  even with an already - resolved promise:
Promise.resolve().then(() => console.log(2));
console.log(1); // 1, 2

// Promise callbacks are handled as a Microtask
// whereas setTimeout() callbacks are handled as Task queues.

// https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth



// thus we can convert any code into a "THENABLE" promise using
let pr = Promise.resolve("string value");

// and then we chain
pr.then((val) => { log(`promise contained ${val}`) })



