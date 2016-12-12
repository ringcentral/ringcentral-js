/**
 * @param {Externals} options.externals
 * @param {Request} [options.request]
 * @param {Response} [options.response]
 * @param {string} [options.responseText]
 * @property {Externals} _externals
 * @property {Request} _request
 * @property {Response} _response
 * @property {string} _text
 * @property {object} _json
 * @property {ApiResponse[]} _multipart
 */
function ApiResponse(options) {

    /** @private */
    this._externals = options.externals;

    /** @private */
    this._request = options.request;

    /** @private */
    this._response = options.response;

    /** @private */
    this._text = options.responseText || '';

    /** @private */
    this._json = null;

    /** @private */
    this._multipart = [];

}

ApiResponse._contentType = 'Content-Type';
ApiResponse._jsonContentType = 'application/json';
ApiResponse._multipartContentType = 'multipart/mixed';
ApiResponse._urlencodedContentType = 'application/x-www-form-urlencoded';
ApiResponse._headerSeparator = ':';
ApiResponse._bodySeparator = '\n\n';
ApiResponse._boundarySeparator = '--';
ApiResponse._unauthorizedStatus = 401;

/**
 * @param {Response} response
 * @return {Promise<ApiResponse>}
 */
ApiResponse.prototype.receiveResponse = function(response) {

    this._response = response;

    return (new this._externals.Promise(function(resolve) {

        // Ignore if not textual type
        if (!this._isMultipart() && !this._isJson()) return resolve('');

        return resolve(this.response().text());

    }.bind(this))).then(function(text) {

        this._text = text;
        return text;

    }.bind(this));

};

/**
 * @return {Response}
 */
ApiResponse.prototype.response = function() {
    return this._response;
};

/**
 * @return {Request}
 */
ApiResponse.prototype.request = function() {
    return this._request;
};

/**
 * @return {boolean}
 */
ApiResponse.prototype.ok = function() {
    return this._response && this._response.ok;
};

/**
 * @return {string}
 */
ApiResponse.prototype.text = function() {
    // Since we read text only in case JSON or Multipart
    if (!this._isJson() && !this._isMultipart()) throw new Error('Response is not text');
    return this._text;
};

/**
 * @return {object}
 */
ApiResponse.prototype.json = function() {
    if (!this._isJson()) throw new Error('Response is not JSON');
    if (!this._json) {
        this._json = this._text ? JSON.parse(this._text) : null;
    }
    return this._json;
};

/**
 * @param [skipOKCheck]
 * @return {string}
 */
ApiResponse.prototype.error = function(skipOKCheck) {

    if (this.ok() && !skipOKCheck) return null;

    var message = (this._response && this._response.status ? this._response.status + ' ' : '') +
                  (this._response && this._response.statusText ? this._response.statusText : '');

    try {

        if (this.json().message) message = this.json().message;
        if (this.json().error_description) message = this.json().error_description;
        if (this.json().description) message = this.json().description;

    } catch (e) {}

    return message;

};

/**
 * If it is not known upfront what would be the response, client code can treat any response as multipart
 * @return {ApiResponse[]}
 */
ApiResponse.prototype.toMultipart = function() {
    if (!this._isMultipart()) return [this];
    return this.multipart();
};

/**
 * @return {ApiResponse[]}
 */
ApiResponse.prototype.multipart = function() {

    if (!this._isMultipart()) throw new Error('Response is not multipart');

    if (!this._multipart.length) {

        // Step 1. Split multipart response

        var text = this.text();

        if (!text) throw new Error('No response body');

        var boundary = this._getContentType().match(/boundary=([^;]+)/i)[1];

        if (!boundary) throw new Error('Cannot find boundary');

        var parts = text.toString().split(ApiResponse._boundarySeparator + boundary);

        if (parts[0].trim() === '') parts.shift();
        if (parts[parts.length - 1].trim() == ApiResponse._boundarySeparator) parts.pop();

        if (parts.length < 1) throw new Error('No parts in body');

        // Step 2. Parse status info

        var statusInfo = this._create(parts.shift(), this._response.status, this._response.statusText).json();

        // Step 3. Parse all other parts

        this._multipart = parts.map(function(part, i) {

            var status = statusInfo.response[i].status;

            return this._create(part, status);

        }.bind(this));

    }

    return this._multipart;

};

/**
 * @private
 */
ApiResponse.prototype._isContentType = function(contentType) {
    return this._getContentType().indexOf(contentType) > -1;
};

/**
 * @private
 */
ApiResponse.prototype._getContentType = function() {
    return this._response.headers.get(ApiResponse._contentType) || '';
};

/**
 * @private
 */
ApiResponse.prototype._isMultipart = function() {
    return this._isContentType(ApiResponse._multipartContentType);
};

/**
 * @private
 */
ApiResponse.prototype._isJson = function() {
    return this._isContentType(ApiResponse._jsonContentType);
};

/**
 * Method is used to create ApiResponse object from string parts of multipart/mixed response
 * @param {string} [text]
 * @param {number} [status]
 * @param {string} [statusText]
 * @private
 * @return {ApiResponse}
 */
ApiResponse.prototype._create = function(text, status, statusText) {

    text = text || '';
    status = status || 200;
    statusText = statusText || 'OK';

    text = text.replace(/\r/g, '');

    var headers = new this._externals.Headers(),
        headersAndBody = text.split(ApiResponse._bodySeparator),
        headersText = (headersAndBody.length > 1) ? headersAndBody.shift() : '';

    text = headersAndBody.length > 0 ? headersAndBody.join(ApiResponse._bodySeparator) : null;

    (headersText || '')
        .split('\n')
        .forEach(function(header) {

            var split = header.trim().split(ApiResponse._headerSeparator),
                key = split.shift().trim(),
                value = split.join(ApiResponse._headerSeparator).trim();

            if (key) headers.append(key, value);

        });

    var response = new this._externals.Response(text, {
        headers: headers,
        status: status,
        statusText: statusText
    });

    return new ApiResponse({
        externals: this._externals,
        request: null,
        response: response,
        responseText: text
    });

};

module.exports = ApiResponse;