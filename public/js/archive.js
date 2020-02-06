/* global Common */

//    #                  #        #                    ###
//   # #                 #                               #
//  #   #  # ##    ###   # ##    ##    #   #   ###       #   ###
//  #   #  ##  #  #   #  ##  #    #    #   #  #   #      #  #
//  #####  #      #      #   #    #     # #   #####      #   ###
//  #   #  #      #   #  #   #    #     # #   #      #   #      #
//  #   #  #       ###   #   #   ###     #     ###    ###   ####
/**
 * A class that provides functions for the archive page.
 */
class ArchiveJs {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Makes sure all timeago fields are rendered.
     * @returns {void}
     */
    static DOMContentLoaded() {
        Common.loadTimeAgo();

        document.querySelectorAll("a.weapon").forEach((a) => a.addEventListener("click", (ev) => {
            document.getElementById("weapon").innerText = a.title;

            for (let x = 0; x < ArchiveJs.players.length; x++) {
                let total = 0;
                for (let y = 0; y < ArchiveJs.players.length; y++) {
                    const damage = (ArchiveJs.damage.find((d) => d.attacker === ArchiveJs.players[x] && d.defender === ArchiveJs.players[y] && d.weapon === a.title) || {damage: 0}).damage,
                        el = document.getElementById(`damage-${x}-${y}`);

                    el.innerText = damage === 0 ? "" : damage.toFixed(0);
                    if (!el.classList.contains("friendly")) {
                        total += damage;
                    }
                }
                document.getElementById(`damage-${x}-total`).innerText = total.toFixed(0);
            }

            ev.preventDefault();
            ev.stopPropagation();
            return false;
        }));
    }
}

document.addEventListener("DOMContentLoaded", ArchiveJs.DOMContentLoaded);
