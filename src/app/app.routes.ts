import { Routes } from '@angular/router';
import { HomeComponent } from './pages/user-home/home.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserLoginComponent } from './pages/user-login/user-login.component';
import { AuthService } from './services/auth.service';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminHeaderComponent } from './shared/components/admin-header/admin-header.component';
import { AdminUserListComponent } from './pages/admin-user-list/admin-user-list.component';
import { AdminAuthgService } from './services/admin-authg.service';
import { UserSearchResultComponent } from './pages/user-search-result/user-search-result.component';
import { ErrorComponent } from './pages/error/error.component';
import { AdminlayoutComponent } from './component/adminlayout/adminlayout.component';
import { VideoUploadComponent } from './pages/video-upload/video-upload.component';
import { VideoPlayerComponent } from './pages/video-player/video-player.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { AdminBannerManagementComponent } from './pages/admin-banner-management/admin-banner-management.component';
import { AdminBannerListComponent } from './pages/admin-banner-list/admin-banner-list.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
import { LiveStreamComponent } from './pages/live-stream/live-stream.component';
import { LiveViewerComponent } from './pages/live-viewer/live-viewer.component';
import { LiveListComponent } from './pages/live-list/live-list.component';
import { LiveCreationComponent } from './pages/live-creation/live-creation.component';
import { OtpPageComponent } from './pages/otp-page/otp-page.component';
import { VideoplayerComponent } from './pages/videoplayer/videoplayer.component';
import { UserPrivatevideosComponent } from './pages/user-privatevideos/user-privatevideos.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserLikedPageComponent } from './pages/user-liked-page/user-liked-page.component';
import { LikedVideoplayerComponent } from './pages/liked-videoplayer/liked-videoplayer.component';
import { UserSubscriberslistComponent } from './pages/user-subscriberslist/user-subscriberslist.component';



// export const userRoutes: Routes = [
//     {
//         path: '',
//         component: HomeComponent,
//         canActivate: [AuthService],
//         children: [
//             {
//                 path: 'userprofile', // Nested route under HomeComponent
//                 component: UserProfileComponent
//             }
//         ]
//     },
//     {
//         path: 'login',
//         component: UserLoginComponent
//     },
//     {
//         path: '',
//         redirectTo: '', // This redirects to HomeComponent
//         pathMatch: 'full'
//     }
// ];

// export const routes: Routes = [
//     ...userRoutes,
//     {
//         path: '**',
//         redirectTo: '', // Catch-all for unmatched paths
//         pathMatch: 'full'
//     }
// ];

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthService] }, // Protect HomeComponent
    { path: 'login', component: UserLoginComponent },
    { path: 'password-reset', component: PasswordResetComponent },
    { path: 'otp', component: OtpPageComponent },
    { path: 'newpass', component: NewPasswordComponent },
    { path: 'userprofile', component: UserProfileComponent, canActivate: [AuthService] }, // Protect UserProfileComponent
    { path: 'privatevideos', component: UserPrivatevideosComponent, canActivate: [AuthService] }, // Protect UserProfileComponent
    { path: 'results', component: UserSearchResultComponent, canActivate: [AuthService] },
    { path: 'uploadvideo', component: VideoUploadComponent, canActivate: [AuthService] },
    { path: 'live', component: LiveStreamComponent, canActivate: [AuthService] },
    { path: 'livecreation', component: LiveCreationComponent, canActivate: [AuthService] },
    { path: 'viewer/:roomid', component: LiveViewerComponent, canActivate: [AuthService] },
    { path: 'livelist', component: LiveListComponent, canActivate: [AuthService] },
    // {path:'video/:id',component:VideoplayerComponent ,canActivate:[AuthService]},
    // {path:'video/:id',component:VideoPlayerComponent ,canActivate:[AuthService]},
    {path:'video/:id',component:VideoplayerComponent ,canActivate:[AuthService]},
    {path:'likedvideo/:id',component:LikedVideoplayerComponent ,canActivate:[AuthService]},
    {path:'subscribers',component:UserSubscriberslistComponent ,canActivate:[AuthService]},
    {path:'favorites',component:UserLikedPageComponent ,canActivate:[AuthService]},
    {path:'error', component:ErrorComponent, canActivate:[AuthService]},
   







    {path:'adminlogin' , component:AdminLoginComponent},
    {
        path:'admin',
        component:AdminlayoutComponent,
        canActivate:[AdminAuthgService],
        children:[
            {path:'userlist', component:AdminUserListComponent , canActivate:[AdminAuthgService]},
            {path:'addbanner', component:AdminBannerManagementComponent , canActivate:[AdminAuthgService]},
            {path:'banner', component:AdminBannerListComponent , canActivate:[AdminAuthgService]},
            {path:'admindash', component:AdminDashboardComponent , canActivate:[AdminAuthgService]},
        ]
    },

   
    // Wildcard route for handling undefined paths
    { path: '**', redirectTo: '/error?message=Page%20Not%20Found' } // Redirect to error page

];



// // User Routes
// export const userRoutes: Routes = [
//     { path: '', component: HomeComponent, canActivate: [AuthService] }, // Protect HomeComponent
//     { path: 'login', component: UserLoginComponent },
//     { path: 'userprofile', component: UserProfileComponent, canActivate: [AuthService] } // Protect UserProfileComponent
// ];


// // Admin Routes
// export const adminRoutes: Routes = [
//     { path: 'adminlogin', component: AdminLoginComponent },
//     // Add more admin routes here with appropriate guards
// ];


// // You can also define the main routes if needed
// export const routes: Routes = [
//     ...userRoutes,
//     ...adminRoutes
// ];