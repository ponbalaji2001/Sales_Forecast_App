import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import  html2canvas  from 'html2canvas';
import { ChartDataService } from '../services/chartDataService.service';

@Component({
  selector: 'app-mychart',
  templateUrl: './mychart.component.html',
  styleUrls: ['./mychart.component.css'],
})

export class MychartComponent implements OnInit {
  constructor(
    private chartDataServ: ChartDataService
  ) {}

  @ViewChild('content', { static: false }) el!: ElementRef;

  public chartData: any;
  public chartData2: any;
  public chartLabels: any;
  public chartLabels2: any;
  public chartOptions2: any;
  public chartOptions: any;

  dateArray = [];
  predictArray = [];
  forecastUpArray = [];
  forecastDownArray = [];
  actualArray = [];
  horizonArray = [];
  rmseArray = [];
  mseArray = [];
  maeArray = [];
  forecastArray = [];

  ngOnInit(): void {
    
    //Get the data from the Chart Service and convert it to an array.
    this.dateArray = String(this.chartDataServ._date).split(/,(?= \d{2} )/);
    this.predictArray = String(this.chartDataServ.predict).split(',');
    this.forecastArray = String(this.chartDataServ.forecastVal).split(',');
    this.forecastUpArray = String(this.chartDataServ.forecastUp).split(',');
    this.forecastDownArray = String(this.chartDataServ.forecastDown).split(',');
    this.actualArray = String(this.chartDataServ.actual).split(',');
    this.horizonArray = String(this.chartDataServ.horizon).split(',');
    this.rmseArray = String(this.chartDataServ.rmse).split(',');
    this.mseArray = String(this.chartDataServ.mse).split(',');
    this.maeArray = String(this.chartDataServ.mae).split(',');

    console.log(this.forecastArray);

    //chart
    this.chartData = [
      {
        data: this.actualArray,
        label: 'Actual',
        fill: false,
      },
      {
        data: this.predictArray,
        label: 'Predicted',
        fill: false,
      },
      {
        data: this.forecastUpArray,
        pointRadius: 0,
        label: 'Upper Confidence',
        fill: false,
      },
      {
        data: this.forecastDownArray,
        pointRadius: 0,
        label: 'Lower Confidence',
        fill: false,
      },
      {
        data: this.forecastArray,
        label: 'Forecast',
        fill: false,
      },
    ];

    this.chartLabels = this.dateArray;
    this.chartOptions = {
      responsive: true,
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time period',
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Sales',
            },
          },
        ],
      },
    };

    this.chartData2 = [
      {
        data: this.rmseArray,
        label: 'rmse',
        fill: false,
      },
      {
        data: this.mseArray,
        label: 'mse',
        fill: false,
      },
      {
        data: this.maeArray,
        label: 'mae',
        fill: false,
      },
    ];

    this.chartLabels2 = this.horizonArray;
    this.chartOptions2 = {
      responsive: true,
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Horizon',
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'RMSE, MSE, MAE',
            },
          },
        ],
      },
    };
  }
  
  //download report
  makePDF() {
    html2canvas(document.getElementById('content')!).then((canvas) => {
      const contentURL = canvas.toDataURL('http://localhost:4200/chart');
      let pdf = new jsPDF('p', 'mm', 'a4');
      var width = pdf.internal.pageSize.getWidth();
      var height = (canvas.height * width) / canvas.width;
      pdf.addImage(contentURL, 'PNG', 0, 39, width, height);
      pdf.save('ForecastReport.pdf');
    });
  }
}
