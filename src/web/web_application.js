'use strict';
let PhinkJS = global.PhinkJS || {};

PhinkJS.BaseRouter = require('../core/base_router.js');

PhinkJS.Web = PhinkJS.Web || {};
PhinkJS.Web.Object = require('./web_object.js');
PhinkJS.Web.Router = require('./web_router.js');

PhinkJS.Rest = PhinkJS.Rest || {};
PhinkJS.Rest.Router = require('../rest/rest_router.js');

require('../bootstrap');

PhinkJS.Web.Application = class F extends PhinkJS.Web.Object {
    constructor() {
        super(this);

        this._headers = null;
    }

    get headers() {
        return this._headers;
    }

    static create(url, options, callback) {

        const baseurl = require('url').parse(url);
        let port = baseurl.port;

        //baseurl.protocol == 'https' && 
        if(options !== undefined && options.key !== undefined && options.cert !== undefined) {
            const fs = require("fs");

            if(fs.existsSync(global.APP_CERT + options.key) 
            && fs.existsSync(global.APP_CERT + options.cert)) {
                options.key = fs.readFileSync(global.APP_CERT + options.key);
                options.cert = fs.readFileSync(global.APP_CERT + options.cert);
            }
            console.log('Is secure');
            require('https').createServer(options, function(req, res) {
                F.engine(req, res, callback);
            }).listen(port);

        } else {
            require('http').createServer(function(req, res) {
                F.engine(req, res, callback);
            }).listen(port);

        }

    }

    static engine (req, res, callback) {
        
        let body = [];
        let self = this;

        req.on('error', function (err) {
            console.error(err);
        }).on('data', function (chunk) {
            body.push(chunk);
        }).on('end', function () {

            body = Buffer.concat(body).toString();
            req.on('error', function (err) {
                console.error(err);
            })

            let router = new PhinkJS.BaseRouter(this, req, res);
            router.match();

            if (router.requestType === 'rest') {
                router = new PhinkJS.Rest.Router(router);
            } else {
                router = new PhinkJS.Web.Router(router);
            }

            if(body !== '') {
                Object.assign(router._parameters, JSON.parse(body));
            }
            
            router.translate(function (exists) {
                if (exists) {
                    router.dispatch(function (req, res, stream) {
                        self._headers = req.headers;
                        if (typeof callback === 'function') {
                            callback(req, res, stream);
                        }

                        res.write(stream);
                        req.emit('finish');
                    });
                } else {
                    res.writeHead(404, {
                        'Content-Type': router.mimeType
                    });
                    res.write("Error 404 - It looks like you are lost in middle of no ware ...");
                    req.emit('finish');
                }
            });

        }).on('finish', function () {
            res.end();
            req.emit('close');
        }).on('close', function () {
            req = null;
            res = null;
        });

    }
}

module.exports = PhinkJS.Web.Application;
