package agh.io.iobackend.service;

import agh.io.iobackend.controller.payload.game.PlayerInitialCoord;
import agh.io.iobackend.controller.payload.game.PlayerMoveRequest;
import agh.io.iobackend.controller.payload.game.PlayerStateResponse;
import agh.io.iobackend.exceptions.GameRoomNotFoundException;
import agh.io.iobackend.exceptions.NoGameFoundException;
import agh.io.iobackend.model.game.Game;
import agh.io.iobackend.model.game.GameRoom;
import agh.io.iobackend.model.player.Player;
import agh.io.iobackend.model.user.User;
import agh.io.iobackend.repository.GameRepository;
import agh.io.iobackend.repository.GameRoomRepository;
import agh.io.iobackend.repository.PlayerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GameService {

    private static final Logger logger = LoggerFactory.getLogger(GameService.class);

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private StatisticsService statisticsService;

    @Autowired
    private GameRoomRepository gameRoomRepository;

    @Autowired
    private GameRoomService gameRoomService;

    @Autowired
    private PlayerRepository playerRepository;


    public Game createGame(Game game) {
        logger.info("create game");
        return gameRepository.save(game);
    }

    public Game getGameFromRepo(Long id) throws NoGameFoundException {
        Optional<Game> game = gameRepository.findByGameId(id);
        logger.info("start game");
        if (game.isPresent()){
            return game.get();
        }
        else{
            throw new NoGameFoundException("Cannot find the room");
        }
    }

    public void startGame(Long gameId, ArrayList<PlayerInitialCoord> playerInitialCoordsList) throws NoGameFoundException {
        Game game = getGameFromRepo(gameId);
        for (PlayerInitialCoord playerInitialCoord : playerInitialCoordsList){
            Player player = new Player(playerInitialCoord.getXCoord(), playerInitialCoord.getYCoord(), playerInitialCoord.getUserId());
            playerRepository.save(player);
            game.startGameForPlayer(player);
        }
        game.setPlayerThatStarts();
    }

    public ArrayList<PlayerStateResponse> getPlayerStatesList(Long gameId){
        logger.info("getPlayerStatesList");
        return getGameFromRepo(gameId).getPlayerStatesList();
    }

    public void updateGameStateAfterMove(GameState gameState, PlayerMoveRequest playerMove) {
        logger.info("updateGameStateAfterMove");
        game.changeGameState(playerMove);
    }

    public void endGame(Long gameId) throws NoGameFoundException, GameRoomNotFoundException {
        Game game = getGameFromRepo(gameId);
        Long gameRoomId = game.getGameRoomId();
        GameRoom gameRoom = gameRoomService.getGameRoom(gameRoomId);
        gameRoom.setGameStarted(false);
        List<User> users = gameRoom.getUserList();
        if (users.size() == game.getNumOfPlayers()) {  // szczegolnie do testow potrzebne
            for (User user : users) {
                statisticsService.saveHistoryEntry(game.getMap(), user, game.getPlayer(user.getUserId()).checkPlayerResult(), 100);
            }
        }
        gameRoom.setGame(null);
        gameRepository.delete(game);
    }

    public void clearGames(){
        gameRepository.deleteAll();
    }

    public void removeFromGame(Long gameRoomId, Long PlayerId) throws NoGameFoundException {
        GameRoom gameRoom = gameRoomRepository.getById(gameRoomId);
        Game game = getGameFromRepo(gameRoom.getGame().getGameId());
        game.removePlayer(PlayerId);
    }
}

//TODO jesli ktos przegra jako ostatni - to nie powinien dostac wiecej pukntow niz ten ktory przegral jako pierwszy?