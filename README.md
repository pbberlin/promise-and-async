# JavaScript `promises` and `async` funcs

## Closures / arrow funcs

* `() => {}`

* `()` can contain arguments  

```JavaScript
   (v1)      => {console.log(v1);    }  
   (v1, v2)  => {console.log(v1, v2);}  
    v1       => {console.log(v1);    }  // () omissable for single arg
    ()       => {console.log("hi");  }  // no arguments
   (v1)      =>  console.log(v1)        // {} omissable for single statement
```

* Arrow funcs also _inherit_ their innermost `{...}` scope

* Arrow funcs have no revolting `this` for local variables

```JavaScript  
    (resp)       =>    resp.json()      // implicit return
    (resp)       =>  { resp.json(); }   // would require explicit return
```

## Promise

* Web browser apps have a _single_ JavaScript thread

* Thread must be prevented from blocking,  
  because it freezes the UI

* => The single thread is therefore structured  
  as global `global event queue`,  
  containing `functions`

* Using `new Promise(  executorFunc()  )`,  
  code can be offloaded to the global queue

* `executorFunc()` is started _instantly_  and [synchroneously](https://www.bennadel.com/blog/3296-the-es6-promise-constructor-and-its-executor-function-are-invoked-synchronously.htm)  

* `executorFunc()` runs _until_ either
  
  * calling `resolve(val)` or `reject(err)`

  * Or calling another _built in_ promise-returning func  
    such as `fetch(url)`, `string.json()`  
    `caches.open()` or  `myCache.add()`

  * Or calling another promise-returning func  
    such as `window.setTimeout(fnc, ms)`

  * Or calling another promise-returning func  
    such as `await myFunc()` or `Promise.resolve().Then(myFunc)`

  * More reasoning on when the offloading occurs [here](https://stackoverflow.com/questions/68785712)  
  and [here](https://stackoverflow.com/questions/55676922/)

* `resolve(val)` or `reject(err)`
  are pushed on the event loop.  
  They are executed as soon as the even loop is idle.

* `setTimeout(fnc...)`  
  is pushed on the event loop.  
  It is executed as soon as the even loop is idle  
  and the timeout milliseconds have passed

* `await myFunc()`, `fetch()` and `string.json()`  
   seem to be offloaded as well

```JavaScript
// offloading myFunc() to run asynchroneously
const seed = Promise.resolve();
seed.Then(myFunc)

// offloading myFunc() to run asynchroneously
//    equivalent
await myFunc()

// here myFunc() is run synchroneously
//     but resolve() goes asynchroneously
const promise = new Promise((resolve, reject) => {
    myFunc(resolve, reject);
});

```

## Loops

```JavaScript

Promise.all(  [p1, p2, p3]  ).then(  vals => console.log(values)  );

import fetch from 'node-fetch';

{
    const p1 = Promise.resolve(3);
    const p2 = 2;
    const p3 = new Promise(  resv => setTimeout(resv, 100, 1)  );
    // returns in order of array arguments
    Promise.all(  [p1, p2, p3]  ).then(  vals => console.log(vals)  );
}


{
    const p1 = fetch("https://www.google.com");
    const p2 = fetch("https://www.microsoft.com");
    const p3 = fetch("https://www.facebook.com");
    Promise.all(  [p1, p2, p3]  ).then(  vals => console.log({vals})  );


    // same in async await
    const fnc1 = () => Promise.all(  [p1, p2, p3]  );
    const vals = await fnc1();  // instead of .Then(...)
    console.log({ vals })

    // await works without a wrapping async () => {}
    // maybe https://stackoverflow.com/questions/51525234


}

```

* Return value order will be in order of the Promises passed

* Regardless of completion order
