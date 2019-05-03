import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material'
import * as  Highcharts from 'highcharts'
import { } from 'googlemaps';

import app_configuration from '../../assets/app_configuration.json';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {

  @ViewChild("line") line: any
  @ViewChild("charts") charts: any
  @ViewChild('maps') gmapElement: any;
  map: google.maps.Map;

  vote_app

  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    /// initialize application configuration
    this.vote_app = app_configuration
    this.showResult()
  }

  showResult() {
    var line_data = this.vote_app.vote_app.normal_distribution

    Highcharts.chart(this.line.nativeElement,
      {
        chart: {
          type: 'line'
        },
        title: {
          text: ''
        },
        yAxis: {
          title: {
            text: 'probability density'
          }
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: false
            },
            enableMouseTracking: false
          }
        },
        series: [{
          name: 'N~(0.494, 1.672)',
          data: line_data,
          type: undefined
        }]
      })

    Highcharts.chart(this.charts.nativeElement,
      {
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 50,
            beta: 0
          }
        },
        title: {
          text: ''
        },
        legend: {
          enabled: true,
          labelFormatter: function () {
            var legendIndex = this.index;
            var legendName = this.series.chart.axes[0].categories[legendIndex];
            return legendName;
          }
        },
        xAxis: {
          categories: ["Ядене", "Няма значение", "Диско"]
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            size: '47%',
            allowPointSelect: true,
            showInLegend: true,
            cursor: 'pointer',
            depth: 50,
            dataLabels: {
              enabled: true,
              format: '{point.name}'
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'Preference',
          data: [
            ['26%', 26],
            {
              name: '46%',
              y: 46,
              sliced: true,
              selected: true
            },
            ['26%', 26]
          ]
        }]
      })

    var mapProp = {
      center: this.vote_app.vote_app.address,
      zoom: 19
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    var marker = new google.maps.Marker({
      position: this.vote_app.vote_app.address,
      map: this.map,
      title: 'Синият лъв - ул. Иван Вазов 6, 1000 Център, София - '
    });

    var contentString =
      '<div>' +
      '<h3>Синият лъв</h3>' +
      '<h3>ул. Иван Вазов 6, 1000 Център</h3>'
    '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    infowindow.open(this.map, marker);
  }
}
