import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.page.html',
  styleUrls: ['./state.page.scss'],
})
export class StatePage implements OnInit {
  public state: string = "India"
  public stateWiseData: any = {}
  public stateWiseArray: any = []
  public total: number = 0
  public todayTotal: number = 0
  constructor(private activatedRoute: ActivatedRoute, public utils: UtilsService) { }

  ngOnInit() {
    this.state = this.activatedRoute.snapshot.paramMap.get('state');
    const data = this.utils.stateWiseData[this.state] ? this.utils.stateWiseData[this.state].districtData : null;
    if(data) {
      this.stateWiseArray = Object.entries(data)
      const newData = this.stateWiseArray.map((item, i) => {
        return {
          district: item[0],
          ...item[1]
        }
      })
      this.stateWiseData = newData;
      this.getTotal(newData)
      this.getTodayTotal(newData)
    }
    else {}
    
  }
  getTotal (data: any) {
    let count: number = 0
    for (let item of data) {
      count += parseInt(item.confirmed)
    }
    this.total = count;
  }
  getTodayTotal (data: any) {
    let count: number = 0
    for (let item of data) {
      count += parseInt(item.delta.confirmed)
    }
    this.todayTotal = count;
  }

}
