//   ###           #      #       #                   ###    #                    #                #  #   #    #
//  #   #          #      #                          #   #   #                    #                #  #   #
//  #       ###   ####   ####    ##    # ##    ## #  #      ####    ###   # ##   ####    ###    ## #  #   #   ##     ###   #   #
//  #      #   #   #      #       #    ##  #  #  #    ###    #         #  ##  #   #     #   #  #  ##   # #     #    #   #  #   #
//  #  ##  #####   #      #       #    #   #   ##        #   #      ####  #       #     #####  #   #   # #     #    #####  # # #
//  #   #  #       #  #   #  #    #    #   #  #      #   #   #  #  #   #  #       #  #  #      #  ##   # #     #    #      # # #
//   ###    ###     ##     ##    ###   #   #   ###    ###     ##    ####  #        ##    ###    ## #    #     ###    ###    # #
//                                            #   #
//                                             ###
/**
 * A class that represents the getting started view.
 */
class GettingStartedView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered getting started page template.
     * @returns {string} An HTML string of the getting started page.
     */
    static get() {
        return /* html */`
            <h2>Download olmod</h2>
            <div class="section">
                <div>
                    Download olmod directly from Github.  Visit <a href="https://github.com/arbruijn/olmod/releases" target="_blank">https://github.com/arbruijn/olmod/releases</a> and download the first .zip file listed under the latest release.<br /><br />
                    Once downloaded, there are two ways to run olmod.
                </div>
            </div>
            <div class="section">
                <div class="header">olmod on Windows with Steam or GoG</div>
                <div>
                    If you have Overload on Steam or GoG, you should just be able to launch olmod.exe from anywhere.  If it does not work for you immediately, uninstalling and reinstalling Overload should fix it.
                </div>
            </div>
            <div class="section">
                <div class="header">olmod alongside Overload</div>
                <div>
                    Unzip the olmod package into the same directory as Overload.  This directory is the same directory that contains the Overload executable as well as the subdirectory Overload_Data.  You can then run olmod from within the same directory as Overload.<br /><br />
                </div>
            </div>
            <h2>Getting Started Playing Online</h2>
            <div class="section">
                <div class="header">Joining existing games</div>
                <div>
                    To begin playing Overload online from within olmod:<br /><br />
                    1) Click "Play Multiplayer".<br />
                    2) Click "Internet Match".<br />
                    3) Click "Join Match".<br />
                    4) Enter the IP address of the server, found on the <a href="/">Home</a> page.<br />
                    5) Click "Join Match" again.
                </div>
            </div>
            <div class="section">
                <div class="header">Creating a new game</div>
                <div>
                    To start a new multiplayer game from within olmod:<br /><br />
                    1) Select a server to play on from the Server Browser on the <a href="/">Home</a> page.  Be sure a game is not currently running on it!<br />
                    2) Click "Play Multiplayer".<br />
                    3) Click "Internet Match".<br />
                    4) Click "Create Open Match" for a match where players can join the match at any time, or click "Create Match" for a closed match where no one else can join once the game starts.<br />
                    5) Adjust the game settings to your liking.<br />
                    6) Click "Create Match" again.<br />
                    7) Enter the IP address of the server.<br />
                    8) Click "Create Match" again.
                </div>
            </div>
        `;
    }
}

if (typeof module !== "undefined") {
    module.exports = GettingStartedView; // eslint-disable-line no-undef
}
