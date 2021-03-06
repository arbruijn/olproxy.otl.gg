//   ###                        #   #    #
//  #   #                       #   #
//  #       ###   ## #    ###   #   #   ##     ###   #   #
//  #          #  # # #  #   #   # #     #    #   #  #   #
//  #  ##   ####  # # #  #####   # #     #    #####  # # #
//  #   #  #   #  # # #  #       # #     #    #      # # #
//   ###    ####  #   #   ###     #     ###    ###    # #
/**
 * A class that represents the game view.
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
     * Gets the rendered game page template.
     * @param {object} game The game to display.
     * @returns {string} An HTML string of the rendered game template.
     */
    static get(game) {
        return /* html */`
            <div id="top">
                <div id="game">
                    ${GameView.DetailsView.get(game, false)}
                </div>
                <div id="players">
                    ${GameView.PlayersView.get(game)}
                </div>
            </div>
            <div id="events">
                ${GameView.EventsView.get(game)}
            </div>
            <script>
                GameJs.game = new Game(${JSON.stringify(game)});
            </script>
        `;
    }
}

// @ts-ignore
GameView.DetailsView = typeof DetailsView === "undefined" ? require("./common/details") : DetailsView; // eslint-disable-line no-undef
// @ts-ignore
GameView.PlayersView = typeof PlayersView === "undefined" ? require("./common/players") : PlayersView; // eslint-disable-line no-undef
// @ts-ignore
GameView.EventsView = typeof EventsView === "undefined" ? require("./common/events") : EventsView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = GameView; // eslint-disable-line no-undef
}
