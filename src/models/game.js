/**
 * @typedef {import("./player")} Player
 * @typedef {{ip: string, settings?: object, server?: string, start?: Date, end?: Date, players?: Player[], kills?: object[], goals?: object[], flagStats?: object[], events?: object[], damage?: object[], teamScore?: Object<string, number>, startTime?: Date, projectedEnd?: Date, countdown?: number, elapsed?: number, inLobby?: boolean}} GameData
 */

const Player = require("./player"),
    ServersDb = require("../database/servers");

/**
 * @type {Game[]}
 */
const games = [];

//   ###
//  #   #
//  #       ###   ## #    ###
//  #          #  # # #  #   #
//  #  ##   ####  # # #  #####
//  #   #  #   #  # # #  #
//   ###    ####  #   #   ###
/**
 * A class that represents a game.
 */
class Game {
    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * Creates a new game from the data provided.
     * @param {GameData} data The data to create the game with.
     */
    constructor(data) {
        this.ip = data.ip;
        this.settings = data.settings;
        this.server = data.server;
        this.start = data.start;
        this.end = data.end;
        this.players = data.players || [];
        this.kills = data.kills || [];
        this.goals = data.goals || [];
        this.flagStats = data.flagStats || [];
        this.events = data.events || [];
        this.damage = data.damage || [];
        this.teamScore = data.teamScore || {};
        this.startTime = data.startTime;
        this.projectedEnd = data.projectedEnd;
        this.countdown = data.countdown;
        this.elapsed = data.elapsed;
        this.inLobby = data.inLobby;
    }

    //              #     ##   ##    ##
    //              #    #  #   #     #
    //  ###   ##   ###   #  #   #     #
    // #  #  # ##   #    ####   #     #
    //  ##   ##     #    #  #   #     #
    // #      ##     ##  #  #  ###   ###
    //  ###
    /**
     * Gets the list of current games.
     * @returns {Game[]} The list of games.
     */
    static getAll() {
        return games;
    }

    //              #    ###         ###
    //              #    #  #         #
    //  ###   ##   ###   ###   #  #   #    ###
    // #  #  # ##   #    #  #  #  #   #    #  #
    //  ##   ##     #    #  #   # #   #    #  #
    // #      ##     ##  ###     #   ###   ###
    //  ###                     #          #
    /**
     * Gets the game data for the specified IP.
     * @param {string} ip The IP to get the game data for.
     * @returns {Game} The game data.
     */
    static getByIp(ip) {
        return games.find((g) => g.ip === ip);
    }

    //              #     ##
    //              #    #  #
    //  ###   ##   ###   #      ###  # #    ##
    // #  #  # ##   #    # ##  #  #  ####  # ##
    //  ##   ##     #    #  #  # ##  #  #  ##
    // #      ##     ##   ###   # #  #  #   ##
    //  ###
    /**
     * Gets the game data for the specified IP, or creates it if it doesn't exit.
     * @param {string} ip The IP to get the game data for.
     * @returns {Promise<Game>} The game data.
     */
    static async getGame(ip) {
        let game = games.find((g) => g.ip === ip);

        if (!game) {
            games.push(game = new Game({ip}));

            game.server = await ServersDb.getByIp(ip);
        }

        return game;
    }

    //              #     ##                  #   #     #     #
    //              #    #  #                 #         #
    //  ###   ##   ###   #      ##   ###    ###  ##    ###   ##     ##   ###
    // #  #  # ##   #    #     #  #  #  #  #  #   #     #     #    #  #  #  #
    //  ##   ##     #    #  #  #  #  #  #  #  #   #     #     #    #  #  #  #
    // #      ##     ##   ##    ##   #  #   ###  ###     ##  ###    ##   #  #
    //  ###
    /**
     * Gets the condition that will end the game.
     * @param {object} game The game to get the condition for.
     * @returns {string} The condition that will end the game.
     */
    static getCondition(game) {
        let condition = "";

        if (game.settings) {
            if (game.settings.scoreLimit) {
                condition = `${condition}First to ${game.settings.scoreLimit}`;

                if (game.settings.timeLimit) {
                    condition = `${condition}, `;
                }
            }

            if (game.settings.timeLimit) {
                condition = `${condition}${Math.round(game.settings.timeLimit / 60)}:00 time limit`;
            }
        }

        return condition;
    }

    //              #    ###   ##
    //              #    #  #   #
    //  ###   ##   ###   #  #   #     ###  #  #   ##   ###
    // #  #  # ##   #    ###    #    #  #  #  #  # ##  #  #
    //  ##   ##     #    #      #    # ##   # #  ##    #
    // #      ##     ##  #     ###    # #    #    ##   #
    //  ###                                 #
    /**
     * Retrieves a player from a game.
     * @param {string} name The name of the player.
     * @param {string} [team] The team the player is on.
     * @returns {Player} The player.
     */
    getPlayer(name, team) {
        if (!name) {
            return void 0;
        }

        if (!this.players.find((p) => p.name === name)) {
            this.players.push(new Player({
                name,
                team,
                kills: 0,
                assists: 0,
                deaths: 0,
                goals: 0,
                goalAssists: 0,
                blunders: 0,
                returns: 0,
                pickups: 0,
                captures: 0,
                carrierKills: 0
            }));
        }

        return this.players.find((p) => p.name === name);
    }

    // ###    ##   # #    ##   # #    ##
    // #  #  # ##  ####  #  #  # #   # ##
    // #     ##    #  #  #  #  # #   ##
    // #      ##   #  #   ##    #     ##
    /**
     * Removes a game from the list of games.
     * @returns {void}
     */
    remove() {
        games.splice(games.indexOf(this), 1);
    }
}

module.exports = Game;
