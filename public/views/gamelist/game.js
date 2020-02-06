//   ###                        #   #    #
//  #   #                       #   #
//  #       ###   ## #    ###   #   #   ##     ###   #   #
//  #          #  # # #  #   #   # #     #    #   #  #   #
//  #  ##   ####  # # #  #####   # #     #    #####  # # #
//  #   #  #   #  # # #  #       # #     #    #      # # #
//   ###    ####  #   #   ###     #     ###    ###    # #
/**
 * A class that represents the archived games view.
 */
class GameView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered archived game template.
     * @param {object} game The games to display.
     * @returns {string} An HTML string of the rendered archived game template.
     */
    static get(game) {
        return /* html */`
            <div><a href="/archive/${game.id}"><time class="local" datetime="${game.date}"></time></a></div>
            <div>${GameView.Common.htmlEncode(game.server && game.server.name || game.server && game.server.ip || game.ip || "Unknown")}</div>
            <div>${game.data && game.data.settings && GameView.Common.htmlEncode(game.data.settings.matchMode) || ""}</div>
            <div>${game.data && game.data.settings && GameView.Common.htmlEncode(game.data.settings.level) || ""}</div>
            <div>
                ${game.data && game.data.teamScore && Object.keys(game.data.teamScore).length > 0 && Object.keys(game.data.teamScore).sort((a, b) => game.data.teamScore[b] - game.data.teamScore[a]).slice(0, 4).map((team) => /* html */`
                    ${GameView.Common.htmlEncode(team)} ${game.data.teamScore[team]}
                `.trim()).join(", ") || game.data && game.data.players && game.data.players.length > 0 && game.data.players.sort((a, b) => b.kills * (game.data.players.length > 2 ? 3 : 1) + b.assists - (a.kills * (game.data.players.length > 2 ? 3 : 1) + a.assists)).slice(0, 4).map((player) => /* html */`
                    ${GameView.Common.htmlEncode(player.name)} ${player.kills * (game.data.players.length > 2 ? 3 : 1) + player.assists}
                `.trim()).join(", ") || ""}${game.data && game.data.teamScore && game.data.teamScore.length > 4 || game.data && (!game.data.teamScore || game.data.teamScore.length === 0) && game.data.players && game.data.players.length > 4 ? ", ..." : ""}
            </div>
        `;
    }
}

// @ts-ignore
GameView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = GameView; // eslint-disable-line no-undef
}
