/**
 * @typedef {import("express").Request} Express.Request
 */

//   ###              #                #   #    #
//    #               #                #   #
//    #    # ##    ## #   ###   #   #  #   #   ##     ###   #   #
//    #    ##  #  #  ##  #   #   # #    # #     #    #   #  #   #
//    #    #   #  #   #  #####    #     # #     #    #####  # # #
//    #    #   #  #  ##  #       # #    # #     #    #      # # #
//   ###   #   #   ## #   ###   #   #    #     ###    ###    # #
/**
 * A class that represents the general website template.
 */
class IndexView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered page template.
     * @param {{head: string, html: string, protocol: string, host: string, originalUrl: string, year: number, version: string}} data The data to render the page with.
     * @returns {string} An HTML string of the page.
     */
    static get(data) {
        const {head, html, protocol, host, originalUrl, year, version} = data;

        return /* html */`
            <html>
                <head>
                    <title>Overload Game Browser</title>
                    <meta name="og:title" content="Overload Game Browser" />
                    <meta name="og:type" content="website" />
                    <meta name="og:url" content="${protocol}://${host}${originalUrl}" />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:creator" content="@roncli" />
                    ${head}
                </head>
                <body>
                    <div id="page">
                        <div id="menu">
                            <ol style="fon">
                                <li><a href="/">Home</a></li>
                                <li><a href="/gamelist">Archived Games</a></li>
                                <li><a href="/getting-started">Getting Started with olmod</a></li>
                                <li><a href="/server">Server Setup</a></li>
                                <li><a href="/links">Links</a></li>
                                <li><a href="/about">About</a></li>
                            </ol>
                        </div>
                        <div id="header">Overload Game Browser</div>
                        <div id="body">
                            ${html}
                        </div>
                        <div id="copyright">
                            <div class="left">
                                Website Version ${version}, &copy;${+year > 2019 ? "2019-" : ""}${year} roncli Productions<br />
                                olmod, &copy;${+year > 2019 ? "2019-" : ""}${year} Arne de Bruijn
                            </div>
                            <div class="right">
                                Bugs with the website?  <a href="https://github.com/overload-development-community/olproxy.otl.gg/issues" target="_blank">Report on GitHub</a><br />
                                Bugs with olmod?  <a href="https://github.com/arbruijn/olmod/issues" target="_blank">Report on GitHub</a><br />
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `;
    }
}

if (typeof module !== "undefined") {
    module.exports = IndexView; // eslint-disable-line no-undef
}
