import { Component, OnInit } from '@angular/core';
import {GameService} from "../../core/services/game.service";
import {Player} from "../../shared/models/Player";
import {interval, mergeMap, Observable, timer} from "rxjs";
import {PlayerState} from "../../shared/models/PlayerState";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  playersList: Player[];
  timer: number;
  currentPlayer: Player; //currently playing
  authorizedPlayer: Player;       // authorized user
  gameId: number;

  constructor(private _gameService: GameService,
              private router: Router,
              private _route: ActivatedRoute) {
    //TODO: get game from backend
    this.gameId = +this._route.snapshot.params['id'];
    this.playersList = _gameService.game.players;
    this.authorizedPlayer = _gameService.player;

    this.timer = this._gameService.game.settings.roundTime;   // TODO: timer animation
    // this.getPlayer();
    // this.getInitialGameState();
    this.updateGameState();
  }

  // getInitialGameState(){
  //   this._gameService.getGame(this.gameId).subscribe(game =>{
  //     this._gameService.game = game;
  //   })
  // }
  // getPlayer(){
  //   this._gameService.getPlayer().subscribe(player => {
  //     this._gameService.player = player;
  //   })
  // }
  updateGameState(){
    this._gameService.postPlayerNewPosition(this._gameService.game.players[0]);
    timer(0, this._gameService.REFRESH_TIME) // GET game state in every 0.5s
      .pipe(mergeMap(() => this._gameService.getGameState())) // to test: getMockGameState()
      .subscribe(playersStates => {
        this.playersList = this._gameService.updatePlayersStates(playersStates);
        this.currentPlayer = this._gameService.updateCurrentPlaying(this.playersList);
        this._gameService.updateMap(this.playersList);
        console.log('update')
      },
        error => {
          if(error.status === 401){
            this.router.navigate(['/']);
          }
        })
  }
  ngOnInit(): void {
  }

  leaveGame() {
    this.router.navigate(['start'])
  }
}
