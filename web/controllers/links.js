const Common = require("../includes/common"),
    LinksView = require("../../public/views/links");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//  #        #           #
//  #                    #
//  #       ##    # ##   #   #   ###
//  #        #    ##  #  #  #   #
//  #        #    #   #  ###     ###
//  #        #    #   #  #  #       #
//  #####   ###   #   #  #   #  ####
/**
 * A class that represents the links page.
 */
class Links {
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
     * @returns {void} A promise that resolves when the request is complete.
     */
    static get(req, res) {
        res.status(200).send(Common.page("", {}, LinksView.get(), req));
    }
}

Links.route = {
    path: "/links"
};

module.exports = Links;
