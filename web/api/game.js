const Completed = require("../../src/models/completed");

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
 * A class that handles calls to the game API.
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
     * @returns {Promise} A promise that resolves when the request is complete.
     */
    static async get(req, res) {
        if (isNaN(Number.parseInt(req.params.id, 10))) {
            res.status(404).json({error: "Game not found."});
            return;
        }

        const game = await Completed.getById(Number.parseInt(req.params.id, 10), false);

        if (!game) {
            res.status(404).json({error: "Game not found."});
            return;
        }

        delete game.events;

        res.status(200).json(game);
    }
}

Game.route = {
    path: "/api/game/:id"
};

module.exports = Game;
