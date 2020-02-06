/**
 * @typedef {import("ws")} WebSocket
 */

const WS = require("../../src/websocket");

//   ###
//  #   #
//  #       ###   ## #    ###
//  #          #  # # #  #   #
//  #  ##   ####  # # #  #####
//  #   #  #   #  # # #  #
//   ###    ####  #   #   ###
/**
 * A websocket to handle connections to a game.
 */
class Game {
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

Game.route = {
    path: "/game/:ip",
    webSocket: true
};

module.exports = Game;
