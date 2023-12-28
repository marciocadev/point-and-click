bring ex;
bring websockets;

class Util {
  extern "./util.js" pub static inflight _generateRandomHexcolor(): str;
  extern "./util.js" pub static inflight _generateRandomPosition(): Array<num>;
}

class Game {
  userdb: ex.DynamodbTable;
  ws: websockets.WebSocket;
  app: ex.ReactApp;

  new() {
    this.userdb = new ex.DynamodbTable(
      name: "users",
      hashKey: "userid",
      attributeDefinitions: { userid: "S"}
    ) as "userdb";

    this.ws = new websockets.WebSocket(
      name: "Game",
    ) as "socket";
    
    this.app = new ex.ReactApp(
      projectPath: "../frontend",
    ) as "app";

    this.ws.onConnect(inflight (id: str) => { this.onConnect(id); });
    this.ws.onDisconnect(inflight (id: str) => { this.onDisconnect(id); });
    this.ws.onMessage(inflight (id: str, msg: str) => { this.onMessage(id, msg); });
    this.ws.initialize();

    this.app.addEnvironment("wsUrl", this.ws.url());
  }

  pub inflight onConnect(id: str) {
    this.userdb.putItem(
      item: {
        userid: id,
        position: Util._generateRandomPosition(),
        color: Util._generateRandomHexcolor()
      }
    );
    log("{id} connected");
    this.broadcast(id);
  }
  pub inflight onDisconnect(id: str) {
    this.userdb.deleteItem(key: { userid: id });
    log("{id} disconnected");
    this.broadcast(id);
  }
  pub inflight onMessage(id: str, message: str) {
    if let event = Json.tryParse(message) {
      if event.get("type") == "move" {
        let data = event.get("data");
        this.userdb.updateItem(
          key: { userid: id },
          updateExpression: "SET #position = :position",
          expressionAttributeValues: { ":position": data },
          expressionAttributeNames: { "#position": "position" }
        );
        this.broadcast(id);
      }
    }
  }

  inflight broadcast(id: str) {
    let users = this.userdb.scan();
    for item in users.items {
      let userid = item.get("userid").asStr();
      this.ws.sendMessage(userid, Json.stringify({
        type: "characters",
        data: users.items
      }));
    }
  }
}

new Game();