var diacritics = require(process.cwd() + '/lib/filters/diacritics'),
    stopWords = require(process.cwd() + '/lib/filters/stopwords');

function getDiacritics(hist, text){
    var textArray = text.match(/[^\s]+|\s+[^\s+]$/g),
        limit = 0,
        newHist = [];

    for (var j = 0; j < hist.length; j++) {
        if (limit == 20) break;
        if (hist[j][0].length > 2) {
            for (var i = 0; i < textArray.length; i++) {
                if (hist[j][0] === diacritics(textArray[i])) {
                    newHist.push({word: textArray[i], count: hist[j][1]});
                    limit++;
                    break;
                }
                if (i == textArray.length - 1) {
                    newHist.push({word: hist[j][0], count: hist[j][1]});
                    limit++;
                }
            }
        }
    }

    return newHist;
}

function getWordFrequency(text, lang){
    var words = removeStopWords(text, lang),
        hist = {};

    if (words) {
        for (var i = 0; i < words.length; i++) {
            if (words[i].length > 1) {
                hist[words[i]] ? hist[words[i]] += 1 : hist[words[i]] = 1;
            }
        }

        hist = sortWordFrequency(hist);
        hist = getDiacritics(hist, text);
        return hist;
    }
    return [];
}

function removeStopWords(text, lang){
    var cleanStr = diacritics(text),
        stopStr = stopWords(cleanStr, lang),
        words = stopStr.split(/[\s*\.*\,\;\+?\#\|:\-\/\\\[\]\(\)\{\}$%&0-9*]/),
        longerWords = [];

    if (words) {
        for (var i = 0; i < words.length; i++) {
            if (words[i].length > 2) {
                longerWords.push(words[i]);
            }
        }
        return longerWords;
    }
    return [];
}

function sortWordFrequency(wordFrequency){
    var topList = [];

    for (var pair in wordFrequency) {
        topList.push([pair, wordFrequency[pair]]);
    }
    topList.sort(function(a, b){
        return b[1] - a[1];
    });

    return topList;
}

exports = module.exports = {
    getWordFrequency: getWordFrequency,
    sortWordFrequency: sortWordFrequency,
    removeStopWords: removeStopWords
};