package agh.io.iobackend.repository;

import agh.io.iobackend.model.game.Game;
import agh.io.iobackend.model.map.GameMap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Long> {
    Optional<Game> findByGameId(Long id);
    Boolean existsByGameMap(GameMap gameMap);
}
