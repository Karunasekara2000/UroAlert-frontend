import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('utiSeverityChart') chartRef!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;

  ngAfterViewInit(): void {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Uncomplicated', 'Complicated'],
          datasets: [{
            label: 'Number of Cases',
            data: [12, 8], // Dummy data for demonstration
            backgroundColor: ['#4e73df', '#e74a3b']
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Case Count'
              }
            },
            x: {
              title: {
                display: true,
                text: 'UTI Severity'
              }
            }
          },
          plugins: {
            legend: {
              display: false  // Hide legend if not needed
            }
          }
        }
      });
    }
  }
}
