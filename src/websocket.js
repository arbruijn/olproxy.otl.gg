/**
 * @typedef {import("ws")} WebSocket
 */

const gameMatch = /\/game\/(?<ip>.*)/;

/**
 * @type {WebSocket[]}
 */
const clients = [];

//  #   #         #                           #              #
//  #   #         #                           #              #
//  #   #   ###   # ##    ###    ###    ###   #   #   ###   ####
//  # # #  #   #  ##  #  #      #   #  #   #  #  #   #   #   #
//  # # #  #####  #   #   ###   #   #  #      ###    #####   #
//  ## ##  #      ##  #      #  #   #  #   #  #  #   #       #  #
//  #   #   ###   # ##   ####    ###    ###   #   #   ###     ##
/**
 * A class used for communication via websockets.
 */
class Websocket {
    // #                          #                      #
    // #                          #                      #
    // ###   ###    ##    ###   ###   ##    ###   ###   ###
    // #  #  #  #  #  #  #  #  #  #  #     #  #  ##      #
    // #  #  #     #  #  # ##  #  #  #     # ##    ##    #
    // ###   #      ##    # #   ###   ##    # #  ###      ##
    /**
     * Broadcasts a message to qualifying connected websocket clients.
     * @param {object} message The message to send.
     * @returns {void}
     */
    static broadcast(message) {
        const str = JSON.stringify(message);

        clients.forEach((client) => {
            if (client.readyState !== 1) {
                return;
            }

            if (client.url === "/") {
                client.send(str);
            } else if (gameMatch.test(client.url)) {
                const {groups: {ip}} = gameMatch.exec(client.url);

                if (message.ip === ip) {
                    client.send(str);
                }
            }
        });
    }

    //                    #            #
    //                                 #
    // ###    ##    ###  ##     ###   ###    ##   ###
    // #  #  # ##  #  #   #    ##      #    # ##  #  #
    // #     ##     ##    #      ##    #    ##    #
    // #      ##   #     ###   ###      ##   ##   #
    //              ###
    /**
     * Registers a websocket for broadcasting.
     * @param {WebSocket} ws The websocket to broadcast to.
     * @returns {void}
     */
    static register(ws) {
        clients.push(ws);
    }

    //                                #            #
    //                                             #
    // #  #  ###   ###    ##    ###  ##     ###   ###    ##   ###
    // #  #  #  #  #  #  # ##  #  #   #    ##      #    # ##  #  #
    // #  #  #  #  #     ##     ##    #      ##    #    ##    #
    //  ###  #  #  #      ##   #     ###   ###      ##   ##   #
    //                          ###
    /**
     * Unregisters a websocket from broadcasting.
     * @param {WebSocket} ws The websocket to stop broadcasting to.
     * @returns {void}
     */
    static unregister(ws) {
        clients.splice(clients.indexOf(ws), 1);
    }
}

module.exports = Websocket;
