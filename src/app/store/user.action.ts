import { createAction, props } from "@ngrx/store";

export const loadUserProfile = createAction(

    '[user] load user profile'
)


export const loadUserProfileSuccess = createAction(
    '[user] load user profile success',
    props< {user:any}>()
)

export const loadUserProfileFailure = createAction(
    '[user] load profile failure',
    props<{error:any}>()
)


export const updateUserProfile = createAction(
    '[user] update user profile',
    props<{user:any}>()
)


export const updateUserProfileSuccess = createAction(
    '[user] update user profile success',
    props<{user:any}>()
)

export const updateUserProfileFailure = createAction(
    '[user] update user profile failure',
    props<{error:any}>()
)

export const updateProfilePicture = createAction(
    '[Profile] Update Profile Picture',
    props<{ s3FileUrl: string }>()  // Accept S3 URL instead of formData
);
  
export const updateProfilePictureSuccess = createAction(
    '[user] update profile picture success',
    props<{ imagePath: any }>() 
);

export const updateProfilePictureFailure = createAction(
    '[user] update profile picture failure',
    props<{ error: any }>()
);