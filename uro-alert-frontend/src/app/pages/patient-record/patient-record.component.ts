import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {PatientManagementService} from "../../services/patient-management.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import PizZip from 'pizzip';
import {HttpClient} from "@angular/common/http";
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.component.html',
  styleUrls: ['./patient-record.component.css']
})
export class PatientRecordComponent implements OnInit{

  patientRecords: PatientRecord[] = [];
  selectedPatient: any = null;

  @ViewChild('viewPatientModal', { static: false }) viewPatientModal!: TemplateRef<any>;

  constructor(
    private patientService: PatientManagementService,
    private modalService: NgbModal,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadPatientRecords();
  }

  loadPatientRecords(): void {
    this.patientService.getPatientRecords().subscribe(
      (records: any[]) => {
        this.patientRecords = records;
      },
      error => {
        console.error('Error loading patient records:', error);
        alert('Error loading patient records. Check console for details.');
      }
    );
  }

  viewPatient(record: PatientRecord): void {
    // If you want to load full details for a given patient, call getPatientById:
    this.patientService.getPatientById(record.id).subscribe(
      (patientData) => {
        this.selectedPatient = patientData;
        this.modalService.open(this.viewPatientModal, { size: 'lg', centered: true });
      },
      error => {
        console.error('Error loading patient details:', error);
        alert('Error loading patient details. Check console for details.');
      }
    );
  }

  generateReport(patientId: number): void {
    this.patientService.downloadPatientReport(patientId);
  }


}

export interface PatientRecord {
  id: number;
  prediction: string;
  treatment: string;
  // other fields returned from the backend that you may display in the table (if any)
  // You might only show a summary in the table and display full details in the modal.
}
