import { ChangeDetectionStrategy, Component, inject, OnInit, signal, TemplateRef, WritableSignal } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, catchError, map, tap } from 'rxjs';
import {
  addCareTakenPerson,
  addCareTakenPersonSuccess,
  getCareTaken,
  changeCareTakenPerson,
  changeCareTakenPersonSuccess,
} from 'src/app/store/care-taken-details/care-taken-details.actions';
import { careTakenDetail } from 'src/app/store/care-taken-details/care-taken-details.model';
import * as selectors from 'src/app/store/care-taken-details/care-taken-details.selector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-care-taken-details',
  templateUrl: './care-taken-details.component.html',
  styleUrls: ['./care-taken-details.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareTakenDetailsComponent implements OnInit {
  private ctdService = inject(NgbOffcanvas);
  closeResult: WritableSignal<string> = signal('');
  careTakenOf: string;
  careTakenName: string;
  careTakenDOB: { year: number; month: number; day: number };
  careTakenGender: string;
  careGiver: string;
  careTakenDetails$: Observable<careTakenDetail[]>;
  roles: string[] = [
    'infant',
    'toddler',
    'child',
    'spouse',
    'parent',
    'friend',
  ];
  selectedCareTaken$: Observable<careTakenDetail>;
  constructor(
    private modal: NgbModal,
    private store: Store<{ caretakendetails: careTakenDetail[] }>,
    private actions$: Actions,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadLatestCareTaken();
  }

  loadLatestCareTaken(): void {
    this.store.dispatch(
      getCareTaken()
    );
    this.careTakenDetails$ = this.store.pipe(
      select(selectors.selectCareTakenDetails),
      tap(activeCtd => {
        if (!activeCtd) {
          this.router.navigate(['cgt/home']);
        }
      }),
      map(activeCtd => activeCtd),
      catchError((error) => {
        console.error('Error fetching care taken details:', error);
        this.router.navigate(['login']);
        return [];
      })
    );
  }

  open(content: TemplateRef<null>) {
    this.ctdService.open(content, {
      position: 'end'
    }).result.then(() => this.closeResult.set('Closed'))
  }

  addCareTakenPerson(add_care_taken_person_modal: TemplateRef<null>): void {
    this.modal.open(add_care_taken_person_modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
  }

  addCareTakenOf(): void {
    const ctDob: Date = new Date(
      this.careTakenDOB.year,
      this.careTakenDOB.month - 1,
      this.careTakenDOB.day
    );
    this.store.dispatch(
      addCareTakenPerson({
        addcaretakendetails: {
          care_giver: this.careGiver,
          care_taken_of: this.careTakenOf,
          care_taken_name: this.careTakenName,
          care_taken_dob: ctDob,
          care_taken_gender: this.careTakenGender,
        },
      })
    );
    this.actions$.pipe(ofType(addCareTakenPersonSuccess)).subscribe({
      next: () => this.loadLatestCareTaken(),
    });
  }

  changeCareTaken(care_taken_id: string, care_giver: string): void {
    this.store.dispatch(
      changeCareTakenPerson({
        changecaretakenid: care_taken_id,
        changecaregiver: care_giver,
      })
    );
    this.actions$.pipe(ofType(changeCareTakenPersonSuccess)).subscribe({
      next: () => this.loadLatestCareTaken(),
    });
  }

  closeModalLogOut(): void {
    this.modal.dismissAll();
  }
}
