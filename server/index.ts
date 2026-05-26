import "dotenv/config";
import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import path from "path";
import { monitor } from "@colyseus/monitor";
import { TryoutRoom } from "./rooms/TryoutRoom";
import { BattleRoom } from "./rooms/BattleRoom";
import { AIBattleRoom } from "./rooms/AIBattleRoom";
import { TournamentBattleRoom } from "./rooms/TournamentBattleRoom";
import { Parts25DTryoutRoom } from "./rooms/Parts25DTryoutRoom";
import { Parts25DBattleRoom } from "./rooms/Parts25DBattleRoom";
import { Parts25DAIBattleRoom } from "./rooms/Parts25DAIBattleRoom";
import { Parts25DTournamentBattleRoom } from "./rooms/Parts25DTournamentBattleRoom";
import { TeamBattleRoom } from "./rooms/TeamBattleRoom";
import { Parts25DTeamBattleRoom } from "./rooms/Parts25DTeamBattleRoom";
import { RoyaleBattleRoom } from "./rooms/RoyaleBattleRoom";
import { StoryBattleRoom } from "./rooms/StoryBattleRoom";
import { ROOM_NAMES } from "./shared/utils/gameMode";
import { TournamentScheduler } from "./tournament/TournamentScheduler";

const port = Number(process.env.PORT || 2567);
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files from the game-server directory
app.use(express.static(path.join(__dirname, "..")));

// Create HTTP server
const server = createServer(app);

// Create Colyseus server
const gameServer = new Server({
  server: server,
});

// Register room handlers — strict 2D / 2.5D split, 8 room types total.
//   - Classic 2D pipeline: uses beyblade_stats / arenas Firestore collections
//   - 2.5D parts pipeline: uses beyblade_systems / arena_systems (Phase 5 wires the loaders)
gameServer.define(ROOM_NAMES["2d"].tryout, TryoutRoom);
gameServer.define(ROOM_NAMES["2d"].battle, BattleRoom);
gameServer.define(ROOM_NAMES["2d"].aiBattle, AIBattleRoom);
gameServer.define(ROOM_NAMES["2d"].tournament, TournamentBattleRoom);

gameServer.define(ROOM_NAMES["2.5d"].tryout, Parts25DTryoutRoom);
gameServer.define(ROOM_NAMES["2.5d"].battle, Parts25DBattleRoom);
gameServer.define(ROOM_NAMES["2.5d"].aiBattle, Parts25DAIBattleRoom);
gameServer.define(ROOM_NAMES["2.5d"].tournament, Parts25DTournamentBattleRoom);

// Team Battle rooms (Phase K / K2)
gameServer.define("team_battle_room", TeamBattleRoom);
gameServer.define("parts25d_team_battle_room", Parts25DTeamBattleRoom);

// Royale Battle room (Phase 25)
gameServer.define("royale_battle_room", RoyaleBattleRoom);

// RPG Story Battle room — extends AIBattleRoom with RPG narrative context
gameServer.define("story_battle_room", StoryBattleRoom);

// Legacy room names — kept as aliases for one release cycle so existing
// clients continue to connect. They route to the classic 2D pipeline.
gameServer.define("tryout_room", TryoutRoom);
gameServer.define("battle_room", BattleRoom);
gameServer.define("ai_battle_room", AIBattleRoom);
gameServer.define("tournament_battle_room", TournamentBattleRoom);

// (Optional) Attach monitoring panel
app.use("/colyseus", monitor());

// Serve test client at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "test-client.html"));
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Start server
gameServer.listen(port);
console.log(`🎮 Beyblade Game Server listening on port ${port}`);
console.log(`📊 Monitor panel: http://localhost:${port}/colyseus`);
console.log(`🏥 Health check: http://localhost:${port}/health`);

// Start tournament scheduler (polls Firestore every 30s for upcoming bracket matches)
const scheduler = new TournamentScheduler();
scheduler.start();
