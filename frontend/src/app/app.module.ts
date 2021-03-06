import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './navigation/app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './shared/components/map/map.component';
import { GameRoomComponent } from './components/game-room/game-room.component';
import { CreateGameRoomComponent } from './components/create-game-room/create-game-room.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterSuccessComponent } from './components/register/register-success/register-success.component';
import { StartPageComponent } from './components/start-page/start-page.component';
import { GameComponent } from './components/game/game.component';
import { JoinGameRoomComponent } from './components/start-page/join-game-room/join-game-room.component';
import {ProfileComponent} from "./components/profile/profile.component";
import { RankingComponent } from './components/ranking/ranking.component';
import {CreateMapComponent} from "./components/create-map/create-map.component";
import { MapsRankComponent } from './components/maps-rank/maps-rank.component';
import { RateMapModalComponent } from './components/rate-map-modal/rate-map-modal.component';
import { NgbModule, NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { InstructionComponent } from './components/instruction/instruction.component';
import { MinPlayersPipe } from './shared/pipes/min-players.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    RegisterSuccessComponent,
    MapComponent,
    StartPageComponent,
    MapComponent,
    GameComponent,
    JoinGameRoomComponent,
    GameRoomComponent,
    CreateGameRoomComponent,
    GameComponent,
    ProfileComponent,
    CreateMapComponent,
    MapsRankComponent,
    RankingComponent,
    CreateMapComponent,
    RateMapModalComponent,
    InstructionComponent,
    MinPlayersPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
