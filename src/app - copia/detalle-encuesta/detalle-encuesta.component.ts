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
  porcentaje_usuarios = 0;
  // Doughnut
  public doughnutChartLabels: Label[] = ['% Usuarios que diligenciaron.', '% Usuarios que no diligenciaron'];
  public doughnutChartData: MultiDataSet = [[0,100]];
  public doughnutChartType: ChartType = 'doughnut';

  // Diagrama de barras.
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
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];

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
          this.doughnutChartData = [[response.porcentaje_diligenciados, 100]];
          this.porcentaje_usuarios = response.porcentaje_diligenciados;
          this.preguntas = response.preguntas;
          var labels = [];
          var data_temp = { one : [], two : [], three : [], for : [], five : [] };

          response.preguntas.forEach((pregunta, index) => {
            // Definir los labels.
            labels.push('Pregunta ' + (index + 1));
            // Recorrer los promedios y ordenarlos por estrellas.
            pregunta.promedio_respuestas.forEach(respuesta => {
              if(respuesta.respuesta == 1){
                data_temp.one.push(respuesta.promedio);
              }else if(respuesta.respuesta == 2){
                data_temp.two.push(respuesta.promedio);
              }else if(respuesta.respuesta == 3){
                data_temp.three.push(respuesta.promedio);
              }else if(respuesta.respuesta == 4){
                data_temp.for.push(respuesta.promedio);
              }else if(respuesta.respuesta == 5){
                data_temp.five.push(respuesta.promedio);
              }
            });
          });
          // Ordenar la data segun la estadisitica.
          var data_charbar = [
            { data: data_temp.one, label: '1 Estrella' },
            { data: data_temp.two, label: '2 Estrella' },
            { data: data_temp.three, label: '3 Estrella' },
            { data: data_temp.for, label: '4 Estrella' },
            { data: data_temp.five, label: '5 Estrella' }
          ];
          this.barChartLabels = labels;
          this.barChartData = data_charbar;
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
