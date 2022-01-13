import fetch from 'node-fetch';



{
    const p1 = Promise.resolve(3);
    const p2 = 2;
    const p3 = new Promise(  resv => setTimeout(resv, 100, 1)  );


    // return value order will be in order of the Promises passed - regardless of completion order
    Promise.all(  [p1, p2, p3]  ).then(  vals => console.log(vals)  );
    Promise.all(  [p3, p2, p1]  ).then(  vals => console.log(vals)  );
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

