/* global Common, GamesView */

//   ###                        #        #            #
//  #   #                       #                     #
//  #       ###   ## #    ###   #       ##     ###   ####
//  #          #  # # #  #   #  #        #    #       #
//  #  ##   ####  # # #  #####  #        #     ###    #
//  #   #  #   #  # # #  #      #        #        #   #  #
//   ###    ####  #   #   ###   #####   ###   ####     ##
/**
 * A class that provides functions for the game list page.
 */
class GameList {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Sets up pagination buttons.
     * @returns {void}
     */
    static DOMContentLoaded() {
        document.getElementById("prev").addEventListener("click", GameList.prev);
        document.getElementById("next").addEventListener("click", GameList.next);
        GameList.parseTime();
    }

    //                                ###    #
    //                                 #
    // ###    ###  ###    ###    ##    #    ##    # #    ##
    // #  #  #  #  #  #  ##     # ##   #     #    ####  # ##
    // #  #  # ##  #       ##   ##     #     #    #  #  ##
    // ###    # #  #     ###     ##    #    ###   #  #   ##
    // #
    /**
     * Parses time elements to display the local time.
     * @returns {void}
     */
    static parseTime() {
        for (const time of document.getElementsByClassName("local")) {
            time.innerText = Common.formatDate(new Date(time.dateTime));
        }
    }

    //               #
    //               #
    //  ###    ##   ###   #  #  ###
    // ##     # ##   #    #  #  #  #
    //   ##   ##     #    #  #  #  #
    // ###     ##     ##   ###  ###
    //                          #
    /**
     * Sets up pagination for the game list.
     * @param {number} lastId The last ID on the current page.
     * @returns {void}
     */
    static setup(lastId) {
        document.getElementById("prev").classList.remove("hidden");
        document.getElementById("next").classList.remove("hidden");
        if (GameList.page === 1) {
            document.getElementById("prev").classList.add("hidden");
        }
        if (lastId === GameList.minId) {
            document.getElementById("next").classList.add("hidden");
        }
        GameList.parseTime();
    }

    // ###   ###    ##   # #
    // #  #  #  #  # ##  # #
    // #  #  #     ##    # #
    // ###   #      ##    #
    // #
    /**
     * Navigates to the previous page.
     * @param {object} ev The event.
     * @returns {void}
     */
    static prev(ev) {
        GameList.page--;
        GameList.getPage();
        ev.preventDefault();
        ev.stopPropagation();
        return false;
    }

    //                    #
    //                    #
    // ###    ##   #  #  ###
    // #  #  # ##   ##    #
    // #  #  ##     ##    #
    // #  #   ##   #  #    ##
    /**
     * Navigates to the next page.
     * @param {object} ev The event.
     * @returns {void}
     */
    static next(ev) {
        GameList.page++;
        GameList.getPage();
        ev.preventDefault();
        ev.stopPropagation();
        return false;
    }

    //              #    ###
    //              #    #  #
    //  ###   ##   ###   #  #   ###   ###   ##
    // #  #  # ##   #    ###   #  #  #  #  # ##
    //  ##   ##     #    #     # ##   ##   ##
    // #      ##     ##  #      # #  #      ##
    //  ###                           ###
    /**
     * Retrieves and displays the current page.
     * @returns {Promise} A promise that resolves when the page has been retrieved.
     */
    static async getPage() {
        document.getElementById("prev").classList.add("hidden");
        document.getElementById("next").classList.add("hidden");
        await Common.loadDataIntoTemplate(`/api/gamelist?page=${GameList.page}`, "#games", GamesView.get);
        GameList.setup();
    }
}

document.addEventListener("DOMContentLoaded", GameList.DOMContentLoaded);
