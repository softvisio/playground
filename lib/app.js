import net from "node:net";
import App from "#core/app";
import stream from "#core/stream";

export default class extends App {

    // propeties
    get location () {
        return import.meta.url;
    }

    // protected
    async _init () {
        return result( 200 );
    }

    async _start () {
        this.publicHttpServer.get( "/slice", async req => {
            console.log( "---", req.headers );

            const body = stream.Readable.from( "a".repeat( 1024 * 2 ), { "objectMode": false } );

            req.end( {
                "status": 200,
                "headers": {
                    "accept-ranges": "bytes",
                    "content-type": "text/html",

                    "cache-control": "public, max-age=300",

                    "etag": { "etag": "a" },
                    "last-modified": new Date(),
                },
                body,
                "options": {
                    "compress": null,
                },
            } );
        } );

        // setInterval( () => {
        //     this.publishToRpc( "test", "rpc", 1, 2, 3 );

        //     this.publishToApi( "test/", ["root"], "api", 4, 5, 6 );
        // }, 2000 );

        // this.on( "api/test1", ( ctx, ...args ) => console.log( "--- incoming", "test", ctx.user.id, ...args ) );

        // test cluster events
        // const id = Math.floor( Math.random() * 1000 );
        // this.on( "/test", data => ( data.id === id ? "" : console.log( "--- test", data ) ) );
        // setInterval( () => this.publish( "/test", { id, "timestamp": Date.now() } ), 1000 );

        // setInterval( () => {
        // this.publishToApi( "/test/", ["guests"] );

        //     this.notifications.sendNotification( "other", -1, "test", "test" );
        // }, 3000 );

        // XXX
        await this._testStorage();

        // var res;

        // res = await this.telegram.bots.getBotById( 1 ).files.createFile( {
        //     "fileId": "BQACAgIAAxkBAAIFp2UdnrxoXd_Z6u8NcO6gcB_8Nq1jAAKdOwACn-TxSLBmHg8FX1lKMAQ",
        //     "fileUniqueId": "AgADnTsAAp_k8Ug",
        //     "filename": "image.jpg",
        //     "contentType": "image/jpeg",
        // } );
        // console.log( res );

        // res = await this.telegram.bots.getBotById( 1 ).files.getFile( "BQACAgIAAxkBAAIFp2UdnrxoXd_Z6u8NcO6gcB_8Nq1jAAKdOwACn-TxSLBmHg8FX1lKMAQ" );

        // // res = await this.telegram.bots.getBotById( 1 ).files.getFile( 1 );
        // console.log( res );

        // await this._testNginx();

        return super._start();
    }

    async _startThreads () {
        return this.threads.start( {
            "worker": {
                "numberOfThreads": 1,
                "module": new URL( "threads/worker.js", import.meta.url ),
                "args": [
                    {
                        "dbh": this.dbh,
                    },
                ],
            },
        } );
    }

    // curl "https://local.softvisio.net/"
    async _testNginx () {
        this.publicHttpServer.get( "/test", req => req.end() );

        this.nginx?.proxies.add( {
            "test": {
                "upstreamPort": 9999,
                "upstreamProxyProtocol": true,
                "serverNames": [

                    //
                    "test",
                    "*.local.softvisio.net",
                ],
                "servers": [
                    {
                        "port": 8043,
                        "type": "http",
                    },
                    {
                        "port": 8022,
                        "type": "http",

                        // "httpsRedirectPort": 443,
                    },
                    {
                        "port": 4433,

                        // "type": "tcp",
                        "ssl": true,

                        // "hstsMaxAge": "1 day",
                    },
                ],
                "upstreams": [

                    //
                    "127.0.0.1",
                ],
            },
        } );

        const server = new net.Server();

        server.on( "connection", async socket => {
            const data = await socket.readLine( { "eol": "\r\n\r\n", "encoding": "latin1", "maxLength": 1000 } ).catch( e => null );

            console.log( "---", data );

            socket.end( "HTTP/1.1 200 OK\r\n\r\n" );
        } );

        server.listen( 9999, "0.0.0.0" );
    }

    // curl -v "http://devel/storage/encrypted/test.txt" -H "Cache-Control: no-cache" -r2-4
    async _testStorage () {
        var res;

        const path = "/encrypted/test.txt";

        res = await this.storage.upload( path, new Blob( [ "1234567890" ] ) );
        console.log( "--- UPLOAD:", res + "" );
        if ( !res.ok ) process.exit();

        console.log( "--- GLOB:", await this.storage.glob( "**", { "cwd": "/1" } ) );

        // res = await this.storage.deleteFiles( path );
        // console.log( "--- DELETE:", res + "" );
        // if ( !res.ok ) process.exit();

        // await this.storage.clear();

        // res = await this.storage.copyFile( path, path + ".COPY" );
        // console.log( res );
    }
}
