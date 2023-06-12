import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer, Socket } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";

import { JoinRoomRequest, JoinRoomResponse } from "@/src/types/join_room";
import {
  SendChatMessageRequest,
  SendChatMessageResponse,
} from "@/src/types/send_chat_message";
import { PlayerDisconnectedeResponse } from "@/src/types/player_disconnected";
import {
  InviteRequest,
  InviteResponse,
  Invited,
  UninviteRequest,
  UninviteResponse,
} from "@/src/types/invite";
import { GameStartRequest, GameStartResponse } from "@/src/types/game_start";
import { GameUpdateResponse } from "@/src/types/game_update";
import { Game } from "@/src/types/game";
import { PlayTokenRequest, PlayTokenResponse } from "@/src/types/play_token";
import { GameOver } from "@/src/types/game_over";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

interface Player {
  username: string;
  room: string;
}

const players = new Map<string, Player>();

const SocketHandler = (_: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket: Socket) => {
      function serverLog(...messages: string[]) {
        io.emit("log", ["**** Message from the server:\n"]);
        messages.forEach((message) => {
          io.emit("log", ["****\t" + message]);
          console.log(message);
        });
      }
      serverLog("a page connected to the server: " + socket.id);

      socket.on("join_room", (request: JoinRoomRequest) => {
        if (typeof request.room == undefined || request.room == null) {
          const response: JoinRoomResponse = {
            result: "fail",
            message: "Room not specified",
            socket_id: socket.id,
          };
          socket.emit("join_room_response", response);
        }
        if (typeof request.username == undefined || request.username == null) {
          const response: JoinRoomResponse = {
            result: "fail",
            message: "Username not specified",
            socket_id: socket.id,
          };
          socket.emit("join_room_response", response);
        }

        // success
        socket.join(request.room);

        // Check client is in room
        io.in(request.room)
          .fetchSockets()
          .then((sockets) => {
            // Fail
            if (typeof sockets == undefined || sockets === null) {
            }
            // Success
            else {
              players.set(socket.id, {
                username: request.username!,
                room: request.room,
              });
              // Inform current socket about all existing members.
              sockets.forEach((member) => {
                if (member.id !== socket.id) {
                  const response: JoinRoomResponse = {
                    result: "success",
                    socket_id: member.id,
                    room: players.get(member.id)?.room,
                    username: players.get(member.id)?.username,
                    count: sockets.length,
                  };
                  socket.emit("join_room_response", response);
                }
              });
              // Inform rest of sockets in room, about the current joining socket.
              const response: JoinRoomResponse = {
                result: "success",
                socket_id: socket.id,
                room: players.get(socket.id)?.room,
                username: players.get(socket.id)?.username,
                count: sockets.length,
              };
              io.of("/").to(request.room).emit("join_room_response", response);

              // Game
              if (request.room !== "Lobby") {
                send_game_update(io, socket, request.room, "initial update");
              }
            }
          });
      });

      socket.on("disconnect", () => {
        serverLog("a page disconnected from the server: " + socket.id);
        if (players.has(socket.id)) {
          const room = players.get(socket.id)?.room;
          const username = players.get(socket.id)?.username;
          if (room && username) {
            const payload: PlayerDisconnectedeResponse = {
              username: username,
              room: room,
              count: players.size - 1,
              socket_id: socket.id,
            };
            players.delete(socket.id);
            io.of("/").to(room).emit("player_disconnected", payload);
          }
        }
      });

      socket.on("send_chat_message", (request: SendChatMessageRequest) => {
        if (typeof request.room == undefined || request.room == null) {
          const response: SendChatMessageResponse = {
            result: "fail",
            message: "Room not specified",
          };
          socket.emit("send_chat_message_response", response);
        }
        if (typeof request.username == undefined || request.username == null) {
          const response: SendChatMessageResponse = {
            result: "fail",
            message: "Username not specified",
          };
          socket.emit("send_chat_message_response", response);
        }
        if (typeof request.message == undefined || request.message == null) {
          const response: SendChatMessageResponse = {
            result: "fail",
            message: "message not specified",
          };
          socket.emit("send_chat_message_response", response);
        }

        // success
        const response: SendChatMessageResponse = {
          result: "success",
          room: request.room,
          username: request.username,
          message: request.message!,
        };
        io.of("/")
          .to(request.room!)
          .emit("send_chat_message_response", response);
      });

      socket.on("invite", (request: InviteRequest) => {
        console.log("Invite Request Received: " + request);

        if (request.requested_user === null) {
          const response: InviteResponse = {
            result: "fail",
            message: "No requested user",
          };
          socket.emit("invite_response", response);
          return;
        }

        const room = players.get(socket.id)?.room;
        const username = players.get(socket.id)?.username;

        if (room === null) {
          const response: InviteResponse = {
            result: "fail",
            message: "Requested user is not in a room",
          };
          socket.emit("invite_response", response);
          return;
        }

        // Make sure requested player is present
        if (!io.of("/").adapter.rooms.get(room!)?.has(request.requested_user)) {
          const response: InviteResponse = {
            result: "fail",
            message: "Requested user is not in the room",
          };
          socket.emit("invite_response", response);
          return;
        }

        // Requested player is in the room
        const inviteResponse: InviteResponse = {
          result: "success",
          message: "success",
          socket_id: request.requested_user,
        };
        socket.emit("invite_response", inviteResponse);

        const invited: Invited = {
          result: "success",
          message: "success",
          socket_id: socket.id,
        };
        socket.to(request.requested_user).emit("invited", invited);
        return;
      });

      socket.on("uninvite", (request: UninviteRequest) => {
        console.log("Uninvite Request Received: " + request);

        if (request.requested_user === null) {
          const response: UninviteResponse = {
            result: "fail",
            message: "No requested user",
          };
          socket.emit("invite_response", response);
          return;
        }

        const room = players.get(socket.id)?.room;

        if (room === null) {
          const response: UninviteResponse = {
            result: "fail",
            message: "Requested user is not in a room",
          };
          socket.emit("invite_response", response);
          return;
        }

        // Make sure requested player is present
        if (!io.of("/").adapter.rooms.get(room!)?.has(request.requested_user)) {
          const response: UninviteResponse = {
            result: "fail",
            message: "Requested user is not in the room",
          };
          socket.emit("invite_response", response);
          return;
        }

        // Requested player is in the room
        const uninviteResponse1: UninviteResponse = {
          result: "success",
          message: "success",
          socket_id: request.requested_user,
        };
        socket.emit("uninvite_response", uninviteResponse1);

        const uninviteResponse2: UninviteResponse = {
          result: "success",
          message: "success",
          socket_id: socket.id,
        };
        socket
          .to(request.requested_user)
          .emit("uninvite_response", uninviteResponse2);

        return;
      });

      socket.on("game_start", (request: GameStartRequest) => {
        console.log("GameStart Request Received: " + request);

        if (request.requested_user === null) {
          const response: GameStartResponse = {
            result: "fail",
            message: "No requested user",
          };
          socket.emit("game_start_response", response);
          return;
        }

        const room = players.get(socket.id)?.room;

        if (room === null) {
          const response: GameStartResponse = {
            result: "fail",
            message: "Requested user is not in a room",
          };
          socket.emit("game_start_response", response);
          return;
        }

        // Make sure requested player is present
        if (!io.of("/").adapter.rooms.get(room!)?.has(request.requested_user)) {
          const response: GameStartResponse = {
            result: "fail",
            message: "Requested user is not in the room",
          };
          socket.emit("game_start_response", response);
          return;
        }

        // Requested player is in the room
        const game_id = Math.floor(1 + Math.random() * 0x100000).toString(16);
        const gameStartResponse: GameStartResponse = {
          result: "success",
          message: "success",
          game_id: game_id,
        };
        socket.emit("game_start_response", gameStartResponse);

        socket
          .to(request.requested_user)
          .emit("game_start_response", gameStartResponse);

        return;
      });

      socket.on("play_token", (request: PlayTokenRequest) => {
        if (!request) {
          const response: PlayTokenResponse = {
            result: "fail",
            message: "No request",
          };
          return;
        }

        const player = players.get(socket.id);
        if (!player) {
          const response: PlayTokenResponse = {
            result: "fail",
            message: "Play token came from unregistered player",
          };
          return;
        }

        const username = player.username;
        if (!username) {
          const response: PlayTokenResponse = {
            result: "fail",
            message: "Play token came from an unregistered username",
          };
          return;
        }

        const game_id = player.room;
        if (!game_id) {
          const response: PlayTokenResponse = {
            result: "fail",
            message: "Play token found no room",
          };
          return;
        }

        const game = games.get(game_id);
        if (!game) {
          const response: PlayTokenResponse = {
            result: "fail",
            message: "Play token found no game from game id",
          };
          return;
        }

        // Make sure the attempt is by the correct color
        if (request.color !== game.whose_turn) {
          const response: PlayTokenResponse = {
            result: "fail",
            message: "Not the players turn",
          };
          return;
        }

        const response: PlayTokenResponse = {
          result: "success",
        };
        socket.emit("play_token_response", response);

        // Execute the move
        if (request.color === "white") {
          game.board[request.row][request.column] = "w";
          flip_tokens("w", request.row, request.column, game.board);
          game.whose_turn = "black";
          game.legal_moves = calculate_legal_moves("b", game.board);
        } else if (request.color === "black") {
          game.board[request.row][request.column] = "b";
          flip_tokens("b", request.row, request.column, game.board);
          game.whose_turn = "white";
          game.legal_moves = calculate_legal_moves("w", game.board);
        }

        const d = new Date();
        game.last_move_time = d.getTime();

        send_game_update(io, socket, game_id, "played a token");
      });
    });
  }
  res.end();
};

// *************
// Game State Functions

let games: Map<string, Game> = new Map();

function create_new_game() {
  const board = [
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", "w", "b", " ", " ", " "],
    [" ", " ", " ", "b", "w", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
  ];
  const legal_moves = calculate_legal_moves("b", board);
  const d = new Date();
  const game: Game = {
    player_white: {
      socket: "",
      username: "",
    },
    player_black: {
      socket: "",
      username: "",
    },
    last_move_time: d.getTime(),
    board: board,
    whose_turn: "black",
    legal_moves: legal_moves,
  };
  return game;
}

function check_line_match(
  color: string,
  dr: number,
  dc: number,
  r: number,
  c: number,
  board: string[][]
): boolean {
  if (board[r][c] === color) {
    return true;
  }

  // Check to make sure we aren't going to walk off the board
  if (r + dr < 0 || r + dr > 7) {
    return false;
  }
  if (c + dc < 0 || c + dc > 7) {
    return false;
  }
  return check_line_match(color, dr, dc, r + dr, c + dc, board);
}

function adjacent_support(
  who: string,
  dr: number,
  dc: number,
  r: number,
  c: number,
  board: string[][]
): boolean {
  let other: string;
  if (who === "b") {
    other = "w";
  } else {
    other = "b";
  }

  // Make sure it is on the board
  if (r + dr < 0 || r + dr > 7) {
    return false;
  }
  if (c + dc < 0 || c + dc > 7) {
    return false;
  }

  // Check opposite color is present
  if (board[r + dr][c + dc] !== other) {
    return false;
  }

  // Make sure there is space for matching color to capture tokens
  if (r + dr + dr < 0 || r + dr + dr > 7) {
    return false;
  }
  if (c + dc + dc < 0 || c + dc + dc > 7) {
    return false;
  }

  return check_line_match(who, dr, dc, r + dr + dr, c + dc + dc, board);
}

function calculate_legal_moves(who: string, board: string[][]): string[][] {
  let legal_moves = [
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
  ];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] !== " ") {
        continue;
      }
      let nw = adjacent_support(who, -1, -1, row, col, board);
      let nn = adjacent_support(who, -1, 0, row, col, board);
      let ne = adjacent_support(who, -1, 1, row, col, board);

      let ww = adjacent_support(who, 0, -1, row, col, board);
      let ee = adjacent_support(who, 0, 1, row, col, board);

      let sw = adjacent_support(who, 1, -1, row, col, board);
      let ss = adjacent_support(who, 1, 0, row, col, board);
      let se = adjacent_support(who, 1, 1, row, col, board);

      if (nw || nn || ne || ww || ee || sw || ss || se) {
        legal_moves[row][col] = who;
      }
    }
  }

  return legal_moves;
}

function flip_line(
  who: string,
  dr: number,
  dc: number,
  r: number,
  c: number,
  board: string[][]
) {
  // Make sure it is on the board
  if (r + dr < 0 || r + dr > 7) {
    return false;
  }
  if (c + dc < 0 || c + dc > 7) {
    return false;
  }

  if (board[r + dr][c + dc] === " ") {
    return false;
  }

  if (board[r + dr][c + dc] === who) {
    return true;
  } else {
    if (flip_line(who, dr, dc, r + dr, c + dc, board)) {
      board[r + dr][c + dc] = who;
      return true;
    } else {
      return false;
    }
  }
}

function flip_tokens(who: string, row: number, col: number, board: string[][]) {
  flip_line(who, -1, -1, row, col, board);
  flip_line(who, -1, 0, row, col, board);
  flip_line(who, -1, 1, row, col, board);

  flip_line(who, 0, -1, row, col, board);
  flip_line(who, 0, 1, row, col, board);

  flip_line(who, 1, -1, row, col, board);
  flip_line(who, 1, 0, row, col, board);
  flip_line(who, 1, 1, row, col, board);
}

function send_game_update(
  io: Server,
  socket: Socket,
  game_id: string,
  message: string
) {
  // Check if game with game_id exists, create if doesn't exist.
  if (!games.has(game_id)) {
    console.log(
      `no game exists with game_id ${game_id}. Making a new game for ${socket.id}`
    );
    games.set(game_id, create_new_game());
  }

  // Make sure only 2 people are in the room
  io.of("/")
    .to(game_id)
    .allSockets()
    .then((sockets) => {
      const iterator = sockets[Symbol.iterator]();

      if (sockets.size >= 1) {
        const first = iterator.next().value;
        if (
          games.get(game_id)?.player_white.socket != first &&
          games.get(game_id)?.player_black.socket != first
        ) {
          // Player does not have a color.
          if (games.get(game_id)?.player_white.socket === "") {
            // Player should be white
            console.log(`White is assigned to: ${first}`);
            games.get(game_id)!.player_white.socket = first;
            games.get(game_id)!.player_white.username =
              players.get(first)!.username;
          } else if (games.get(game_id)?.player_black.socket === "") {
            // Player should be black
            console.log(`Black is assigned to: ${first}`);
            games.get(game_id)!.player_black.socket = first;
            games.get(game_id)!.player_black.username =
              players.get(first)!.username;
          } else {
            // This is a 3rd player
            console.log(`Kicking ${first} out of game ${game_id}`);
            io.in(first).socketsLeave([game_id]);
          }
        }
      }

      if (sockets.size >= 2) {
        const second = iterator.next().value;
        if (
          games.get(game_id)?.player_white.socket != second &&
          games.get(game_id)?.player_black.socket != second
        ) {
          // Player does not have a color.
          if (games.get(game_id)?.player_white.socket === "") {
            // Player should be white
            console.log(`White is assigned to (Second): ${second}`);
            games.get(game_id)!.player_white.socket = second;
            games.get(game_id)!.player_white.username =
              players.get(second)!.username;
          } else if (games.get(game_id)?.player_black.socket === "") {
            // Player should be black
            console.log(`Black is assigned to (Second): ${second}`);
            games.get(game_id)!.player_black.socket = second;
            games.get(game_id)!.player_black.username =
              players.get(second)!.username;
          } else {
            // This is a 3rd player
            console.log(`Kicking ${second} out of game ${game_id}`);
            io.in(second).socketsLeave([game_id]);
          }
        }
      }

      // Send game update
      let payload: GameUpdateResponse = {
        result: "success",
        game_id: game_id,
        game: games.get(game_id),
        message: message,
      };
      io.of("/").to(game_id).emit("game_update", payload);
    });

  // Check if game is over
  let legal_moves = 0;
  let whitesum = 0;
  let blacksum = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (games.get(game_id)!.legal_moves[row][col] !== " ") {
        legal_moves++;
      }
      if (games.get(game_id)!.board[row][col] === "w") {
        whitesum++;
      }
      if (games.get(game_id)!.board[row][col] === "b") {
        blacksum++;
      }
    }
  }
  if (legal_moves === 0) {
    let winner = "Tie Game";
    if (whitesum > blacksum) {
      winner = "white";
    } else {
      winner = "black";
    }

    console.log("GAME OVER!!!");
    let payload: GameOver = {
      result: "success",
      game_id: game_id,
      game: games.get(game_id)!,
      who_won: winner,
    };
    io.in(game_id).emit("game_over", payload);

    // Delete old games after one hour
    setTimeout(
      ((id) => {
        return () => {
          games.delete(id);
        };
      })(game_id),
      60 * 60 * 1000
    );
  }
}

export default SocketHandler;
