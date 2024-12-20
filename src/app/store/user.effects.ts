import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { loadUserProfile, loadUserProfileFailure, loadUserProfileSuccess, updateProfilePicture, updateProfilePictureFailure, updateProfilePictureSuccess, updateUserProfile, updateUserProfileFailure, updateUserProfileSuccess } from "./user.action";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { UserService } from "../services/user.service";
import { HttpClient } from "@angular/common/http";



interface IUpdateProfilePictureResponse{
    imagePath: string,
    message: string
  }
  

@Injectable()

export class UserEffects {


  constructor(private action$: Actions,
    private userservice: UserService,
    private route: Router,
    private _http:HttpClient
  ) {

  }


  loadUserProfile$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadUserProfile),
      mergeMap(() => this.userservice.getUserProfile().pipe(
        map(user => {
          console.log("User fetched in effect:", user);
          return loadUserProfileSuccess({ user });
        }),
        catchError(error => {
          console.error("Error fetching user profile:", error);
          return of(loadUserProfileFailure({ error }));
        })
      ))
    )
  );

  updateUserProfile$ = createEffect(() =>
    this.action$.pipe(
      ofType(updateUserProfile),
      mergeMap(action =>
        this.userservice.updatedData(action.user).pipe(
          map(user => updateUserProfileSuccess({ user })),
          catchError(error => {
            console.error("Update failed", error); // Log the error
            return of(updateUserProfileFailure({ error }));
          })
        )
      )
    )
  );

  updateProfilePicture$ = createEffect(() =>
    this.action$.pipe(
      ofType(updateProfilePicture),
      switchMap((action) => {
        const { s3FileUrl } = action;

        return this._http.post<IUpdateProfilePictureResponse>('https://streamiobackend.ddns.net/user-service/uploadProfilePicture',  { s3FileUrl }).pipe(
          // handling success and failure 
          map(user => {
            console.log(user, "USER FROM EFFECTS");
            const imagePath = user.imagePath;
            return updateProfilePictureSuccess({ imagePath }); // Returning the success action
          }),
          catchError((error) => {
            console.error("Update failed", error);
            return of(updateProfilePictureFailure({ error })); // Returning the failure action
          })
        );
      })
    )
  );
  
  

}