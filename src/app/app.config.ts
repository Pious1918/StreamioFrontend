import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { userReducer } from './store/user.reducer';
import { UserEffects } from './store/user.effects';
import { authInterceptor } from './interceptor/auth.interceptor';
import { errorInterceptor } from './interceptor/error.interceptor';
import { adminAuthInterceptor } from './interceptor/admin.auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes , withViewTransitions(),withInMemoryScrolling({ scrollPositionRestoration: "top" }) ),
    provideStore({ user:userReducer}),
    provideState({ name: 'user' , reducer:userReducer }),
    provideHttpClient(withInterceptors([authInterceptor ,errorInterceptor])) ,
    provideEffects(UserEffects)]
};
