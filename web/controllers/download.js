/**
 * @typedef {import("express").Request} express.Request
 * @typedef {import("express").Response} express.Response
 */

//  ####                         ##                      #
//   #  #                         #                      #
//   #  #   ###   #   #  # ##     #     ###    ###    ## #
//   #  #  #   #  #   #  ##  #    #    #   #      #  #  ##
//   #  #  #   #  # # #  #   #    #    #   #   ####  #   #
//   #  #  #   #  # # #  #   #    #    #   #  #   #  #  ##
//  ####    ###    # #   #   #   ###    ###    ####   ## #
/**
 * A class that forwards to the getting started page.
 */
class Download {
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
        res.redirect(301, "/getting-started");
    }
}

Download.route = {
    path: "/download"
};

module.exports = Download;
