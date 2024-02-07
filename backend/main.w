bring ex;
bring math;
bring websockets;

class Game {
  userdb: ex.DynamodbTable;
  ws: websockets.WebSocket;
  app: ex.ReactApp;

  new() {
    if !std.Node.of(this).app.isTestEnvironment {
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
  
      this.app.addEnvironment("wsUrl", this.ws.url);
    }
  }

  pub inflight onConnect(id: str) {
    this.userdb.putItem(
      item: {
        userid: id,
        position: [math.random()*3, 0, math.random()*3],
        color: "#{math.toRadix(math.floor(math.random() * 16777215), 16)}",
      }
    );
    log("{id} connected");
  }
  pub inflight onDisconnect(id: str) {
    this.userdb.deleteItem(key: { userid: id });
    log("{id} disconnected");
    this.broadcast();
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
        this.broadcast();
      }

      if event.get("type") == "broadcast" {
        this.broadcast();
      }
    }
  }

  inflight broadcast() {
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