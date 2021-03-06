import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameRoomService } from 'src/app/core/services/game-room.service';
import { MapService } from 'src/app/core/services/map.service';
import { UserService} from 'src/app/core/services/user.service';
import { GameRoomDto } from '../../shared/models/GameRoomDto';
import { MapDto } from '../../shared/models/MapDto';
import { UserExtension } from '../../shared/models/UserExtension';
import { RaceMap } from '../../shared/models/RaceMap';
import { Vector } from '../../shared/models/Vector';
import { User } from '../../shared/models/User';
import { GameRoomResponse } from 'src/app/payload/GameRoomResponse';
import { MapResponse } from 'src/app/payload/MapResponse';
import { UserService as UserService2} from 'src/app/core/services/user.service';
import {GameService} from "../../core/services/game.service";
import {Player} from "../../shared/models/Player";
import {Game} from "../../shared/models/Game";
import {MockDataProviderService} from "../../core/services/mock-data-provider.service";
import {GameSettings} from "../../shared/models/GameSettings";

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {

  gameRoomData : GameRoomDto;
  usersExtensions : UserExtension[] = new Array();

  gameRoomId : number;
  gameStarted: boolean = false;

  timer: number = 3;

  gameId : number;

  constructor(
    private mapService : MapService,
    private gameRoomService: GameRoomService,
    private userService : UserService,
    private router : Router,
    private route : ActivatedRoute,
    private userService2 : UserService2,
    private gameService: GameService,
    private mockData: MockDataProviderService

    ) {

  }

  ngOnInit(): void {
    this.gameRoomId = +this.route.snapshot.params['id'];

    this.getGameRoomData();

    this.refresh();

  }

  refresh(){
    setTimeout(() => {
      if(this.gameRoomId){
        this.getPlayers(this.gameRoomId);
        this.getGameStarted(this.gameRoomId);
        if(JSON.parse(localStorage.getItem("jwtResponse")) && this.router.url == "/game-room/" + this.gameRoomId){
          this.refresh()
        }
      }
    }, 500);
  }

  makeExpand(player : UserExtension){
    player.extended = !player.extended;
  }

  kick(user : User){
    this.gameRoomService.deleteUser(this.gameRoomId, user.userId).subscribe(() => {
      console.log("User removed")
    });
  }

  ready(){
    return this.gameRoomData && this.gameRoomData.mapDto && this.gameRoomData.owner && this.gameRoomData.mapDto.author;
  }

  isOwner() : boolean{
    if(this.gameRoomData.owner.userId){

      return this.gameRoomData.owner.userId == this.userService.getCurrentLoggedUserId();
    }
    else
      return false;
  }

  leave(){
    this.gameRoomService.deleteUser(this.gameRoomId, this.userService.getCurrentLoggedUserId()).subscribe();
    this.router.navigate(["/start"]);
  }

  close(){
    let usersNumber = this.gameRoomData.usersList.length;
    let counter = 0;
    for(let user of this.gameRoomData.usersList){
      this.gameRoomService.deleteUser(this.gameRoomId, user.userId).subscribe(() => {
        counter += 1;
        if(counter == usersNumber){
          setTimeout(() => this.gameRoomService.deleteGameRoom(this.gameRoomId).subscribe(), 5000)
          this.router.navigate(["/start"])
        }
      });
    }
  }

  getAvatar(avatar: string){
    return this.userService.convertImage(avatar);
  }

  startGame(){
    this.gameRoomService.startGame(this.gameRoomId).subscribe((data : number) => {
      this.gameId = data
    })
  }

  getGameRoomData() {
    this.gameRoomService.getGameRoom(this.gameRoomId)
    .subscribe((data: GameRoomResponse) => {

        let mapDto : MapDto;
        this.mapService.getMap(data.mapId).subscribe((data2: MapResponse) => {
          let mapAuthor : User;
          this.userService2.getUserData(data2.userId).subscribe(data3 => mapDto.author = data3)
          mapDto = {
            raceMap : new RaceMap(

              data2.name,
              data2.userId,
              data2.width,
              data2.height,
              data2.mapStructure.finishLine,
              data2.mapStructure.startLine,
              data2.mapStructure.obstacles,
              data2.mapId
            ),
            name: data2.name,
            gamesPlayed: data2.gamesPlayed,
            rate: data2.rating,
            author: mapAuthor
          }
          this.gameRoomData.mapDto = mapDto;
          MapService.map.next(<RaceMap>mapDto.raceMap);
          }
        )

        this.userService2.getUserData(data.gameMasterId).subscribe(data => this.gameRoomData.owner = data);

        this.gameRoomData = {
        id: data.roomId,
        mapDto: null,
        playersLimit: data.playersLimit,
        roundTime: data.roundTime,
        usersList: [],
        owner: null
      }
    }
    )
  }

  getPlayers(roomId: number) {
    console.log(this.gameRoomData)
    this.gameRoomService.getPlayers(roomId).subscribe((data: User[]) => {
      this.gameRoomData.usersList = data;
      for(let user of this.gameRoomData.usersList){
        if(this.usersExtensions.map(userExtension => userExtension.user.userId).includes(user.userId)){

        }
        else{
          this.usersExtensions.push({user: user, extended: false} as UserExtension)
        }
      }

      if(this.usersExtensions.length > this.gameRoomData.usersList.length){
        for(let userExt of this.usersExtensions){
          if(!this.gameRoomData.usersList.includes(userExt.user)){
            this.usersExtensions.splice(this.usersExtensions.indexOf(userExt), 1)
          }
        }
      }
      if(!data.map(user => user.userId).includes(this.userService.getCurrentLoggedUserId())){
        this.gameRoomService.getRandomGameRoomId().subscribe( (id: number) => {
          if (id != -1) {
            this.router.navigate(['game-room', id]);
            this.gameRoomId = id;
            this.ngOnInit();
          }
          else this.router.navigate(["/start"]);
        })
      }
    });
  }

  getGameStarted(roomId: number) {
    this.gameRoomService.getGameStarted(roomId).subscribe((data: number) => {
      if (!this.gameStarted && data != -1) {
        console.log("Starting game")
        this.gameStarted = true;
        this.showModal();
      }
    });
  }
  initGame(){
    let players = new Array<Player>()
    this.gameRoomService.getGameRoom(this.gameRoomId)
    .subscribe((data: GameRoomResponse) => {
        this.mapService.getMap(data.mapId).subscribe((data2: MapResponse) => {
          this.usersExtensions.map(userExtension => userExtension.user)
            .forEach(user => {
              let player = new Player(user.userId, user.login, data2.mapStructure.startLine[players.length], 'green', user.avatar);
              players.push(player);
            })
          this.gameRoomService.initGame(players, this.gameRoomId).subscribe(response => {
            this.router.navigate(["/game/" + this.gameRoomId]).then(() =>{
            })
          })
        })
    })
  }

  showModal() {
    setTimeout(() => {
      this.timer -= 1;
      setTimeout(() => {
        this.timer -= 1;
        setTimeout(() => {
          this.initGame();
        }, 1000)
      }, 1000)
    }, 1000)

  }

}


