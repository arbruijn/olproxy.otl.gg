const Common = require("../includes/common"),
    Completed = require("../../src/models/completed"),
    ArchiveView = require("../../public/views/archive.js"),
    NotFoundView = require("../../public/views/404"),
    Weapon = require("../../src/models/weapon");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//    #                  #        #
//   # #                 #
//  #   #  # ##    ###   # ##    ##    #   #   ###
//  #   #  ##  #  #   #  ##  #    #    #   #  #   #
//  #####  #      #      #   #    #     # #   #####
//  #   #  #      #   #  #   #    #     # #   #
//  #   #  #       ###   #   #   ###     #     ###
/**
 * A class that represents an archived game's page.
 */
class Archive {
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

        const game = await Completed.getById(Number.parseInt(req.params.id, 10));

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

        let weapons = [];
        if (game.damage) {
            weapons = game.damage.map((d) => d.weapon).filter((w, index, arr) => arr.indexOf(w) === index).sort((a, b) => Weapon.orderedWeapons.indexOf(a) - Weapon.orderedWeapons.indexOf(b));
        }

        res.status(200).send(Common.page(
            "",
            {
                js: [
                    "/js/common/timeago.min.js",
                    "/views/common/score.js",
                    "/views/common/completedDetails.js",
                    "/views/common/players.js",
                    "/views/common/events.js",
                    "/js/archive.js"
                ],
                css: ["/css/game.css"]
            },
            ArchiveView.get(game, weapons),
            req
        ));
    }
}

Archive.route = {
    path: "/archive/:id"
};

module.exports = Archive;
