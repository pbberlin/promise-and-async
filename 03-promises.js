import fetch from 'node-fetch';

function log(msg) {     console.log(msg);  }  // shortening console.log() to log()

// time of start of program
let tmSt = new Date().getTime();

let cntr = 0;

function pad(arg, width) {
    let c1 = `${arg}`;
    while (c1.length < width) {
        c1 = " " + c1;
    }
    return c1;
}

// synchroneous wait
//   this "tight loop" cannot be pre-empted by any funcs below
//   it blocks the main thread / the main event queue
// 
// As soon as we introduce any setTimeout(offload), 
//   the func returns and loses its blocking quality.
// There is no equivalent to Visual Basic "doEvents".
function waitSync(ms) {
    var start = Date.now();
    var now = start;

    while (now - start < ms) {
        now = Date.now();
    }
}

/* 
    Several attempts at pre-empting a long running javascript loop,
    such as waitSync().
    None of these succeeds.
    => The only way to pre-empt a tight loop is 
        offload it by itself (setTimeout(loopLogic))
*/
function waitDoeventsUntil(ms) {
    var start = Date.now();
    var now = start;


    let fcBackAndForth = () => {
        now = Date.now();
        if (now - start < ms) {
            // window.requestAnimationFrame(fcBackAndForth);
            log(`fcBackAndForth ${now - start}`)
            setTimeout(fcBackAndForth, 100);
        }
    };

    // window.requestAnimationFrame(fcBackAndForth);
    setTimeout(fcBackAndForth, 10);
}

function doEvents1() {
    let fcCallMeBack = () => {
        let a = 1+1;
        // log(`fcCallMeBack`);
    };
    setTimeout(fcCallMeBack, 10);
}

function doEvents2() {
    let fcAsync = async () => { return await Promise.resolve(); }
    let fcCallr = async () => { return await fcAsync(); }
    let dummy = fcCallr();
}


function resetTime() {
    // reset time
    tmSt = new Date().getTime();
}

// logging time
const tt = (tag) => {
    const tm = new Date().getTime();
    let   diff = `${tm - tmSt}`;
    diff = pad(diff,4);
    console.log(`  ${diff} ms - ${tag}`);
}


// extracting response text or json
//    *must* also do json processing
const extractText = async rsp => {
    // const cT = rsp.headers.get('content-type');
    // if (cT.startsWith('application/json;')) {
    let txt = await rsp.text(); // not explicitly returning promise
    return txt;
}

// json extraction is always object specific
const extractJsn1 = async rsp => {
    // log(`     content type was ${cT}`);
    // log(`     response type JSON`);
    const jsn = await rsp.json();
    let ress  = jsn.results;
    let urls  = [ress[0].url, ress[1].url, ress[2].url];
    // log({ urls });
    return urls;
}

// json extraction is always object specific
const extractJsn2 = async rsp => {
    const jsn = await rsp.json();
    let name  = jsn.name;
    // log({ name });
    return name;
}

//
const extractTitle = htmlSrc => {

    if (false) {
        // no "document" in node.js
        // node.js would require phantom.js
        var doc = document.createElement('html');
        doc.innerHTML = "<html><head><title>titleTest</title></head><body><a href='test0'>test01</a><a href='test1'>test02</a><a href='test2'>test03</a></body></html>";
        doc.innerHTML = htmlSrc;
        doc.getElementsByTagName('a');
        let title = doc.getElementsByTagName('title')[0];
        return title.innerHTML;
    }

    const p1 = htmlSrc.indexOf("<title");
    if (p1>0) {
        const p1a = htmlSrc.indexOf(">", p1 + 1);
        const p2 = htmlSrc.indexOf("</title>");
        if (p2 > 0) {
            // return htmlSrc.substring(p1a +0, p2 + 1);
            return htmlSrc.substring(p1a +1, p2 + 0);
        }
    } else {
        return "no title tag found";
    }



}


// extracting subset of JSON object properties
//    this never works, since the underlying parsed JSON object
//    is only scoped for inside rsp.json()
//       https://stackoverflow.com/questions/47856533
const fcProcessJSON = jsn => {
    log(`      ----typeof jsn  is ${typeof jsn}`);
    let ress  = jsn.results;
    log(`      ----typeof ress is ${typeof ress}`);
    let urls  = [ress[0].url, ress[1].url, ress[2].url];
    log({ urls });
    // log(`urls are ${urls}`);
    return urls;
}




// creates promise to an HTTP response
//  using XMLHttpRequest() - unsupported in node
//  its better using fetch() - see below
function promiseHTTP_old(URL) {
    let promise = new Promise(function (resolve, reject) {
        let req = new XMLHttpRequest();  // not available in node
        req.open("GET", URL);
        req.onload = () => {
            if (req.status == 200) {
                resolve(req.response);
            } else {
                reject(`bad response status: ${req.status}`);
            }
        };
        req.send();
    });
    return promise;
}


// request executors are invoked at declaration
function promiseHTTP(URL) {

    cntr++;

    {
        let c1 = pad(cntr,2);
        const url1  = URL;
        const pr = fetch(url1);
        // tt(`rspA ${c1} ${url1}`); // invoked instantly

        pr
            .then( rsp => { if (!rsp.ok        ) { throw "resp not ok - 1"; }; return rsp } )
            .then( rsp => { if (!rsp.status>399) { throw "resp not ok - 2"; }; return rsp } )
            .then( rsp => { tt(`  rspHdr ${c1}   ${url1}`); return rsp } )
        ;
        // tt(`rspB ${c1} ${url1}`); // invoked instantly
        return pr;
    }

}



const ALL_POKEMONS_URL = 'https://pokeapi.co/api/v2/pokemon?limit=50';
const POKEMONS_BAD_URL = 'https://pokeapi.co/api/v2/pokemon-bad/';

let prom = promiseHTTP(ALL_POKEMONS_URL);






const consumer1 = () => {
    // instead of catch, second func inside then()
    prom.then(
        (result) => {
            log( {result} );
        },
        (error) => {
            log(`Error is ${error}`);
        });
}

// consumer1();



const consumer2 = () => {
    prom
    .then( extractText )
    .then( txt  => { return JSON.parse(txt);      })
    .then( jsn  => { return jsn.results[0].url;   })
    .then( url  => { log(`url rs ${url}`  );      })
    .catch(err  => { log(err);                    })
    ;

    // all then() clauses could be consolidated,
    // since each implementation body is synchroneous
    // only promises need a separate then() call.
}

// consumer2();




const consumer3 = () => {
    prom
    .then( extractText )
    .then( fcProcessJSON )
    .catch(err  => { log(err); })
    ;
}

// consumer3();



const fetchAll = urls => {

    tt("proms-creation-start");

    let urls2 = [
        "https://www.nytimes.com",

        "https://www.wsj.com",
        "https://www.google.com",
        "https://www.welt.de",
        "https://www.zew.de",

        // "https://www.spiegel.de",
        // "https://www.heise.de",
        // "https://www.google.com",
        // "https://www.microsoft.com?a=1",
        // "https://www.microsoft.com?a=2",
        // "https://www.microsoft.com?a=3",
    ];



    let proms = []
    urls.map(
        // promise executor is completed, but fetch is not started
        url => {  let c1 = pad(cntr+1, 2);   proms.push(  promiseHTTP(url).then( extractJsn2).then(txt => { tt(`  rspBdy ${c1}   ${url}`); return txt })  ) ; }
    );
    urls2.map(
        // promise executor is completed, but fetch is not started
        url => {  let c1 = pad(cntr+1, 2);   proms.push(  promiseHTTP(url).then( extractText).then(txt => { tt(`  rspBdy ${c1}   ${url}`); return txt })  ) ; }
    );

    tt("proms-creation-stop");

    waitSync(100);
    resetTime();

    // Promise.race()...
    const promsAll = Promise.all(proms);
    return promsAll;
}

// regardless of how construct it
//     syncWait(100) makes the *effective* execution sequential.
//     But db.insert(x) or fetch(y) would run parallel.
const extractAllTitles = htmlSrcs => {

    tt("proms-creation-extract-title-start");

    let proms = []
    htmlSrcs.map(
        src => {    
            const prom2 = new Promise((resolve, reject) => {   
                setTimeout( 
                    () => {

                        // waitSync(200);
                        waitDoeventsUntil(100);
                        doEvents1();
                        doEvents2();

                        waitSync(200);

                        // tt(`  prom title invoked`);
                        const title = extractTitle(src);
                        tt(`  htmlT ${title}`);

                        resolve(title);

                        if (1 > 2 + 3) {
                            reject("err");
                        }
                    }
                    , 0
                );
            });
            proms.push(prom2);
            // tt(`  prom title pushed`);
        }
    );


    if (1>2) {        
        for (let src of htmlSrcs) {
            let prom = Promise.resolve();    
            prom = prom.then(
                () => {
                    const title = extractTitle(src);
                    tt(`  htmlT ${title}`);
                    waitSync(100);
                }
            );
        }
    }


    tt("proms-creation-extract-title-stop");

    const promsAll = Promise.all(proms);
    return promsAll;
}

/* process in parallel - log in sequence */

const consumer4 = () => {

    prom
        .then( extractJsn1 )
        .then( urls  => { tt("consu-4-urls"); return urls })
        // .then( urls  => { log({ urls }); return urls; })
        .then( fetchAll )
        // // .then( ress  => { log({ ress }) })  // log responses
        .then( extractAllTitles  )
        .then( ()    => { tt("consu-4-success") })
        .catch(err   => { log(  err  ); })
    ;

};

consumer4();

