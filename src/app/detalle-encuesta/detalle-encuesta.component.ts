import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SendHttpData } from '../services/SendHttpData';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-detalle-encuesta',
  templateUrl: './detalle-encuesta.component.html',
  styleUrls: ['./detalle-encuesta.component.css']
})
export class DetalleEncuestaComponent implements OnInit {

  id_encuesta : any;
  preguntas : any = [];
  // Doughnut
  public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: MultiDataSet = [
    [45, 100],
  ];
  public doughnutChartType: ChartType = 'doughnut';

  // Bar
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];
  constructor( private activatedRoute: ActivatedRoute, private http : SendHttpData ) {
    this.id_encuesta = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getPreguntas();
  }

  getPreguntas(){
    this.http.httpGet('encuestas/' + this.id_encuesta, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.preguntas = response.preguntas;
        }
      }, 
      error => {
        
      }
    )
  }
  
  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  
}
