// https://web.dev/promises/
// https://web.dev/async-functions/


function successCallback(result) { console.log(  "Audio file ready at URL: " + result);  }
function failureCallback(error) {  console.error("Error generating audio:  " + error );  }

// chaining promises
const prom1 = Promise.resolve();
const prom2 = prom1.then(successCallback, failureCallback);


asyncThing1().then(  
    ()    => {  return asyncThing2();     }
)
    .then(  
        ()    => {  return asyncThing3();     }
    )
    .catch( 
        (err) => {  return asyncRecovery1();  }
    )
        .then(  
            ()    => {  return asyncThing4();     },  
            (err) => {  return asyncRecovery2();  }
        ).catch( 
            (err) => {  console.log("Don't worry about it");    }
        )
            .then(  
                ()    => {  console.log("All done!");    }
            )



function usePromiseAsync1() {

    do1()
        .then(res1 => do2(res1))
            .then(res2 => do3(res2))
                .then(res3 => console.log(`final result ${res3}`))
    .catch(failureCallback);

}

function usePromiseSync() {

    try {
        const res1 = syncDo1();
        const res2 = syncDo2(res1);
        const res3 = syncDo3(res2);
        console.log(`Got the final result: ${res3}`);
    } catch (error) {
        failureCallback(error);
    }
}

async function usePromiseAsync3() {

    try {
        const res1 = await syncDo1();
        const res2 = await syncDo2(res1);
        const res3 = await syncDo3(res2);
        console.log(`Got the final result: ${res3}`);
    } catch (error) {
        failureCallback(error);
    }
}


