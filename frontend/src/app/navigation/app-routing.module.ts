import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterSuccessComponent } from '../components/register/register-success/register-success.component';
import { RegisterComponent } from '../components/register/register.component';
import { StartPageComponent } from '../components/start-page/start-page.component';
import {GameComponent} from "../components/game/game.component";
import { CreateGameRoomComponent } from '../components/create-game-room/create-game-room.component';
import { GameRoomComponent } from '../components/game-room/game-room.component';
import {ProfileComponent} from "../components/profile/profile.component";
import { RankingComponent } from '../components/ranking/ranking.component';
import {CreateMapComponent} from "../components/create-map/create-map.component";
import { MapsRankComponent } from '../components/maps-rank/maps-rank.component';
import { RateMapModalComponent } from '../components/rate-map-modal/rate-map-modal.component';
import { InstructionComponent } from '../components/instruction/instruction.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'success', component: RegisterSuccessComponent },
  { path: 'start', component: StartPageComponent },
  { path: 'game', component: GameComponent},
  { path: 'game/:id', component: GameComponent},
  { path: 'create-game-room', component: CreateGameRoomComponent},
  { path: 'game-room/:id', component: GameRoomComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'create-map', component: CreateMapComponent},
  { path: 'map/rank', component: MapsRankComponent},
  { path: 'ranking', component: RankingComponent},
  { path: 'create-map', component: CreateMapComponent},
  { path: 'rate-map', component: RateMapModalComponent},
  { path: 'instruction', component: InstructionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
