var url = require('url'),
    http = require('http'),
    https = require('https');

exports.isWord = function(word){
    var word = word || '';
    return ((word.indexOf(' ') === -1) && (word.indexOf(',') === -1) && (word.length >= 3));
};

exports.isUrl = function(u){
    var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return pattern.test(u);
};

exports.testFullUrl = function(req, path){
    return req.protocol + '://' + req.headers.host + '/' + path;
};

exports.httpSwitcher = function(u){
    var parseUrl = url.parse(u);
    if (parseUrl.protocol === 'https:') return https;
    return http;
};

exports.getHostname = function(u){
    var parseUrl = url.parse(u);
    return parseUrl.hostname;
};

exports.getBasicUrl = function(u){
    var parseUrl = url.parse(u);
    return parseUrl.protocol + '//' + parseUrl.hostname + '/';
};

exports.getFullUrl = function(absPath, relPath){
    var parseUrlAbs = url.parse(absPath),
        parseUrlRel = url.parse(relPath);

    if (parseUrlRel.protocol) {
        return relPath;
    } else if (relPath.substr(0, 2) === '//') {
        return 'http:' + relPath;
    } else if (relPath.substr(0, 1) === '/') {
        return parseUrlAbs.protocol + '//' + parseUrlAbs.hostname + relPath;
    } else {
        return absPath.substr(0, absPath.lastIndexOf('/') + 1) + relPath;
    }
};

exports.getSlug = function(u){
    return u.substring(u.lastIndexOf('/') + 1);
};

exports.getDoctype = function(root){
    var doctypeLine = root[0].children[0].data,
        doctype = 'HTML';

    if (doctypeLine) {
        doctypeLine = doctypeLine.toUpperCase();
        if ((doctypeLine).indexOf('PUBLIC') == -1) {
            doctype = 'HTML5';
        } else if ((doctypeLine).indexOf('XHTML') != -1) {
            doctype = 'XHTML';
        }

        if ((doctypeLine).indexOf('0.1') != -1) {
            doctype += ' 0.1';
        } else if ((doctypeLine).indexOf('1.0') != -1) {
            doctype += ' 1.0';
        } else if ((doctypeLine).indexOf('1.1') != -1) {
            doctype += ' 1.1';
        }

        if ((doctypeLine).indexOf('STRICT') != -1) {
            doctype += ' Strict';
        } else if ((doctypeLine).indexOf('TRANSITIONAL') != -1) {
            doctype += ' Transitional';
        } else if ((doctypeLine).indexOf('FRAMESET') != -1) {
            doctype += ' Frameset';
        } else if ((doctypeLine).indexOf('BASIC') != -1) {
            doctype += ' Basic ';
        }
    }
    return doctype;
};

exports.getDomainAge = function(data, type){
    switch (type) {
        case 1:
            return new Date(data[0].substr(0, 3) + ' ' + data[1] + '-' + data[2]) || new Date();
        case 2:
            for (var i = 0; i < data.length; i++) {
                if (data[i].indexOf('registered:') !== -1) {
                    var date = (data[i].replace(/registered:/g, '')).trim().substr(0, 10).split('.');
                    return new Date(date[2] + '-' + date[1] + '-' + date[0]) || new Date();
                }
            }
            break;
        default:
            for (var i = 0; i < data.length; i++) {
                if (data[i].indexOf('created:') !== -1) {
                    var date = (data[i].replace(/created:/g, '')).trim().substr(0, 10).split('.');
                    return new Date(date[2] + '-' + date[1] + '-' + date[0]) || new Date();
                }
            }
    }
    return new Date();
};