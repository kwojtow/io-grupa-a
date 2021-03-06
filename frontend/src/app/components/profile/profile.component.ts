import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { User } from '../../shared/models/User';
import { MapService } from '../../core/services/map.service';
import { UserService } from '../../core/services/user.service';
import { MapWithStats } from '../../shared/models/MapWithStats';
import { MockDataProviderService } from '../../core/services/mock-data-provider.service';
import {RaceMap} from "../../shared/models/RaceMap";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  mapList = new Array<MapWithStats>();
  user: User;
  mapListsCategories = new Array<string>(
    'Moje mapy',
    'Najlepsze mapy',
    'Najczęstsze mapy'
  );
  chosenCategory = this.mapListsCategories[0];
  chosenMap: MapWithStats;
  allGames: number
  mapRate: number
  avatar: SafeResourceUrl;
  file: File = null;

  constructor(
    private router: Router,
    private _mapService: MapService,
    private _userService: UserService,
    private _mockData: MockDataProviderService,
    private sanitizer: DomSanitizer
  ) {
    this.getProfileData();

    // this.getMockProfileData();
  }
  private getMockProfileData() {
    this.mapList = this._mockData.getExampleMapResponseList(3);
    this.user = this._mockData.getExampleUser();
  }

  private getProfileData(){
    this._userService.getUser().subscribe(user => {
        this.user = user
        this.avatar = this._userService.convertImage(this.user.avatar);
        this._userService.getUserStats(user.userId).subscribe(stats => this.user.statistics = stats);
        this._userService.getUserRanksInfo(user.userId).subscribe(ranks => this.user.ranks = ranks);
        this._userService.getUserMaps(user.userId).subscribe(mapList => {
          this.mapList = mapList
          if(this.mapList.length > 0) MapService.map.next(this.mapList[0].raceMap);
          this.chosenMap = mapList.filter(map => map.raceMap.mapId === MapService.map.getValue().mapId).shift();
          this.setMapStats(this.chosenMap.raceMap.mapId);

          // for(let i = 0 ; i < 10; i ++){
          //   this.mapList.push(new MapWithStats(new RaceMap(i+10, 'map' + i, 1, 60, 30, [], [], []), 10))
          // }
        });

      },
      (error) => {
        if (error.status === 401) {
          this.router.navigate(['/']).then();
        }
      }
    );
  }
  ngOnInit(): void {
  }
  ngOnDestroy() {
    this._mapService.clearMap();
  }

  switchToStartView() {
    this.router.navigate(['start']).then();
  }

  logout() {
    this.router.navigate(['/']).then(() => localStorage.clear());
  }

  switchToNewMapView() {
    this.router.navigate(['create-map']).then();
  }

  changeMap(selectRef: number) {
    MapService.map.next(this.mapList[this.mapList.findIndex(map => map.raceMap.mapId === selectRef)].raceMap);
    this.chosenMap = this.mapList.filter(map => map.raceMap.mapId === MapService.map.getValue().mapId).shift();
    this.setMapStats(this.chosenMap.raceMap.mapId);
  }
  setMapStats(mapId: number){
    this._mapService.getMap(mapId).subscribe(mapResponse => {
      this.mapRate = mapResponse.rating;
      this.allGames = mapResponse.gamesPlayed;
    })
  }
  changeMapCategory(selectRef: string) {

    this.chosenCategory = selectRef;
    let idx = this.mapListsCategories.indexOf(selectRef);
    let mapListObs: Observable<Array<MapWithStats>>;
    if(idx === 0){
      mapListObs = this._userService.getUserMaps(this.user.userId);
    }else if(idx === 1){
      mapListObs = this._userService.getMapsWithMostWins();
    }else if(idx){
      mapListObs = this._userService.getMapsWithMostGames();
    }
    this._mapService.clearMap();
    mapListObs.subscribe(mapList => {
      this.mapList = mapList
      if(this.mapList.length > 0) MapService.map.next(this.mapList[0].raceMap);
    });
  }
  deleteMap(){
    if(this.chosenMap !== null) {
      this._mapService.deleteMap(MapService.map.getValue().mapId);
      setTimeout(() => {
        window.location.reload();
      }, 200);
      // window.location.reload()
    }
  }

  onChange(event: any) {
    this.file = event.target.files[0];
    this.upload();
  }

  upload(){
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.file);
    this._userService.uploadAvatar(uploadImageData).subscribe(()=>{
    });
    this.refresh();
  }

  refresh(): void {
    window.location.reload();
}
}



