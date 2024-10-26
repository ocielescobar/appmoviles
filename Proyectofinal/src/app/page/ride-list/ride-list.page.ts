import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ride-list',
  templateUrl: './ride-list.page.html',
  styleUrls: ['./ride-list.page.scss'],
})
export class RideListPage implements OnInit {
  rides = [
    { destination: 'Casa Central', cost: 1500 },
    { destination: 'Plaza Ñuñoa', cost: 2000 },
    { destination: 'Mall Plaza', cost: 1800 },
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
