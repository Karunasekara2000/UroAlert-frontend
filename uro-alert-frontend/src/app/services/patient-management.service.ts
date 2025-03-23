import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PatientManagementService {

  private modelUrl = 'http://localhost:8000/predict_uti_treatment';
  private baseUrl = 'http://localhost:8080/patient/';


  constructor(private http: HttpClient) { }

  predictUTITreatment(payload: any): Observable<any> {
    return this.http.post(this.modelUrl, payload);
  }

  savePatient(payload: any): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.baseUrl , payload,{headers});
  }

  // 1. Get all patient records
  getPatientRecords(): Observable<any[]> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.baseUrl + "search" , { headers });
  }

  // 2. Get a patient by ID
  getPatientById(id: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.baseUrl+ "search/" + id, { headers });
  }


  downloadPatientReport(patientId: number): void {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(this.baseUrl+"patient-report/" + patientId, {
      headers: headers,
      responseType: 'blob'
    })
      .subscribe(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `PatientReport_${patientId}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, error => {
        console.error('Download error:', error);
        alert('Failed to download the report.');
      });
  }
}
