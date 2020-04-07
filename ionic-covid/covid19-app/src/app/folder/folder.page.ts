import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate, formatDateAbsolute } from '../utils'
import { formatDistance } from "date-fns"
import { UtilsService } from '../utils.service';
// import { Route } from '@angular/compiler/src/core';
@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit, OnDestroy {
  public folder: string;
  public data: any = {}
  public stateDistrictWiseData: any = {}
  public states: any = []
  public timeSeries: any
  public lastUpdated: any
  public newCases: any = {
    deltaconfirmed: 0,
    deltarecovered: 0,
    deltadeaths: 0
  }
  public times: any = "--";
  public total: any = {
    confirmed: 0,
    active: 0,
    recovered: 0,
    deaths: 0
  }
  public mappedStates: any = []
  public fetched: boolean = false;
  public color: string = "#fff"
  public error: boolean = false;
  public loading: boolean = true;
  public refreshTime: any;
  public intervalId: any;

  constructor(private activatedRoute: ActivatedRoute, public router: Router, public utils: UtilsService) { }

  ngOnInit() {
    this.loading = true;
    window.clearInterval(this.intervalId)
    window.localStorage.setItem("time", JSON.stringify(new Date()))
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.getData("no event")

  }
  lastRefresh (name: string) {
    window.clearInterval(this.intervalId)
    this.intervalId = setInterval(() => {
      this.calculateTime(name)
    }, 120000)
  }
  calculateTime(name: string) {
    const oldTime = JSON.parse(window.localStorage.getItem(name))
      const a = formatDistance(new Date(oldTime), new Date())
      this.refreshTime = a
      console.log("distance======>", a)
  }
  clearTimeLoop () {
    window.clearInterval(this.intervalId)
  }
  pullRefresh(event) {
    const time = window.localStorage.getItem("time")
    this.getData(event)
    // if (!time) {
    //   window.localStorage.setItem("time", JSON.stringify(new Date()))
    // } else {
    //   const now = new Date()
    //   window.localStorage.setItem("time", JSON.stringify(now))
    // }
    // setTimeout(() => {
    //   console.log('Async operation has ended');
    //   event.target.complete();
    // }, 3000);
  }
  tap() {
    this.error = false;
    this.loading = true;
    this.getData("no event")
  }
  async getData(event: any) {
    console.log(this.error, "error")
    // this.loading = this.error ? true : false
    try {
      const [response, stateDistrictWiseResponse] = await Promise.all([
        fetch('https://api.covid19india.org/data.json'),
        fetch('https://api.covid19india.org/state_district_wise.json'),
      ]);
      const [data, stateDistrictWiseData] = await Promise.all([response.json(), stateDistrictWiseResponse.json()])
      this.data = data
      this.stateDistrictWiseData = stateDistrictWiseData
      // console.log("data", data)
      // console.log("=================")
      // console.log("dataState", stateDistrictWiseData)
      // const a = data.statewise.reduce((a, state) => {
      //   return { ...a, [state.state]: false };
      // }, {})
      this.states = data.statewise
      this.timeSeries = data.cases_time_series
      this.lastUpdated = data.statewise[0].lastupdatedtime
      this.newCases = 
      data && data.key_values && data.key_values[0] 
        ? data.key_values[0] 
        : data.statewise[0] && data.statewise[0].deltaconfirmed 
        ? data.statewise[0] 
        : this.newCases
      this.total = data.statewise[0]
      // console.log("aaaaaaaaaaaaaaaaaaaaaaaaa", a)
      this.getLastUpdate(this.lastUpdated)
      this.mapStates(data.statewise)
      this.utils.stateWiseData = this.stateDistrictWiseData
      console.log("dataState========================>", stateDistrictWiseData)
      this.fetched = true;
      this.error = false;
      this.loading = false;
      window.localStorage.setItem("time", JSON.stringify(new Date()))
      this.lastRefresh("time")
      if(event && event.target) {
        this.calculateTime("time")
        event.target.complete();
      }
    }
    catch (e) {
      console.log("Error => ", e)
      this.error = true;
      this.loading = false;
    }
  }
  redirectPage(state: string) {
    this.router.navigateByUrl(`/folder/home/${state}`)
  }
  getLastUpdate(lastUpdated: any) {
    const lastupdatedtime = lastUpdated;
    const newTime = formatDate(lastupdatedtime);
    const time = {
      time: formatDistance(new Date(newTime), new Date()),
      date: formatDateAbsolute(lastupdatedtime)
    }
    this.times = time;

    console.log("Time====>", time)
  }
  mapStates(states: any) {
    let newStates = [...states]
    const mappedStates = newStates.map((state: any) => {
      return {
        ...state,
        firstLetter: state.state.slice(0, 1),
        color: this.makeRandomColor()
      }
    })
    this.mappedStates = mappedStates.sort((a: any, b: any) => {
      const newA = parseInt(a.confirmed)
      const newB = parseInt(b.confirmed)
      return newB - newA
    })
  }
  makeRandomColor() {
    const color = "#" + Math.floor(Math.random() * 16777215).toString(17)
    return color;
    // const letters = '0123456789ABCDEF'.split('');
    // let color = '#';
    // for (var i = 0; i < 6; i++ ) {
    //     color += letters[Math.floor(Math.random() * 16)];
    // }
    // return color;
  }
  ngOnDestroy () {
    this.clearTimeLoop()
  }
}
