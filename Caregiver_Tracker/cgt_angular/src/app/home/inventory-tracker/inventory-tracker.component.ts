import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, Observable, Subscription, take } from 'rxjs';
import { CommonService, inventoryData } from 'src/app/shared/common.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
import { InventoryTrackerService } from './inventory-tracker.service';
import { careTakenDetail } from 'src/app/store/care-taken-details/care-taken-details.model';
import { select, Store } from '@ngrx/store';
import * as selectors from 'src/app/store/care-taken-details/care-taken-details.selector';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-inventory-tracker',
  templateUrl: './inventory-tracker.component.html',
  providers: [InventoryTrackerService, CommonService],
  styleUrls: ['./inventory-tracker.component.css'],
  standalone: false,
})
export class InventoryTrackerComponent implements OnInit {
  careTakenName: string;
  careGiver: string;
  subscription: Subscription;
  inventories: Record<string, inventoryData[]>;
  inventoryTypes: string[] = ['Diaper', 'Wet Wipes', 'Medicine'];
  inventoryForms: string[] = ['Drops', 'Syrup', 'Pill', 'Tablet'];
  chosenInventoryType = '';
  chosenInventoryForm = '';
  enteredInventoryBrand = '';
  enteredInventoryCount = 0;
  enteredInventoryEachContains = 0;
  selectedCareTaken$: Observable<careTakenDetail[]>;
  selCareTaken: careTakenDetail;
  showSpinner = false;

  constructor(
    private modal: NgbModal,
    private commonService: CommonService,
    private itService: InventoryTrackerService,
    private toastService: ToastService,
    private store: Store<{ caretakendetails: careTakenDetail[] }>,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.isUserLoggedIn().subscribe({
      next: () => {
        this.showSpinner = true;
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
          this.getInventories();
        });
      }, error: () => {
        this.router.navigate(['login'], { state: { sessionExpired: true } });
      },
    });
  }

  getInventories() {
    this.itService
      .getInventoryDetails(this.selCareTaken._id, 10)
      .subscribe((inventoryDetailsResponse) => {
        this.inventories = inventoryDetailsResponse;
      });
  }

  addInventory(add_inventory_modal: TemplateRef<null>): void {
    this.modal.open(add_inventory_modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'md',
    });
  }

  saveInventory() {
    this.itService
      .addToInventory(
        this.selCareTaken,
        this.chosenInventoryType,
        this.chosenInventoryForm,
        this.enteredInventoryBrand,
        this.enteredInventoryCount,
        this.enteredInventoryEachContains
      )
      .subscribe({
        next: (response: HttpResponse<{ message: string }>) => {
          this.toastService.show(
            'Add Inventory',
            response.body.message,
            'bg-success text-light',
            true
          );
          this.modal.dismissAll();
          this.getInventories();
        },
        error: (response: HttpResponse<{ message: string }>) => {
          this.toastService.show(
            'Add Inventory',
            response.body.message,
            'bg-danger text-light',
            true
          );
          this.modal.dismissAll();
        },
      });
  }

  cancelSaveInventory() {
    this.modal.dismissAll();
  }
}
