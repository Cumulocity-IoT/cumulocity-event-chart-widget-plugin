/**
 * Copyright (c) 2020 Software AG, Darmstadt, Germany and/or its licensors
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input, ViewEncapsulation, OnDestroy, isDevMode } from '@angular/core';
import { EventService, InventoryService, Realtime } from '@c8y/client';
import * as moment_ from 'moment';
const moment = moment_;
@Component({
  selector: 'lib-gp-lib-event-chart',
  templateUrl: './gp-lib-event-chart.component.html',
  styleUrls: ['./gp-lib-event-chart.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class GpLibEventChartComponent implements OnInit, OnDestroy {
  @Input() config;
  dataLoaded: Promise<boolean>;
  dataSetHasData = false;
  fromDate = '';
  toDate = '';
  colorsArr = [];
  realTimeEventSubArray = [];
  realtimeState = true;
  public barChartType;
  public barChartData = [];
  public barChartLabels = [];
  public barChartColors = [];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      position: 'top',
      display: true
    },
    scales: {},
    elements: {
      line: {
        fill: false,
      },
    },
  };

  constructor(
    public events: EventService,
    private inventory: InventoryService,
    public realtimeService: Realtime
  ) { }
  /** Sets the barchart type and barchart options for canvas and calls device list */
  ngOnInit() {
    if (isDevMode()) {
    }
    this.barChartType = this.config.type;
    if (this.config.type === 'stackChart') {
      this.barChartType = 'bar';
      // tslint:disable-next-line: no-string-literal
      this.barChartOptions['scales'] = {
        xAxes: [
          {
            stacked: true, // this should be set to make the bars stacked
          },
        ],
        yAxes: [
          {
            stacked: true, // this also..
          },
        ],
      };
    } else if (this.config.type === 'line' || this.config.type === 'horizontalBar' || this.config.type === 'bar') {
      // tslint:disable-next-line: no-string-literal
      this.barChartOptions['scales'] = {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      };
    }
    if (this.config.legend === 'none') {
      this.barChartOptions.legend.display = false;
    } else {
      this.barChartOptions.legend.position = this.config.legend;
      this.barChartOptions.legend.display = true;
    }
    this.getDeviceList();
  }
  refresh() {
    this.getDeviceList();
  }
  /** Toggles the realtime state */
  toggle() {
    this.realtimeState = !this.realtimeState;
    if (this.realtimeState) {
      this.getDeviceList();
    }
  }
  /** sets the chart color and border color based on configuration */
  setChartColors() {
    let borderColor = [];
    if (this.config.color !== undefined) {
      this.colorsArr = this.config.color.split(';');
      if (
        this.config.borderColor === undefined ||
        this.config.borderColor === ''
      ) {
        borderColor = [];
      } else {
        borderColor = this.config.borderColor.split(';');
      }

      if (this.config.color === '') {
        this.barChartColors = [];
      } else if (
        this.config.type === 'stackChart' &&
        this.colorsArr.length >= this.barChartData.length
      ) {
        for (let k = 0; k < this.barChartData.length; k++) {
          this.barChartColors.push({
            backgroundColor: this.colorsArr[k],
            borderColor,
          });
        }
      } else if (this.barChartType !== 'pie' && this.barChartType !== 'doughnut' && this.barChartType !== 'polarArea') {
        this.barChartColors = [{
          backgroundColor: this.colorsArr[0],
          borderColor: borderColor.length > 0 ? borderColor[0] : borderColor
        }];

      } else if (this.barChartData[0].data.length <= this.colorsArr.length) {
        if (borderColor.length < this.barChartData[0].data.length) {
          borderColor = [];
        }
        this.barChartColors = [{
          backgroundColor: this.colorsArr,
          borderColor
        }];
      } else {
        this.barChartColors = [];
      }
    } else {
      this.barChartColors = [];
    }
  }
  /** On selcting date from date picker this function is called */
  dateChanged(x, event) {
    if (x === 'from') {
      this.fromDate = event.value;
    } else {
      this.toDate = event.value;
    }
  }
  /** when filter button is clicked device list is called for the selected dates */
  filter() {
    this.getDeviceList();
  }

  /** Fetches child assets for the selected devices and fetch events for each of them */
  async getDeviceList() {
    if (this.realTimeEventSubArray.length !== 0) {
      this.realTimeEventSubArray.map(sub => {
        this.realtimeService.unsubscribe(sub);
      });
    }
    let dataSet = {};
    const inventory = await this.inventory.detail(this.config.device.id);
    if (inventory !== undefined) {
      const response = inventory.data;
      const devicesAll = response.childAssets.references;
      if (devicesAll.length === 0) {
        dataSet = await this.fetchEvents(response.id, dataSet);
        this.fetchRealtimeEvents(response.id, dataSet);
        this.createChart(dataSet);
        this.dataSetHasData = true;
      } else {
        const promises = devicesAll.map(async (device) => {
          dataSet = await this.fetchEvents(device.managedObject.id, dataSet);
          this.fetchRealtimeEvents(device.managedObject.id, dataSet);
        });
        await Promise.all(promises);
        if (Object.keys(dataSet).length > 0) {
          this.createChart(dataSet);
          this.dataSetHasData = true;
        } else {
          this.dataSetHasData = false;
        }
      }
    }
  }
  /** this function fetches the eventas at realtime */
  fetchRealtimeEvents(deviceId, dataSet) {
    const eventURL = `/events/` + deviceId;
    const sub = this.realtimeService
      .subscribe(eventURL, (response) => {
        if (this.realtimeState) {
          if (response && response.data) {
            const singleEvent = response.data.data;
            if (singleEvent.type === this.config.eventType) {
              if (this.fromDate === '' || this.toDate === '') {
                dataSet = this.updateDataset(singleEvent, dataSet);
                this.createChart(dataSet);
              } else if (Date.parse(singleEvent.creationTime) > Date.parse(this.fromDate) &&
                Date.parse(singleEvent.creationTime) < Date.parse(this.toDate)) {
                dataSet = this.updateDataset(response.data.data, dataSet);
                this.createChart(dataSet);
              }
            }
          }
        }
      });
    this.realTimeEventSubArray.push(sub);
  }

  /** Fetches the events using Event Service for the given device and particular event type */
  async fetchEvents(deviceId, dataSet) {
    const filter = {
      pageSize: 2000,
      source: deviceId,
      type: this.config.eventType,
    };
    const { data, res, paging } = await this.events.list(filter);
    const promises = data.map((singleRecord) => {
      if (this.fromDate === '' || this.toDate === '') {
        dataSet = this.updateDataset(singleRecord, dataSet);
      } else if (Date.parse(singleRecord.creationTime) > Date.parse(this.fromDate) &&
        Date.parse(singleRecord.creationTime) < Date.parse(this.toDate)) {
        dataSet = this.updateDataset(singleRecord, dataSet);
      }
    });
    await Promise.all(promises);
    return dataSet;
  }
  /** based on the configuration and event record dataset is created  */
  updateDataset(singleRecord, dataSet) {
    if (this.config.filter !== undefined && this.config.filter !== '') {
      if (this.config.groupby === 'days') {
        const date = moment(singleRecord.creationTime).format('YYYY-MM-DD');
        if (dataSet[date] === undefined) {
          dataSet[date] = {};
        }
        dataSet[date][singleRecord[this.config.filter]] =
          dataSet[date][singleRecord[this.config.filter]] + 1 || 1;
      } else if (this.config.groupby === 'hours') {
        const hour = moment(singleRecord.creationTime).format('HH:mm');
        if (dataSet[hour] === undefined) {
          dataSet[hour] = {};
        }
        dataSet[hour][singleRecord[this.config.filter]] =
          dataSet[hour][singleRecord[this.config.filter]] + 1 || 1;
      } else {
        // tslint:disable-next-line: max-line-length
        let recordValue = singleRecord[this.config.groupby];
        if (this.config.groupby.includes('.')) {
          const keyNames = this.config.groupby.split('.');
          recordValue = singleRecord[keyNames[0]][keyNames[1]];
        }
        if (dataSet[recordValue] === undefined) {
          dataSet[recordValue] = {};
        }
        dataSet[recordValue][singleRecord[this.config.filter]] =
          dataSet[recordValue][singleRecord[this.config.filter]] + 1 ||
          1;
      }
    } else {
      if (this.config.groupby === 'days') {
        const date = moment(singleRecord.creationTime).format('YYYY-MM-DD');
        dataSet[date] = dataSet[date] + 1 || 1;
      } else if (this.config.groupby === 'hours') {
        const hour = moment(singleRecord.creationTime).format('HH:mm');
        dataSet[hour] = dataSet[hour] + 1 || 1;
      } else {
        let recordValue = singleRecord[this.config.groupby];
        if (this.config.groupby.includes('.')) {
          const keyNames = this.config.groupby.split('.');
          recordValue = singleRecord[keyNames[0]][keyNames[1]];
        }
        dataSet[recordValue] = dataSet[recordValue] + 1 || 1;
      }
    }
    return dataSet;
  }

  /** Dataset is sorted and passed to barchart dat in required format */
  createChart(dataSet) {
    let sortedArray = [];
    if (this.config.groupby === 'hours') {
      sortedArray = Object.keys(dataSet).sort((a, b) => {
        const regExp = /(\d{1,2})\:(\d{1,2})/;
        if (
          // tslint:disable-next-line: radix
          parseInt(b.replace(regExp, '$1$2')) <
          // tslint:disable-next-line: radix
          parseInt(a.replace(regExp, '$1$2'))
        ) {
          return 1;
        }
        return -1;
      });
    } else if (this.config.groupby === 'days') {
      sortedArray = Object.keys(dataSet).sort((a, b) => {
        return Date.parse(a) - Date.parse(b);
      });
    } else {
      sortedArray = Object.keys(dataSet).sort((a, b) => {
        return dataSet[b] - dataSet[a];
      });
    }

    const dataValues = [];
    const labels = [];
    const dataResult = {};
    this.barChartLabels = [];
    this.barChartData = [];
    if (this.config.filter !== undefined && this.config.filter !== '') {
      // tslint:disable-next-line: forin
      for (const k of sortedArray) {
        Object.keys(dataSet[k]).map((key) => {
          if (dataResult[key] === undefined) {
            dataResult[key] = [];
          }
        });
        this.barChartLabels.push(k);
      }
      // tslint:disable-next-line: forin
      for (const k of sortedArray) {
        Object.keys(dataResult).map((key) => {
          if (dataSet[k][key]) {
            dataResult[key].push(dataSet[k][key]);
          } else {
            dataResult[key].push(0);
          }
        });
      }
      Object.keys(dataResult).map((key) => {
        this.barChartData.push({ data: dataResult[key], label: key });
      });
      if (Object.keys(dataResult).length > 0) {
        this.dataLoaded = Promise.resolve(true);
      }
    } else {
      // tslint:disable-next-line: forin
      for (const k of sortedArray) {
        dataValues.push(dataSet[k]);
        labels.push(k);
      }
      if (dataValues.length > 0) {
        this.barChartLabels = labels;
        this.barChartData = [{ data: dataValues, label: 'Count' }];
        this.dataLoaded = Promise.resolve(true);
      }
    }
    this.setChartColors();
  }
  /** Realtime Service object is unsubscribed */
  ngOnDestroy() {
    if (this.realTimeEventSubArray.length !== 0) {
      this.realTimeEventSubArray.map(sub => {
        this.realtimeService.unsubscribe(sub);
      });
    }
  }
}
