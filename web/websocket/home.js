/**
 * @typedef {import("ws")} WebSocket
 */

const WS = require("../../src/websocket");

//  #   #
//  #   #
//  #   #   ###   ## #    ###
//  #####  #   #  # # #  #   #
//  #   #  #   #  # # #  #####
//  #   #  #   #  # # #  #
//  #   #   ###   #   #   ###
/**
 * A websocket to handle connections to the home page.
 */
class Home {
    //       ##
    //        #
    //  ##    #     ##    ###    ##
    // #      #    #  #  ##     # ##
    // #      #    #  #    ##   ##
    //  ##   ###    ##   ###     ##
    /**
     * Close the websocket.
     * @param {WebSocket} ws The websocket.
     * @returns {void}
     */
    static close(ws) {
        WS.unregister(ws);
    }

    //  #           #     #
    //                    #
    // ##    ###   ##    ###
    //  #    #  #   #     #
    //  #    #  #   #     #
    // ###   #  #  ###     ##
    /**
     * Initializes the websocket.
     * @param {WebSocket} ws The websocket.
     * @returns {void}
     */
    static init(ws) {
        WS.register(ws);
    }
}

Home.route = {
    path: "/",
    webSocket: true
};

module.exports = Home;
