import {Component, TemplateRef, ViewChild} from '@angular/core';
import {PatientManagementService} from "../../services/patient-management.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-patient-management',
  templateUrl: './patient-management.component.html',
  styleUrls: ['./patient-management.component.css']
})
export class PatientManagementComponent {

// Model for Urinalysis data
  urinalysis: UrinalysisData = {
    Age: null,
    Color: null,
    Transparency: null,
    Glucose: null,
    Protein: null,
    pH: null,
    'Specific Gravity': null,
    WBC: null,
    RBC: null,
    'Epithelial Cells': null,
    'Mucous Threads': null,
    'Amorphous Urates': null,
    Bacteria: null,
    FEMALE: 0
  };

  // Model for Other data; demoAge will be set from urinalysis.Age
  other: OtherData = {
    demoAge: 0,
    isWhite: false,
    isVeteran: false,
    resistanceNIT14: false,
    resistanceSXT14: false,
    resistanceLVX14: false,
    resistanceCIP14: false,
    DM: false,
    HTN: false,
    CHF: false,
    Pulmonary: false,
    Renal: false,
    Obesity: false,
    Tumor: false,
    Liver: false,
    Coagulopathy: false,
    NeuroOther: false,
    nursingHome: false,
    ER: false,
    ICU: false,
    IP: false,
    OP: false,
    colonizationPressureNIT90O: 0,
    colonizationPressureSXT90: 0,
    colonizationPressureLVX90: 0,
    colonizationPressureCIP90: 0
  };

  // Reference maps for dropdowns
  absenceReference: { [key: string]: number } = {
    'NONE SEEN': 0,
    'RARE': 1,
    'FEW': 2,
    'OCCASIONAL': 3,
    'MODERATE': 4,
    'LOADED': 5,
    'PLENTY': 6
  };

  colorMap: { [key: string]: number } = {
    'LIGHT YELLOW': 0,
    'STRAW': 1,
    'AMBER': 2,
    'BROWN': 3,
    'DARK YELLOW': 4,
    'YELLOW': 5,
    'REDDISH YELLOW': 6,
    'REDDISH': 7,
    'LIGHT RED': 8,
    'RED': 9
  };

  transparencyMap: { [key: string]: number } = {
    'CLEAR': 0,
    'SLIGHTLY HAZY': 1,
    'HAZY': 2,
    'CLOUDY': 3,
    'TURBID': 4
  };

  proteinGlucoseMap: { [key: string]: number } = {
    'NEGATIVE': 0,
    'TRACE': 1,
    '1+': 2,
    '2+': 3,
    '3+': 4,
    '4+': 5
  };

  // This will hold the API response to be shown in the modal
  resultResponse: any;

  // Use ViewChild to get a reference to the modal template
  @ViewChild('resultModal', { static: false }) resultModal!: TemplateRef<any>;

  constructor(private patientService : PatientManagementService ,
              private modalService: NgbModal) {}

  // Helper getter to use in the template for iterating over object keys
  get objectKeys() {
    return Object.keys;
  }

  onSubmit() {
    // Bind demoAge in Other data to the Age from Urinalysis
    this.other.demoAge = this.urinalysis.Age ? this.urinalysis.Age : 0;

    // Process the 'other' data: convert booleans to numbers (0 or 1) for non-numeric fields
    const otherProcessed: { [key: string]: number } = {};
    Object.keys(this.other).forEach((key: string) => {
      // For numeric fields (demoAge and colonization pressures), just copy the number
      if (
        key === 'demoAge' ||
        key === 'colonizationPressureNIT90O' ||
        key === 'colonizationPressureSXT90' ||
        key === 'colonizationPressureLVX90' ||
        key === 'colonizationPressureCIP90'
      ) {
        otherProcessed[key] = this.other[key as keyof OtherData] as number;
      } else {
        // For boolean fields, convert to 0 or 1
        otherProcessed[key] = this.other[key as keyof OtherData] ? 1 : 0;
      }
    });

    const payload = {
      urinalysis: this.urinalysis,
      other: otherProcessed
    };

    console.log('Final Payload:', payload);
    //alert('Patient data submitted. Check console for payload.');


    // Call the service method
    this.patientService.predictUTITreatment(payload).subscribe(
      (response) => {
        console.log('API Response:', response);
        //alert('Response from API: ' + JSON.stringify(response));
        //console.log('API Response:', response);
        const mergedPayload = {
            ...payload.urinalysis,
            ...payload.other,
            prediction: response.prediction,
            treatment: response.treatment,
            doctor_recommendations: Array.isArray(response.doctor_recommendations)
              ? response.doctor_recommendations.join(', ')
              : response.doctor_recommendations
      }
        console.log('Merged Payload:', mergedPayload);

        // Now call the save patient API
        this.patientService.savePatient(mergedPayload).subscribe(
          (saveResponse) => {
            console.log('Patient Saved Response:', saveResponse);
            // Optionally, set resultResponse to mergedPayload or saveResponse if needed for modal
            this.resultResponse = mergedPayload;
            this.openResultModal();
          },
          (error) => {
            console.error('Error saving patient:', error);
            alert('Error saving patient details. Check console for details.');
          });
      },

      (error) => {
        console.error('Error calling API:', error);
        alert('Error calling API. Check console for details.');
      }
    );
  }

  onCheckSeverity() {
    console.log('Checking severity with data:', {
      urinalysis: this.urinalysis,
      other: this.other
    });
    //alert('Severity check triggered (placeholder)');
  }

  openResultModal() {
    this.modalService.open(this.resultModal, { size: 'lg', centered: true });
  }


}


export interface UrinalysisData {
  Age: number | null;
  Color: number | null;
  Transparency: number | null;
  Glucose: number | null;
  Protein: number | null;
  pH: number | null;
  'Specific Gravity': number | null;
  WBC: number | null;
  RBC: number | null;
  'Epithelial Cells': number | null;
  'Mucous Threads': number | null;
  'Amorphous Urates': number | null;
  Bacteria: number | null;
  FEMALE: number; // 0 or 1
}

export interface OtherData {
  demoAge: number; // This will be set from urinalysis.Age
  isWhite: boolean;
  isVeteran: boolean;
  resistanceNIT14: boolean;
  resistanceSXT14: boolean;
  resistanceLVX14: boolean;
  resistanceCIP14: boolean;
  DM: boolean;
  HTN: boolean;
  CHF: boolean;
  Pulmonary: boolean;
  Renal: boolean;
  Obesity: boolean;
  Tumor: boolean;
  Liver: boolean;
  Coagulopathy: boolean;
  NeuroOther: boolean;
  nursingHome: boolean;
  ER: boolean;
  ICU: boolean;
  IP: boolean;
  OP: boolean;
  colonizationPressureNIT90O: number;
  colonizationPressureSXT90: number;
  colonizationPressureLVX90: number;
  colonizationPressureCIP90: number;
}
