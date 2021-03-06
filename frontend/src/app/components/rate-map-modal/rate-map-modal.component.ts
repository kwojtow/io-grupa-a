import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MapService } from 'src/app/core/services/map.service';

@Component({
  selector: 'app-rate-map-modal',
  templateUrl: './rate-map-modal.component.html',
  styleUrls: ['./rate-map-modal.component.css']
})
export class RateMapModalComponent implements OnInit {

  public currentRate : number;

  @Input()
  public mapId : number;

  constructor(private mapService : MapService,
              private router : Router) { }

  ngOnInit(): void {
  }

  send(){
    this.mapService.sendRate(this.mapId, this.currentRate).subscribe(() => {
      this.router.navigate(["/start"]);
    });
  }

}
