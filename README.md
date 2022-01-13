# JavaScript `promises` and `async` funcs

## Closures / arrow funcs

* `() => {}`

* `()` can contain arguments  

```JavaScript
   (v1)     => {console.log(v1);    }  
   (v1, v2) => {console.log(v1, v2);}  
    v1      => {console.log(v1);    }  // () omissable for single arg
    ()      => {console.log("hi");  }  // no arguments
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

* `executorFunc()` is started _instantly_  and [synchroneusly](https://www.bennadel.com/blog/3296-the-es6-promise-constructor-and-its-executor-function-are-invoked-synchronously.htm)  
  and runs until calling `resolve(val)` or `reject(err)`

* 

