var util = require('util');


function AppError(message){
    Error.call(this, message);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
    this.name = this.constructor.name;
}
util.inherits(AppError, Error);


function HttpResponseError(message, statusCode){
    AppError.call(this, message);
    this.status = statusCode || 400;
}
util.inherits(HttpResponseError, AppError);


/*
 * 400 Bad Request
 */
function BadRequest(message){
    message = message || 'Server nedokázal interpretovat syntaxi požadavku.';
    HttpResponseError.call(this, message, 400);
}
util.inherits(BadRequest, HttpResponseError);


/*
 * 401 Unauthorized
 */
function Unauthorized(message){
    message = message || 'Chybná autorizace.';
    HttpResponseError.call(this, message, 401);
}
util.inherits(Unauthorized, HttpResponseError);


/*
 * 403 Forbidden
 */
function Forbidden(message){
    message = message || 'Chybí dostatečná oprávnění pro vykonání požadavku.';
    HttpResponseError.call(this, message, 403);
}
util.inherits(Forbidden, HttpResponseError);


/*
 * 404 Not Found
 */
function NotFound(message){
    message = message || 'Stránka nebyla nalezena.';
    HttpResponseError.call(this, message, 404);
}
util.inherits(NotFound, HttpResponseError);


/*
 * 406 Not Acceptable
 */
function NotAcceptable(message){
    message = message || 'Požadavek na formát, který není podporován.';
    HttpResponseError.call(this, message, 406);
}
util.inherits(NotAcceptable, HttpResponseError);


/*
 * 415 Unsupported Media Type
 */
function UnsupportedMediaType(message){
    message = message || 'Zaslaná data jsou ve formátu, který není podporován.';
    HttpResponseError.call(this, message, 415);
}
util.inherits(UnsupportedMediaType, HttpResponseError);


module.exports = {
    AppError: AppError,
    BadRequest: BadRequest,
    Forbidden: Forbidden,
    HttpResponseError: HttpResponseError,
    NotFound: NotFound,
    NotAcceptable: NotAcceptable,
    UnsupportedMediaType: UnsupportedMediaType,
    Unauthorized: Unauthorized
};
