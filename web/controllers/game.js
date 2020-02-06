const Common = require("../includes/common"),
    GameModel = require("../../src/models/game"),
    GameView = require("../../public/views/game.js"),
    NotFoundView = require("../../public/views/404");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//   ###
//  #   #
//  #       ###   ## #    ###
//  #          #  # # #  #   #
//  #  ##   ####  # # #  #####
//  #   #  #   #  # # #  #
//   ###    ####  #   #   ###
/**
 * A class that represents the game page.
 */
class Game {
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
     * @returns {void}
     */
    static get(req, res) {
        const ip = req.params.ip,
            gameModel = GameModel.getByIp(ip);

        let game;
        try {
            game = JSON.parse(JSON.stringify(gameModel));
        } catch (err) {
            res.status(404).send(Common.page(
                "",
                {
                    css: ["/css/error.css"]
                },
                NotFoundView.get({message: "Game not found."}),
                req
            ));
            return;
        }

        if (!game) {
            res.status(404).send(Common.page(
                "",
                {
                    css: ["/css/error.css"]
                },
                NotFoundView.get({message: "Game not found."}),
                req
            ));
            return;
        }

        if (game.projectedEnd) {
            game.countdown = new Date(game.projectedEnd).getTime() - new Date().getTime();
            delete game.projectedEnd;
        }

        if (game.startTime) {
            game.elapsed = new Date().getTime() - new Date(game.startTime).getTime();
            delete game.startTime;
        }

        game.condition = GameModel.getCondition(game);

        res.setHeader("Cache-Control", "no-cache, max-age=0, must-revalidate, no-store");

        res.status(200).send(Common.page(
            "",
            {
                js: [
                    "/js/common/timeago.min.js",
                    "/js/common/clipboard.min.js",
                    "/js/common/clipboard.js",
                    "/views/common/score.js",
                    "/views/common/details.js",
                    "/views/common/players.js",
                    "/views/common/events.js",
                    "/js/common/websocketclient.js",
                    "/js/common/countdown.js",
                    "/js/common/elapsed.js",
                    "/js/common/player.js",
                    "/js/common/game.js",
                    "/js/game.js"
                ],
                css: ["/css/game.css"]
            },
            GameView.get(game),
            req
        ));
    }
}

Game.route = {
    path: "/game/:ip"
};

module.exports = Game;
