// https://web.dev/promises/
// https://web.dev/async-functions/
// https://developers.google.com/web/fundamentals/primers/async-functions

import fetch from 'node-fetch';
// npm install node-fetch    --global

import toUpperCase from './package-uppercase.js'

function createPromise0() {

    /* 
        Arguments `resolve` and `reject` 
        are of type function(string)string  
        it seems they do not have to be declared anywhere.
    */

    const prom = new Promise(
        function (resolve, reject) {
            // do a thing, possibly async…
            let fine = true;
            //  then…
            if (fine) {
                console.log(`prom-0-resolved`);
                resolve("prom-0-success");
            }
            else {
                console.log(`prom-0-rejected`);
                reject("prom-0-failure");
            }
        }
    );

    return prom;

}


function createPromise1() {

    var jsonProm = new Promise(
        function (resolve, reject) {
            // JSON.parse throws an error if you feed it some
            // invalid JSON, so this implicitly rejects:
            resolve(JSON.parse("This ain't JSON"));
        }
    );

    return jsonProm;

    jsonProm.then(function (data) {
        console.log("It worked!", data);  // never happens
    }).catch(function (err) {
        console.log("It failed!", err);
    })    

}



const urls = ["https://www.google.com", "https://www.spiegel.de", "https://www.welt.de"];

function createPromise2() {
    const prom = new Promise(
        () => { console.log(`resolved`); },
    );
    return prom;
}

function createPromise3() {
    const prom = new Promise(
        () => { console.log( toUpperCase("lower") ); },
    );
    return prom;
}

function createPromise4(url) {
    const prom = new Promise(
        async () => {
            const response = await fetch(url);
            const txt = await response.text()
            console.log(`url response from ${url}`);
            console.log("   ",txt.substring(0, 52));
        },
    );
    return prom;
}

function createPromise5(ms) {
    // wait ms milliseconds
    return new Promise((param1) => setTimeout(param1, ms));;
}


async function createPromiseAndThenA() {
    await createPromise5(1500);
    console.log('world');
    return 'world2';;
}
async function createPromiseAndThenB() {
    await createPromise5(1500);
    throw 'bar';
}



/* Async functions always return a promise, 
   whether you use await or not.
   
   That promise 
            resolves with whatever the async function returns, 
        or  rejects  with whatever the async function throws. 
 */
async function usePromiseWithAsync1() {

    try {
        const fulfilledValue = await createPromise0(urls[0]);
        console.log(`fullfilled val is ${fulfilledValue}`);
    }
    catch (rejectedValue) {
        console.log(`rejected val is ${rejectedValue}`);
    }
}




usePromiseWithAsync1();

