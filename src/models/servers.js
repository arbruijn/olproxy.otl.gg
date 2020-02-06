const Db = require("../database/servers"),
    Game = require("./game"),
    Websocket = require("../websocket");

let servers = [];

//   ###
//  #   #
//  #       ###   # ##   #   #   ###   # ##    ###
//   ###   #   #  ##  #  #   #  #   #  ##  #  #
//      #  #####  #       # #   #####  #       ###
//  #   #  #      #       # #   #      #          #
//   ###    ###   #        #     ###   #      ####
/**
 * A class that represents the servers currently online.
 */
class Servers {
    //              #    #  #   #            #    #     ##
    //              #    #  #                     #      #
    //  ###   ##   ###   #  #  ##     ###   ##    ###    #     ##
    // #  #  # ##   #    #  #   #    ##      #    #  #   #    # ##
    //  ##   ##     #     ##    #      ##    #    #  #   #    ##
    // #      ##     ##   ##   ###   ###    ###   ###   ###    ##
    //  ###
    /**
     * Gets the list of visible servers.
     * @returns {Promise<object[]>} A promise that resolves with the servers.
     */
    static async getVisible() {
        const now = new Date();

        if (servers.length === 0) {
            servers = await Db.getVisible();
        }

        const serverInfo = JSON.parse(JSON.stringify(servers));

        serverInfo.forEach((server) => {
            const game = Game.getByIp(server.ip);

            if (game && game.inLobby && game.settings) {
                if (game.settings.players && game.settings.maxPlayers) {
                    server.numPlayers = game.settings.players.length;
                    server.maxNumPlayers = game.settings.maxPlayers;
                } else {
                    server.numPlayers = 0;
                    server.maxNumPlayers = 0;
                }

                if (game.settings.level) {
                    server.map = `${game.settings.level}`;
                } else {
                    server.map = "";
                }

                if (game.settings.matchMode) {
                    server.mode = `${game.settings.matchMode}`;
                } else {
                    server.mode = "";
                }
            }

            server.old = now.getTime() - new Date(server.lastSeen).getTime() > 60 * 60 * 1000;
        });

        return serverInfo.filter((s) => s.keepListed && new Date().getTime() - new Date(s.lastSeen).getTime() < 30 * 24 * 60 * 60 * 1000 || new Date().getTime() - new Date(s.lastSeen).getTime() < 60 * 60 * 1000);
    }

    //                #         #
    //                #         #
    // #  #  ###    ###   ###  ###    ##
    // #  #  #  #  #  #  #  #   #    # ##
    // #  #  #  #  #  #  # ##   #    ##
    //  ###  ###    ###   # #    ##   ##
    //       #
    /**
     * Updates the data for a server.
     * @param {string} ip The IP address of the server to update.
     * @param {object} data The data to update the server with.
     * @param {boolean} [visible] Whether the server should be visible.
     * @returns {Promise} A promise that resolves when the server has been updated.
     */
    static async update(ip, data, visible) {
        let server = servers.find((s) => s.ip === ip);

        if (!server) {
            server = await Db.getByIp(ip);

            if (!server || !server.ip) {
                server = {ip};
            }

            if (visible) {
                servers.push(server);
            }
        }

        if (!visible) {
            const index = servers.indexOf(server);
            if (index !== -1) {
                servers.splice(index, 1);
            }
        }

        Object.keys(data).forEach((key) => {
            if (data[key]) {
                if (key === "gameStarted") {
                    server[key] = new Date();
                } else {
                    server[key] = data[key];
                }
            }
        });

        delete server.numPlayers;
        delete server.maxNumPlayers;
        delete server.map;
        delete server.mode;

        server.lastSeen = new Date();

        Websocket.broadcast({
            ip,
            data: {
                name: "Server",
                server: visible ? server : void 0,
                visible
            }
        });

        await Db.update(server, visible);
    }
}

module.exports = Servers;
