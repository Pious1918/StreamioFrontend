import { createReducer, on } from "@ngrx/store"
import { loadUserProfileFailure, loadUserProfileSuccess, updateProfilePicture, updateProfilePictureFailure, updateProfilePictureSuccess, updateUserProfileFailure, updateUserProfileSuccess } from "./user.action"




export interface UserState {
    user: any,
    error: any
    profilePicUrl: string | null; 

}



export const initialState: UserState = {
    user: null,
    error: null,
    profilePicUrl: null, 

}


export const userReducer = createReducer(

    initialState,
    on(loadUserProfileSuccess, (state, { user }) => ({
        ...state,
        user,
        error: null
    })),

    on(loadUserProfileFailure, (state, { error }) => ({
        ...state,
        error
    })),

    on(updateUserProfileSuccess, (state, { user }) => {
        console.log(user,"FROM REDUCER USER SUCCESS");
        
        return ({
            ...state,
            user,
            error: null
        })
    }),

    on(updateUserProfileFailure, (state, { error }) => ({
        ...state,
        error
    })),
   

    on(updateProfilePicture, (state) => ({
        ...state,
        
    })),

    
    on(updateProfilePictureSuccess, (state, { imagePath }) => {
        console.log(imagePath,"FROM REDUCER SUCCESSS");
        
       return ({
            ...state,
            user:{
                ...state.user,
                profilePicUrl: imagePath
            }, 
            error: null,
        })
    }),

    
    on(updateProfilePictureFailure, (state, { error }) => ({
        ...state,
        error, 
    })),

)