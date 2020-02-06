//    #                  #        #                  #   #    #
//   # #                 #                           #   #
//  #   #  # ##    ###   # ##    ##    #   #   ###   #   #   ##     ###   #   #
//  #   #  ##  #  #   #  ##  #    #    #   #  #   #   # #     #    #   #  #   #
//  #####  #      #      #   #    #     # #   #####   # #     #    #####  # # #
//  #   #  #      #   #  #   #    #     # #   #       # #     #    #      # # #
//  #   #  #       ###   #   #   ###     #     ###     #     ###    ###    # #
/**
 * A class that represents the archive view.
 */
class ArchiveView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered archive template.
     * @param {object} game The game to display.
     * @param {string[]} weapons The list of weapons used in the game.
     * @returns {string} An HTML string of the rendered archive template.
     */
    static get(game, weapons) {
        return /* html */`
            <div id="top">
                <div id="game">
                    ${ArchiveView.CompletedDetailsView.get(game)}
                </div>
                <div id="players">
                    ${ArchiveView.PlayersView.get(game)}
                </div>
            </div>
            <div id="damage">
                ${game.players && /* html */`
                    <div id="weapons">
                        Weapon: ${weapons.map((weapon) => /* html */`
                            <a class="weapon" href="#" title="${weapon}"><img src="/images/${weapon.replace(/ /g, "").toLocaleLowerCase()}.png" width="28" height="41" alt="${weapon}" /></a>
                        `).join("")}
                    </div>
                    <div id="grid">
                        <div class="table" style="grid-template-columns: repeat(${3 + game.players.length}, max-content)">
                            <div id="weapon-container">
                                <div id="weapon">Select a weapon</div>
                            </div>
                            ${game.players.sort((a, b) => a.name.localeCompare(b.name)).map((player) => /* html */`
                                <div class="vertical header">${ArchiveView.Common.htmlEncode(player.name)}</div>
                            `).join("")}
                            <div class="vertical header">Total</div>
                            <div class="vertical header">All Weapons</div>
                            ${game.players.map((player, index) => /* html */`
                                <div class="header">${ArchiveView.Common.htmlEncode(player.name)}</div>
                                ${game.players.map((opponent, opponentIndex) => /* html */`
                                    <div id="damage-${index}-${opponentIndex}" class="right ${index === opponentIndex || player.team && player.team === opponent.team ? "friendly" : ""}"></div>
                                `).join("")}
                                <div id="damage-${index}-total" class="right"></div>
                                <div class="right">${game.damage.filter((d) => d.attacker === player.name && d.attacker !== d.defender && (!game.players.find((p) => p.name === d.attacker).team || game.players.find((p) => p.name === d.defender) && game.players.find((p) => p.name === d.attacker).team !== game.players.find((p) => p.name === d.defender).team)).map((d) => d.damage).reduce((a, b) => a + b, 0).toFixed(0)}</div>
                            `).join("")}
                        </div>
                    </div>
                ` || ""}
            </div>
            <div id="events">
                ${ArchiveView.EventsView.get(game)}
            </div>
            <script>
                ArchiveJs.players = ${JSON.stringify(game.players && game.players.map((p) => p.name) || [])}
                ArchiveJs.damage = ${JSON.stringify(game.damage || [])};
            </script>
        `;
    }
}

// @ts-ignore
ArchiveView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef
// @ts-ignore
ArchiveView.CompletedDetailsView = typeof CompletedDetailsView === "undefined" ? require("./common/completedDetails") : CompletedDetailsView; // eslint-disable-line no-undef
// @ts-ignore
ArchiveView.PlayersView = typeof PlayersView === "undefined" ? require("./common/players") : PlayersView; // eslint-disable-line no-undef
// @ts-ignore
ArchiveView.EventsView = typeof EventsView === "undefined" ? require("./common/events") : EventsView; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = ArchiveView; // eslint-disable-line no-undef
}
