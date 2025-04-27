import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {PatientManagementService} from "../../services/patient-management.service"; // adjust the import if needed
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('utiSeverityChart') chartRef!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;
  protected totalPatients: number = 0;


  constructor(private patientService: PatientManagementService) {}

  ngAfterViewInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.patientService.getPatientRecords().subscribe(
      (patients) => {
        const uncomplicatedCount = patients.filter((p: any) => p.prediction === 'Uncomplicated UTI').length;
        const complicatedCount = patients.filter((p: any) => p.prediction === 'Complicated UTI').length;
        const totalPatients = patients.length;

        this.createChart(uncomplicatedCount, complicatedCount);
        this.totalPatients = totalPatients;
      },
      (error) => {
        console.error('Error fetching patient data:', error);
      }
    );
  }

  createChart(uncomplicatedCount: number, complicatedCount: number): void {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Uncomplicated', 'Complicated'],
          datasets: [{
            label: 'Number of Cases',
            data: [uncomplicatedCount, complicatedCount],
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
              display: false
            }
          }
        }
      });
    }
  }
}
