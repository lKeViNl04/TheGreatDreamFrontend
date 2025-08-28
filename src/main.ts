import { bootstrapApplication,  } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import localeEnUs from '@angular/common/locales/en';

registerLocaleData(localeEsAr, 'es-AR');
registerLocaleData(localeEnUs, 'en-US');

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
