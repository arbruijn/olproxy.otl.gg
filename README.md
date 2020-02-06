# olproxy.otl.gg

The source code for the website at http://tracker.otl.gg.

## Version History

### 2.0.3 - 1/28/2020

* Onboarding update with current information about olmod and how to play.
* Added IP address and copy button to games where joining is possible.
* Fixed bugs with unofficial game modes.
* Add minification and combination of CSS & JS files.

### 2.0.2 - 12/10/2019

* Update server list API to not draw from the database.
* Other fixes to server list API.
* Remove active API.

### 2.0.1 - 11/19/2019

* Active lobbys are now shown with number of players and max players.
* Archive now displays the initial page in local time like the rest of the pages.
* Players who took damage but did not record another start are removed from the damage grid.
* Fixed timeago implementation.
* Added more HTML encoding to server and map names.
* Fixed non-existent game IDs crashing instead of 
* Fixed bug with completed games linking to an invalid page.
* Replaced original websocket implementation with express-ws.

### 2.0.0 - 11/14/2019

* Stats are now tracked and displayed in real time using websockets.
* Support for CTF and Monsterball.
* New archived games list.
* New completed game API.
* Backend website improvements.

### 1.1.0 - 6/30/2019

* Save end game stats received from olproxy to the database.
* Update appsettings.json with the "signOff" parameter.

### 1.0.3 - 4/30/2019

* Fix bug with HTML encoding.
* Fix bug when mode hasn't been set yet.
* Update links.
* Add SSL.

### 1.0.2 - 3/17/2019

* Use database for backend server list persistence.
* Add "online" querystring to toggle a server's visibility.
* Move old servers to the bottom of the list.
* Add Server Setup and Links pages.
* Add links to the map being played.
* Filter out servers that are missing key information.

### 1.0.1 - 3/2/2019

* HTML encode all externally provided data.

### 1.0.0 - 3/2/2019

Initial Version
