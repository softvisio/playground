import { sleep } from "#core/utils";

// import sql from "#core/sql";

const filename = "/encrypted/test.txt";

export default Super =>
    class extends Super {
        async [ "API_bench" ] ( ctx ) {
            return result( 200 );
        }

        async [ "API_test" ] ( ctx, delay ) {

            // console.log( "---", "test" );

            if ( super[ "API_test" ] ) await super[ "API_test" ]( ctx );

            if ( delay ) await sleep( delay );

            if ( Math.random() > 0.7 ) {
                const res = await this.#doTest();
                return res;

                // return result.exception( 500 );
            }
            else {
                return result( 200 );
            }
        }

        async [ "API_upload" ] ( ctx, { "file": message, options = {} } ) {
            message.contentDisposition.set( options.contentDisposition );
            message.headers.cacheControl.set( options.cacheControl );
            message.headers.lastModified.set( options.lastModified );

            console.log( "--- upload:", message.headers, options );

            const res = await this.app.storage.upload( options.path || filename, message );

            console.log( "--- upload result:", res );

            return res;
        }

        async [ "API_download" ] ( ctx ) {
            return result( 200, {
                "url": this.app.storage.getFileUrl( filename ),
            } );
        }

        async [ "API_download-api" ] ( ctx, path ) {
            return result( 200, await this.app.storage.downloadFile( path || filename ) );
        }

        async [ "API_send-notification" ] ( ctx ) {
            await this.app.notifications.sendNotification(
                "test",
                ctx.user.id,
                l10nt( locale => locale.l10n( "Test" ) ),
                l10nt( locale => {
                    return locale.l10n( msgid`The Request a Test Notification endpoint prompts the App Store server to send your server a notification with the TEST notificationType.

Date: ${ locale.formatDate( new Date() ) }
` );
                } )
            );

            return result( 200 );
        }

        async [ "API_send-acl-notification" ] ( ctx ) {
            await this.app.acl.sendAclNotification(
                -1,
                "test",
                l10nt( locale => locale.l10n( "ACL Test" ) ),
                l10nt( locale => {
                    return locale.l10n( msgid`The Request a Test Notification endpoint prompts the App Store server to send your server a notification with the TEST notificationType.

Date: ${ locale.formatDate( new Date() ) }
` );
                } )
            );

            return result( 200 );
        }

        async [ "API_send-push-notification" ] ( ctx ) {
            const res = await this.app.notifications.sendPushNotification( ctx.user.id, "Темы", "Тексе сщщбщения" );

            return res;
        }

        // private
        async #doTest () {
            throw new Error( "Test exception thrown" );

            // return this.dbh.select( sql`SELECT * FROM fake` );
        }
    };
