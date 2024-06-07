function pushserver() {
  this.db = new(function () {
    this.host = "127.0.0.1";
    this.port = 3306;
    this.user = "";
    this.password = "";
    this.dbname = "";
    this.charset = "utf8mb4";
  })();
  this.port = new(function () {
    this.port = 80;
  })();
}

module.exports = new pushserver();