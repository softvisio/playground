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

        async [ "API_upload" ] ( ctx, { file, options } ) {
            console.log( "--- upload:" );
            console.log( options );
            console.log( file.name, file.size );

            const res = await this.app.storage.upload(
                filename,
                {
                    "headers": {
                        "contentType": file.type,
                        "cacheControl": "private, must-revalidate",
                    },
                    "body": file,
                },
                {

                    // "ttl": 1000 * 30, // 30 sec.
                }
            );

            console.log( "--- storage", res + "" );

            return result( 200 );
        }

        async [ "API_download" ] ( ctx ) {
            return result( 200, {
                "url": this.app.storage.getFileUrl( filename ),
            } );
        }

        async [ "API_download-api" ] ( ctx ) {
            return result( 200, await this.app.storage.downloadFile( filename ) );
        }

        async [ "API_send-notification" ] ( ctx ) {
            await this.app.notifications.sendNotification(
                "test",
                ctx.user.id,
                l10nt( locale => locale.l10n( "Test" ) ),
                l10nt( locale =>
                    locale.l10n( msgid`The Request a Test Notification endpoint prompts the App Store server to send your server a notification with the TEST notificationType.

Date: ${ locale.formatDate( new Date() ) }
` ) )
            );

            return result( 200 );
        }

        async [ "API_send-acl-notification" ] ( ctx ) {
            await this.app.acl.sendAclNotification(
                -1,
                "test",
                l10nt( locale => locale.l10n( "ACL Test" ) ),
                l10nt( locale =>
                    locale.l10n( msgid`The Request a Test Notification endpoint prompts the App Store server to send your server a notification with the TEST notificationType.

Date: ${ locale.formatDate( new Date() ) }
` ) )
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
