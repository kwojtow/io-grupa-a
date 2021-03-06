import { Component, OnInit } from '@angular/core';
import {MapService} from "../../core/services/map.service";
import {RaceMap} from "../../shared/models/RaceMap";
import {Vector} from "../../shared/models/Vector";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MapResponse} from "../../payload/MapResponse";
import {Router} from "@angular/router";
import {UserService} from "../../core/services/user.service";
import {User} from "../../shared/models/User";

enum ObjectType{
  NONE, START, FINISH, OBSTACLE
}

@Component({
  selector: 'app-create-map',
  templateUrl: './create-map.component.html',
  styleUrls: ['./create-map.component.css']
})
export class CreateMapComponent implements OnInit {
  objectTypeEnum = ObjectType;
  map: RaceMap;
  chosenObject = ObjectType.NONE;
  user : User;
  mapSizes =[
    {name: 'Mały', width: 40, height: 28},
    {name: 'Średni', width: 60, height: 42},
    {name: 'Duży', width: 102, height: 70},
  ]
  chosenSizeIdx = 0;

  constructor(private _mapService: MapService,
              private _http: HttpClient,
              private _userService: UserService,
              private router: Router) {
    this.resetMap();
  }

  ngOnInit(): void {
    this._userService.getUser().subscribe(user => {
      this.user = user;
    });
  }

  drawObject(event: MouseEvent) {
    const v = MapService.getCursorPosition(this._mapService.canvas, event);
    this.clearField(v);
    console.log(this.map.startLine)
    switch(this.chosenObject) {
      case ObjectType.START: {
        this.map.startLine.push(v);
        break;
      }
      case ObjectType.FINISH: {
        this.map.finishLine.push(v);

        break;
      }
      case ObjectType.OBSTACLE: {
        this.map.obstacles.push(v);
        break;
      }
      default: {
        //do nothing;
        break;
      }
    }
    MapService.map.next(this.map);
  }

  clearField(v: Vector){
    this.map.startLine = this.map.startLine.filter(vector => !vector.equals(v));
    this.map.finishLine = this.map.finishLine.filter(vector => !vector.equals(v));
    this.map.obstacles = this.map.obstacles.filter(vector => !vector.equals(v));
  }

  changeObjectType(type: ObjectType) {
    this.chosenObject = type;
  }

  saveMap(name: string) {
    let alertString = '';
    let valid = true;
    if(name === undefined || name === '' || name === null){alertString += 'Podaj nazwę mapy! \n'; valid = false;}
    if(this.map.startLine.length < 2 || this.map.finishLine.length < 1){alertString += 'Narysuj conajmniej 2 pola startu i conajmniej jedno pole mety!'; valid = false}

    if(!valid){
      alert(alertString);
    }else{
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + JSON.parse(localStorage.getItem("jwtResponse")).token,
        })
      };
      const finishLine = this.map.finishLine;
      const startLine = this.map.startLine;
      const obstacles = this.map.obstacles;
      const mapResponse = new MapResponse(-1,
        name,
        this.map.mapWidth,
        this.map.mapHeight,
        this.map.userId,
        {finishLine, startLine, obstacles}, 0, 0)
      this.resetMap();
      return this._http.post<any>("http://localhost:8080/map", mapResponse, httpOptions)
        .subscribe(id => {
          this.map.mapId = id;
          this.router.navigate(['/profile'])

        });
    }
  }
  resetMap(){
    const userId: number = JSON.parse(localStorage.getItem('jwtResponse')).id;
    this.map = new RaceMap('', userId, this.mapSizes[this.chosenSizeIdx].width, this.mapSizes[this.chosenSizeIdx].height, [], [], []);
    MapService.map.next(this.map);
  }

  changeMapSize() {
    this.chosenSizeIdx = (this.chosenSizeIdx + 1) % this.mapSizes.length;
    this.resetMap();
  }
}
