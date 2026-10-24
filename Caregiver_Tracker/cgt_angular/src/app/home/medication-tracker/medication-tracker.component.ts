import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, Observable, Subscription, take } from 'rxjs';
import {
  CommonService,
  inventoryData,
} from 'src/app/shared/common.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { MedicationTrackerService } from './medication-tracker.service';
import { careTakenDetail } from 'src/app/store/care-taken-details/care-taken-details.model';
import { select, Store } from '@ngrx/store';
// const moment = require('moment');
import * as selectors from 'src/app/store/care-taken-details/care-taken-details.selector';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { HttpResponse } from '@angular/common/http';
import { MedicationGroupedBydate, trackedMedicationData } from './medication-tracker.model';

@Component({
  selector: 'app-medication-tracker',
  templateUrl: './medication-tracker.component.html',
  providers: [MedicationTrackerService, CommonService],
  styleUrls: ['./medication-tracker.component.css'],
  standalone: false,
})
export class MedicationTrackerComponent implements OnInit {
  careTakenName: string;
  careGiver: string;
  subscription: Subscription;
  trackedMedications: { date: string; items: trackedMedicationData[] }[];
  medicineNames: inventoryData[];
  chosenMedicineName: string;
  medicineForm: string;
  disableSaving: boolean;
  medicineQuantity = 0;
  deleteMedId: string;
  editTrackedMedData: trackedMedicationData;
  selectedCareTaken$: Observable<careTakenDetail[]>;
  selCareTaken: careTakenDetail;
  showSpinner = false;

  constructor(
    private modal: NgbModal,
    private toastService: ToastService,
    private mtService: MedicationTrackerService,
    private commonService: CommonService,
    private store: Store<{ caretakendetails: careTakenDetail[] }>,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.store.pipe(
      select(selectors.selectCareTakenDetail),
      filter(data => !!data),
      take(1)
    ).subscribe((activeCtd) => {
      if (!activeCtd) {
        this.router.navigate(['']);
        return;
      }
      this.selCareTaken = activeCtd;
      this.getTrackedMedications();
    });
  }

  getTrackedMedications() {
    this.subscription = this.mtService
      .getMedicationDetails(this.selCareTaken._id, 10)
      .subscribe((medicationDetailsResponse: MedicationGroupedBydate) => {
        const medicationDetails = Object.entries(medicationDetailsResponse).map(([date, items]) => ({
          date,
          items
        }));
        this.trackedMedications = medicationDetails;
      });
    this.commonService
      .getAvailableInventory(this.selCareTaken._id, 'Medicine')
      .subscribe((availableMedsResp) => {
        this.medicineNames = availableMedsResp;
      });
  }

  addMedication(add_medication_modal: TemplateRef<null>): void {
    this.modal.open(add_medication_modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'md',
    });
  }

  medicineChosen() {
    this.mtService.getMedicineForm(this.chosenMedicineName).subscribe({
      next: (response: string) => {
        this.medicineForm = response;
      },
    });
  }

  saveTrackingMedication() {
    this.mtService
      .saveTrackedMedication(
        this.careGiver,
        this.selCareTaken,
        this.chosenMedicineName,
        this.medicineQuantity
      )
      .subscribe({
        next: (response: HttpResponse<{ message: string }>) => {
          this.toastService.show(
            'Add Tracked Medication',
            response.body.message,
            'bg-success text-light',
            true
          );
          this.modal.dismissAll();
          this.getTrackedMedications();
        },
        error: (response: HttpResponse<{ message: string }>) => {
          this.toastService.show(
            'Add Tracked Medication',
            response.body.message,
            'bg-danger text-light',
            true
          );
          this.modal.dismissAll();
        },
      });
  }

  cancelTrackingMedication() {
    this.modal.dismissAll();
  }

  editTrackedMedModal(edit_med_modal: TemplateRef<null>, medId: string) {
    this.modal.open(edit_med_modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
    this.mtService.getMedForId(medId).subscribe({
      next: (medData: trackedMedicationData) => {
        this.editTrackedMedData = medData;
      },
      error: () => {
        this.toastService.show(
          'Edit Tracked Medication',
          'Unable to fetch medication data. Please try again!',
          'bg-error text-light',
          true
        );
      },
    });
  }

  cancelEditTrackedMed() {
    this.modal.dismissAll();
  }

  deleteTrackedMedModal(delete_med_modal: TemplateRef<null>, medId: string) {
    this.modal.open(delete_med_modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'md',
    });
    this.deleteMedId = medId;
  }

  cancelDeleteTrackedMed() {
    this.modal.dismissAll();
  }

  editTrackedMed(editedData: trackedMedicationData) {
    const medDateString =
      editedData.medicationDate['day'] +
      '/' +
      editedData.medicationDate['month'] +
      '/' +
      editedData.medicationDate['year'] +
      ' ' +
      editedData.medicationTime['hour'] +
      ':' +
      editedData.medicationTime['minute'] +
      ':' +
      editedData.medicationTime['second'];
    // const medDate = moment(medDateString, 'DD/MM/YYYY HH:mm:ss').format(
    //   'DD/MM/YYYY HH:mm:ss'
    // );
    this.mtService.saveEditedTrackedMed(editedData.id, medDateString).subscribe({
      next: (response: HttpResponse<{ message: string }>) => {
        this.toastService.show(
          'Edit Tracked Medication',
          response.body.message,
          'bg-success text-light',
          true
        );
        this.modal.dismissAll();
        this.getTrackedMedications();
      },
      error: (response: HttpResponse<{ message: string }>) => {
        this.toastService.show(
          'Edit Tracked Medication',
          response.body.message,
          'bg-danger text-light',
          true
        );
        this.modal.dismissAll();
      },
    });
  }

  deleteTrackedMed(medId: string) {
    this.mtService.deleteMed(medId).subscribe({
      next: (response: { message: string }) => {
        this.toastService.show(
          'Delete Tracked Medication',
          response.message,
          'bg-success text-light',
          true
        );
        this.modal.dismissAll();
        this.getTrackedMedications();
      },
      error: (response: { message: string }) => {
        this.toastService.show(
          'Delete Tracked Medication',
          response.message,
          'bg-error text-light',
          true
        );
        this.modal.dismissAll();
      },
    });
  }
}
