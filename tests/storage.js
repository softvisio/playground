#!/usr/bin/env -S node

import Api from "#core/api";
import Message from "#core/message";

const api = new Api( "ws://devel/api" );

var res;

const path = "/encrypted/4.txt";

res = await api
    .upload( "test/upload", {
        "file": Message.new( {
            "headers": {
                "content-type": "text/plain",
                "content-disposition": {
                    "type": "inline",
                },
            },
            "body": "text",
        } ),
        "options": {
            path,

            // "cacheControl": "max-age=1",
            "contentDisposition": "inline",
            "lastModified": "Sat, 28 Mar 2026 00:00:00 GMT",
        },
    } )
    .start();
console.log( res );

res = await api.download( "test/download-api", res.data.filePath );
console.log( res.data );
console.log( await res.data.body?.buffer() );

process.exit();
