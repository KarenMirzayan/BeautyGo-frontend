import {ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatNativeDateModule, provideNativeDateAdapter} from "@angular/material/core";
import {registerLocaleData} from "@angular/common";
import localeRu from '@angular/common/locales/ru';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}), provideRouter(routes), provideHttpClient(),
    provideAnimationsAsync(), importProvidersFrom(MatNativeDateModule), provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'ru-RU' }]
};
