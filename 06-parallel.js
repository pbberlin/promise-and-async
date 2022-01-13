// https://web.dev/promises/
// https://web.dev/async-functions/


// Loop through chapter urls - 
//    and fetch them in order
// 
// This doesn't work:
story.chapterUrls.forEach(function (chapterUrl) {
    getJSON(chapterUrl).then(function (chapter) {
        addHtmlToPage(chapter.html);
    });
})

// forEach() is *NOT* async-aware, 
// => chapters would appear in whatever order they download



// Seed with a promise that always resolves
var sequence = Promise.resolve();

// Loop through our chapter urls
story.chapterUrls.forEach(function (chapterUrl) {
    // Add these actions to the end of the sequence
    // chaining promises
    sequence = sequence.then(function () {
        return getJSON(chapterUrl);
    }).then(function (chapter) {
        addHtmlToPage(chapter.html);
    });
})
