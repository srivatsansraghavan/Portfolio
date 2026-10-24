import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ctdActions from './care-taken-details.actions';
import {
  switchMap,
  map,
  tap,
  of,
  catchError,
} from 'rxjs';
import { careTakenDetail } from './care-taken-details.model';
import { CareTakenDetailsService } from './care-taken-details.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CareTakenDetailsEffects {

  addCareTakenDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ctdActions.addCareTakenPerson),
      switchMap((action) =>
        this.careTakenDetailService
          .addCareTakenPerson(action.addcaretakendetails)
          .pipe(
            map((response) =>
              ctdActions.addCareTakenPersonSuccess({
                getcaretakendetails: response,
              })
            ),
            tap(() => this.modal.dismissAll()),
            catchError((error) =>
              of(ctdActions.addCareTakenPersonFailure({ error }))
            )
          )
      )
    )
  );

  getCareTakenDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ctdActions.getCareTaken),
      switchMap(() =>
        this.careTakenDetailService.getCareTakenDetails().pipe(
          map((response: careTakenDetail[]) =>
            ctdActions.getCareTakenSuccess({
              caretakendetails: response,
            })
          ),
          tap(() => this.modal.dismissAll()),
          catchError((error) =>
            of(ctdActions.getCareTakenFailure({ error }))
          )
        )
      )
    )
  );

  changeCareTakenDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ctdActions.changeCareTakenPerson),
      switchMap((action) =>
        this.careTakenDetailService
          .changeCareTakenPerson(
            action.changecaretakenid,
          )
          .pipe(
            map((response) =>
              ctdActions.changeCareTakenPersonSuccess({
                changedcaretakendetails: response,
              })
            ),
            catchError((error) =>
              of(ctdActions.changeCareTakenPersonFailure({ error }))
            )
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private careTakenDetailService: CareTakenDetailsService,
    private modal: NgbModal
  ) { }
}
