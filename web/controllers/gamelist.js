const Common = require("../includes/common"),
    Completed = require("../../src/models/completed"),
    GameListView = require("../../public/views/gamelist");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//   ###                        #        #            #
//  #   #                       #                     #
//  #       ###   ## #    ###   #       ##     ###   ####
//  #          #  # # #  #   #  #        #    #       #
//  #  ##   ####  # # #  #####  #        #     ###    #
//  #   #  #   #  # # #  #      #        #        #   #  #
//   ###    ####  #   #   ###   #####   ###   ####     ##
/**
 * A class that represents the game list page.
 */
class GameList {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Processes the request.
     * @param {express.Request} req The request.
     * @param {express.Response} res The response.
     * @returns {Promise} A promise that resolves when the request is complete.
     */
    static async get(req, res) {
        const games = await Completed.getList(1);

        res.status(200).send(Common.page(
            "",
            {
                js: [
                    "/views/gamelist/game.js",
                    "/views/gamelist/games.js",
                    "/js/gamelist.js"
                ],
                css: ["/css/gamelist.css"]
            },
            GameListView.get({games}),
            req
        ));
    }
}

GameList.route = {
    path: "/gamelist"
};

module.exports = GameList;
