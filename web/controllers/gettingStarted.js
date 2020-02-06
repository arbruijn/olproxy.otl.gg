const Common = require("../includes/common"),
    GettingStartedView = require("../../public/views/gettingStarted");

/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//   ###           #      #       #                   ###    #                    #                #
//  #   #          #      #                          #   #   #                    #                #
//  #       ###   ####   ####    ##    # ##    ## #  #      ####    ###   # ##   ####    ###    ## #
//  #      #   #   #      #       #    ##  #  #  #    ###    #         #  ##  #   #     #   #  #  ##
//  #  ##  #####   #      #       #    #   #   ##        #   #      ####  #       #     #####  #   #
//  #   #  #       #  #   #  #    #    #   #  #      #   #   #  #  #   #  #       #  #  #      #  ##
//   ###    ###     ##     ##    ###   #   #   ###    ###     ##    ####  #        ##    ###    ## #
//                                            #   #
//                                             ###
/**
 * A class that represents the getting started page.
 */
class GettingStarted {
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
        res.status(200).send(Common.page("", {}, GettingStartedView.get(), req));
    }
}

GettingStarted.route = {
    path: "/getting-started"
};

module.exports = GettingStarted;
