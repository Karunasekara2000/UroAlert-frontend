import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PatientManagementService {

  private modelUrl = 'http://localhost:8000/predict_uti_treatment';
  private baseUrl = 'http://localhost:8080/';


  constructor(private http: HttpClient) { }

  predictUTITreatment(payload: any): Observable<any> {
    return this.http.post(this.modelUrl, payload);
  }

  savePatient(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + "patient", payload);
  }
}
