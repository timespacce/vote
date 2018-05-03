import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material'
import * as  Highcharts from 'highcharts'
import { } from '@types/googlemaps';

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

  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.showResult()
  }

  showResult() {
    var line_data = [{x:-2.38473515, y:0.00470114, name:"0"},
    {x:-2.32760071, y:0.00562818, name:"1"},
    {x:-2.27046627, y:0.00671333, name:"2"},
    {x:-2.21333184, y:0.00797834, name:"3"},
    {x:-2.15619740, y:0.00944696, name:"4"},
    {x:-2.09906296, y:0.01114490, name:"5"},
    {x:-2.04192853, y:0.01309981, name:"6"},
    {x:-1.98479409, y:0.01534119, name:"7"},
    {x:-1.92765965, y:0.01790018, name:"8"},
    {x:-1.87052522, y:0.02080946, name:"9"},
    {x:-1.81339078, y:0.02410289, name:"0"},
    {x:-1.75625634, y:0.02781519, name:"1"},
    {x:-1.69912191, y:0.03198158, name:"2"},
    {x:-1.64198747, y:0.03663721, name:"3"},
    {x:-1.58485303, y:0.04181670, name:"4"},
    {x:-1.52771860, y:0.04755344, name:"5"},
    {x:-1.47058416, y:0.05387893, name:"6"},
    {x:-1.41344972, y:0.06082200, name:"7"},
    {x:-1.35631529, y:0.06840805, name:"8"},
    {x:-1.29918085, y:0.07665819, name:"9"},
    {x:-1.24204641, y:0.08558836, name:"0"},
    {x:-1.18491198, y:0.09520849, name:"1"},
    {x:-1.12777754, y:0.10552161, name:"2"},
    {x:-1.07064310, y:0.11652307, name:"3"},
    {x:-1.01350867, y:0.12819977, name:"4"},
    {x:-0.95637423, y:0.14052945, name:"5"},
    {x:-0.89923979, y:0.15348017, name:"6"},
    {x:-0.84210535, y:0.16700981, name:"7"},
    {x:-0.78497092, y:0.18106582, name:"8"},
    {x:-0.72783648, y:0.19558511, name:"9"},
    {x:-0.67070204, y:0.21049408, name:"0"},
    {x:-0.61356761, y:0.22570894, name:"1"},
    {x:-0.55643317, y:0.24113622, name:"2"},
    {x:-0.49929873, y:0.25667344, name:"3"},
    {x:-0.44216430, y:0.27221008, name:"4"},
    {x:-0.38502986, y:0.28762874, name:"5"},
    {x:-0.32789542, y:0.30280646, name:"6"},
    {x:-0.27076099, y:0.31761632, name:"7"},
    {x:-0.21362655, y:0.33192905, name:"8"},
    {x:-0.15649211, y:0.34561494, name:"9"},
    {x:-0.09935768, y:0.35854573, name:"0"},
    {x:-0.04222324, y:0.37059657, name:"1"},
    {x: 0.01491120, y:0.38164804, name:"2"},
    {x: 0.07204563, y:0.39158809, name:"3"},
    {x: 0.12918007, y:0.40031393, name:"4"},
    {x: 0.18631451, y:0.40773381, name:"5"},
    {x: 0.24344894, y:0.41376861, name:"6"},
    {x: 0.30058338, y:0.41835326, name:"7"},
    {x: 0.35771782, y:0.42143788, name:"8"},
    {x: 0.41485225, y:0.42298870, name:"9"},
    {x: 0.47198669, y:0.42298870, name:"0"},
    {x: 0.52912113, y:0.42143788, name:"1"},
    {x: 0.58625556, y:0.41835326, name:"2"},
    {x: 0.64339000, y:0.41376861, name:"3"},
    {x: 0.70052444, y:0.40773381, name:"4"},
    {x: 0.75765887, y:0.40031393, name:"5"},
    {x: 0.81479331, y:0.39158809, name:"6"},
    {x: 0.87192775, y:0.38164804, name:"7"},
    {x: 0.92906219, y:0.37059657, name:"8"},
    {x: 0.98619662, y:0.35854573, name:"9"},
    {x: 1.04333106, y:0.34561494, name:"0"},
    {x: 1.10046550, y:0.33192905, name:"1"},
    {x: 1.15759993, y:0.31761632, name:"2"},
    {x: 1.21473437, y:0.30280646, name:"3"},
    {x: 1.27186881, y:0.28762874, name:"4"},
    {x: 1.32900324, y:0.27221008, name:"5"},
    {x: 1.38613768, y:0.25667344, name:"6"},
    {x: 1.44327212, y:0.24113622, name:"7"},
    {x: 1.50040655, y:0.22570894, name:"8"},
    {x: 1.55754099, y:0.21049408, name:"9"},
    {x: 1.61467543, y:0.19558511, name:"0"},
    {x: 1.67180986, y:0.18106582, name:"1"},
    {x: 1.72894430, y:0.16700981, name:"2"},
    {x: 1.78607874, y:0.15348017, name:"3"},
    {x: 1.84321317, y:0.14052945, name:"4"},
    {x: 1.90034761, y:0.12819977, name:"5"},
    {x: 1.95748205, y:0.11652307, name:"6"},
    {x: 2.01461648, y:0.10552161, name:"7"},
    {x: 2.07175092, y:0.09520849, name:"8"},
    {x: 2.12888536, y:0.08558836, name:"9"},
    {x: 2.18601979, y:0.07665819, name:"0"},
    {x: 2.24315423, y:0.06840805, name:"1"},
    {x: 2.30028867, y:0.06082200, name:"2"},
    {x: 2.35742310, y:0.05387893, name:"3"},
    {x: 2.41455754, y:0.04755344, name:"4"},
    {x: 2.47169198, y:0.04181670, name:"5"},
    {x: 2.52882642, y:0.03663721, name:"6"},
    {x: 2.58596085, y:0.03198158, name:"7"},
    {x: 2.64309529, y:0.02781519, name:"8"},
    {x: 2.70022973, y:0.02410289, name:"9"},
    {x: 2.75736416, y:0.02080946, name:"0"},
    {x: 2.81449860, y:0.01790018, name:"1"},
    {x: 2.87163304, y:0.01534119, name:"2"},
    {x: 2.92876747, y:0.01309981, name:"3"},
    {x: 2.98590191, y:0.01114490, name:"4"},
    {x: 3.04303635, y:0.00944696, name:"5"},
    {x: 3.10017078, y:0.00797834, name:"6"},
    {x: 3.15730522, y:0.00671333, name:"7"},
    {x: 3.21443966, y:0.00562818, name:"8"},
    {x: 3.27157409, y:0.00470114, name:"9"}]


    Highcharts.chart(this.line.nativeElement,
        { 
            chart: {
                type: 'line'
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
                name: 'N~(0.443, 0.942)',
                data: line_data
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
            labelFormatter: function() {
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
                  ['37.2%', 37.2],
                  {
                    name: '42.8%',
                    y: 42.8,
                    sliced: true,
                    selected: true
                  },
                  ['20.0%', 20.0]
              ]
          }]
        })

    var mapProp = {
        center: {lat: 42.69074568, lng: 23.33193397},
        zoom: 15
      };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    var marker = new google.maps.Marker({
        position: {lat: 42.69074568, lng: 23.33193397},
        map: this.map,
        title: 'Mr.Pizza 19:45'
      });

    var contentString =
      '<div>'+
        '<h3>Mr.Pizza бул. Васил Левски 53</h3>' +
        '<h3>след  19.30 можете да заповядате</h3>' +
      '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    infowindow.open(this.map, marker);
  }
}
