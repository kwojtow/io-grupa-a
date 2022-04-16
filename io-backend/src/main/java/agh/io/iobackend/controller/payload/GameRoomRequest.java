package agh.io.iobackend.controller.payload;

import lombok.Data;

@Data
public class GameRoomRequest {
    private Long mapId;
    private int playersLimit;
    private int roundTime;
    private Long gameMasterId;
}
