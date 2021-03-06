import {
  AfterViewInit, ChangeDetectorRef,
  Component, OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameRoomService } from 'src/app/core/services/game-room.service';
import { MapService } from 'src/app/core/services/map.service';
import { UserService } from 'src/app/core/services/user.service';
import { MapResponse } from 'src/app/payload/MapResponse';
import { MapDto } from 'src/app/shared/models/MapDto';
import { RaceMap } from 'src/app/shared/models/RaceMap';
import { User } from 'src/app/shared/models/User';
import {MinPlayersPipe} from "../../shared/pipes/min-players.pipe";

@Component({
  selector: 'app-create-room',
  templateUrl: './create-game-room.component.html',
  styleUrls: ['./create-game-room.component.css'],
})
export class CreateGameRoomComponent implements OnInit, OnDestroy, AfterViewInit {
  mapOptionsForm: FormGroup;
  mapList: MapResponse[];
  mapDatas: MapDto[] = [];
  maxGamers: number[];
  roundTimes: number[];
  mapDtoMap = new Map<String, MapDto>();

  selectedMapSubscription: Subscription;
  selectedMapName: String;

  @ViewChildren('filteredMaps') maps: QueryList<any>;

  constructor(
    private formBuilder: FormBuilder,
    private mapService: MapService,
    private gameRoomService: GameRoomService,
    private userService: UserService,
    private router: Router,
    private cdRef: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.mapOptionsForm = this.formBuilder.group({
      maxGamersNumber: ['1', []],
      roundTime: ['3s', []],
      map: ['1', []],
    });
    this.maxGamers = Array.from({ length: 8 }, (_, i) => i + 1);
    this.roundTimes = [3, 4, 5, 6, 7, 8, 9, 10, 15];
    this.mapService.getMaps().subscribe((result) => {
      this.mapList = result;

      for (let i = 0; i < this.mapList.length; i++) {
        this.getMapData(this.mapList[i].mapId, i);
      }
    });
    this.subscribeToMap();

  }
  ngAfterViewInit() {
    this.maps.changes.subscribe(maps=> {
      if(maps.first == undefined)
        this.mapService.clearMap()
      else {
        this.mapOptionsForm.controls['map'].setValue(maps.first.nativeElement.value)
        this.selectedMapName = maps.first.nativeElement.value
        this.setMap()
        this.cdRef.detectChanges()
      }
    })

  }

  ngOnDestroy(): void {
    this.selectedMapSubscription?.unsubscribe();
    this.mapService.clearMap();
  }

  private subscribeToMap() {
    this.selectedMapSubscription = this.mapOptionsForm.controls[
      'map'
    ].valueChanges.subscribe((value) => {
      this.selectedMapName = value;
      console.log(this.mapDtoMap);
      console.log(this.mapDtoMap.get(this.selectedMapName))
      console.log(this.selectedMapName)
      this.mapService.clearMap();
      this.setMap();
    });
  }
  private setMap(){
    MapService.map.next(this.mapDatas[this.mapDatas.findIndex(map => map.name == this.selectedMapName)].raceMap)

  }
  getMapData(mapId: number, i: number) {
    let mapDto: MapDto;
    this.mapService.getMap(mapId).subscribe((data: MapResponse) => {
      let mapAuthor: User;
      this.userService
        .getUserData(data.userId)
        .subscribe((data2) => (mapDto.author = data2));
        if(data.name == null) data.name = mapId.toString()
      mapDto = {
        raceMap: new RaceMap(

          data.name,
          data.userId,
          data.width,
          data.height,
          data.mapStructure.finishLine,
          data.mapStructure.startLine,
          data.mapStructure.obstacles,
          data.mapId

        ),
        // name: data.name,
        name: data.name,
        gamesPlayed: data.gamesPlayed,
        rate: data.rating,
        author: mapAuthor,
      };
      this.mapDatas.push(mapDto);
      this.mapDtoMap.set(mapDto.name, mapDto);
      this.selectedMapName = this.mapDatas[0].name;
      this.setMap();

    });
  }

  // nie zmienia sie to w tym option
  getRandomMap(){
    let numberOfMaps = this.mapDatas.length;
    let randomIndex = Math.floor(Math.random() * numberOfMaps);
    this.selectedMapName = this.mapDatas[randomIndex].name;
    this.mapOptionsForm.controls[
      'map'
      ].setValue(this.selectedMapName)
    this.subscribeToMap()
  }

  createRoom() {
    if (this.mapOptionsForm.valid) {
      let findId = this.mapDatas[this.mapDatas.findIndex(map => map.name == this.mapOptionsForm.value.map)].raceMap.mapId;
      let id: number;
      let mapId: number = findId;
      let playersLimit: number = parseInt(
        this.mapOptionsForm.value.maxGamersNumber
      );
      let time: number = parseInt(
        this.mapOptionsForm.value.roundTime.slice(0, -1)
      );
      this.gameRoomService
        .createGameRoom(
          mapId,
          playersLimit,
          time,
          this.userService.getCurrentLoggedUserId()
        )
        .subscribe((data) => {
          id = data.roomId;
          this.gameRoomService
            .addUser(id, this.userService.getCurrentLoggedUserId())
            .subscribe(() => {
              this.router.navigate(['game-room', id]);
            });
        });
    }
  }
}
