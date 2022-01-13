# JavaScript `promises` and `async` funcs

## Closures / arrow funcs

* `() => {}`

* `()` can contain arguments  

```JavaScript
   (v1)      => {console.log(v1);    }  
   (v1, v2)  => {console.log(v1, v2);}  
    v1       => {console.log(v1);    }  // () omissable for single arg
    ()       => {console.log("hi");  }  // no arguments
   (v1)      =>  console.log(v1);       // {} omissable for single statement
```

* Arrow funcs also _inherit_ their innermost `{...}` scope

* Arrow funcs have no revolting `this` for local variables

## Promise

* Web browser apps have a _single_ JavaScript thread

* Thread must be prevented from ever blocking,  
  because it freezes the UI

* => The single thread is therefore structured  
  as global `event queue`,  
  containing `functions`

* Using `new Promise(  executorFunc()  )`,  
  code can be offloaded to the global queue

* `executorFunc()` is started _instantly_  and [synchroneously](https://www.bennadel.com/blog/3296-the-es6-promise-constructor-and-its-executor-function-are-invoked-synchronously.htm)  

  * `executorFunc()` runs _until_ calling `resolve(val)` or `reject(err)`

  * Or calling another builtin promise-returning func  
    such as `fetch(url)` and `string.json()`

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
