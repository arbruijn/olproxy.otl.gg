/**
 * @typedef {express.Router} Express.Router
 */

const compression = require("compression"),
    express = require("express"),
    expressWs = require("express-ws"),
    minify = require("./src/minify"),
    morgan = require("morgan"),
    morganExtensions = require("./src/extensions/morgan.extensions"),

    Log = require("./src/logging/log"),
    Router = require("./src/router"),
    settings = require("./settings");

//         #                 #
//         #                 #
//  ###   ###    ###  ###   ###   #  #  ###
// ##      #    #  #  #  #   #    #  #  #  #
//   ##    #    # ##  #      #    #  #  #  #
// ###      ##   # #  #       ##   ###  ###
//                                      #
/**
 * Starts up the application.
 */
(async function startup() {
    console.log("Starting up...");

    // Set title.
    if (process.platform === "win32") {
        process.title = "Overload Game Browser";
    } else {
        process.stdout.write("\x1b]2;Overload Game Browser\x1b\x5c");
    }

    // Setup express app.
    const app = express();

    // Startup websockets.
    expressWs(app);

    // Get the router.
    /** @type {Express.Router} */
    let router;
    try {
        router = await Router.getRouter();
    } catch (err) {
        console.log(err);
        return;
    }

    // Add morgan extensions.
    morganExtensions(morgan);

    // Initialize middleware stack.
    app.use(express.json({
        limit: "10mb"
    }));
    app.use(morgan(":colorstatus \x1b[30m\x1b[0m:method\x1b[0m :url\x1b[30m\x1b[0m:newline    Date :date[iso]    IP :ipaddr    Time :colorresponse ms"));
    app.use(compression());

    // Setup public redirects.
    app.use(express.static("public"));

    // Setup library handlers.
    app.get("/js/common/timeago.min.js", (req, res) => {
        res.sendFile(`${__dirname}/node_modules/timeago.js/dist/timeago.min.js`);
    });

    app.get("/js/common/clipboard.min.js", (req, res) => {
        res.sendFile(`${__dirname}/node_modules/clipboard/dist/clipboard.min.js`);
    });

    // Setup JS/CSS handlers.
    app.get("/css", minify.cssHandler);
    app.get("/js", minify.jsHandler);

    // 500 is an internal route, 404 it if it's requested directly.
    app.use("/500", (req, res, next) => {
        req.method = "GET";
        req.url = "/404";
        router(req, res, next);
    });

    // Setup dynamic routing.
    app.use("/", router);

    // 404 remaining pages.
    app.use((req, res, next) => {
        req.method = "GET";
        req.url = "/404";
        router(req, res, next);
    });

    // 500 errors.
    app.use((err, req, res, next) => {
        Log.exception("Unhandled error has occurred.", err);
        req.method = "GET";
        req.url = "/500";
        router(req, res, next);
    });

    // Startup webserver.
    const port = process.env.PORT || settings.express.port;

    app.listen(port, () => {
        console.log(`Web server and websockets listening on port ${port}.`);
    });
}());

process.on("unhandledRejection", (reason) => {
    Log.exception("Unhandled promise rejection caught.", reason);
});
