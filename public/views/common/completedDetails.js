/* global Countdown */

//   ###                         ##            #                #  ####           #              #     ##           #   #    #
//  #   #                         #            #                #   #  #          #                     #           #   #
//  #       ###   ## #   # ##     #     ###   ####    ###    ## #   #  #   ###   ####    ###    ##      #     ###   #   #   ##     ###   #   #
//  #      #   #  # # #  ##  #    #    #   #   #     #   #  #  ##   #  #  #   #   #         #    #      #    #       # #     #    #   #  #   #
//  #      #   #  # # #  ##  #    #    #####   #     #####  #   #   #  #  #####   #      ####    #      #     ###    # #     #    #####  # # #
//  #   #  #   #  # # #  # ##     #    #       #  #  #      #  ##   #  #  #       #  #  #   #    #      #        #   # #     #    #      # # #
//   ###    ###   #   #  #       ###    ###     ##    ###    ## #  ####    ###     ##    ####   ###    ###   ####     #     ###    ###    # #
//                       #
//                       #
/**
 * A class that represetns the game details view.
 */
class CompletedDetailsView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered completed details template.
     * @param {object} game The game to display.
     * @param {boolean} [addLink] Add a link to the game page.
     * @param {number} [id] The number of the game ID.
     * @returns {string} An HTML string of the rendered completed details template.
     */
    static get(game, addLink, id) {
        // @ts-ignore
        if (typeof window !== "undefined") {
            // @ts-ignore
            setTimeout(Countdown.create, 1);
        }

        return /* html */`
            <div class="table">
                <div class="server">${addLink ? /* html */`
                    <a href="/archive/${id}">
                        ` : ""}${CompletedDetailsView.Common.htmlEncode(game.server && game.server.name || game.server && game.server.ip || game.ip || "Unknown")}${addLink ? /* html */`
                    </a>
                ` : ""}</div>
                <div class="scores">
                    ${CompletedDetailsView.ScoreView.get(game)}
                </div>
                <div class="info">
                    <div class="time">
                        Completed <time class="timeago" datetime="${new Date(game.end).toISOString()}">${new Date(game.end)}</time>
                    </div>
                    ${game.settings ? /* html */`
                        <div class="map">${CompletedDetailsView.Common.htmlEncode(game.settings.matchMode)}${game.settings.level && ` - ${CompletedDetailsView.Common.htmlEncode(game.settings.level)}` || ""}</div>
                    ` : ""}
                    ${game.settings && game.settings.condition ? /* html */`
                        <div class="condition">${game.settings.condition}</div>
                    ` : ""}
                </div>
            </div>
        `;
    }
}

// @ts-ignore
CompletedDetailsView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef
// @ts-ignore
CompletedDetailsView.ScoreView = typeof ScoreView === "undefined" ? require("../common/score") : ScoreView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = CompletedDetailsView; // eslint-disable-line no-undef
}
