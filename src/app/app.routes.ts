import { Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {BusinessMainComponent} from "./business-main/business-main.component";
import { PersonalAccountComponent } from './personal-account/personal-account.component';
import { CategoryComponent } from './category/category.component';
import { SearchComponent } from './search/search.component';
import {ContactsPageComponent} from "./contacts-page/contacts-page.component";
import {BusinessRegistrationComponent} from "./business-registration/business-registration.component";
import {BusinessHeaderFooterPageComponent} from "./business-header-footer-page/business-header-footer-page.component";
import {HeaderFooterPageComponent} from "./header-footer-page/header-footer-page.component";
import {BusinessJournalComponent} from "./business-journal/business-journal.component";
import {BusinessSpecialistsComponent} from "./business-specialists/business-specialists.component";
import {BusinessServicesComponent} from "./business-services/business-services.component";

export const routes: Routes = [
  {path: "", component: HeaderFooterPageComponent, children: [
      {path: "", component: MainComponent},
      {path: "account", component: PersonalAccountComponent},
      {path: "contacts", component: ContactsPageComponent},
      {path: "category", component: CategoryComponent},
      {path: "search", component: SearchComponent},
    ]},
  {path: "business", component: BusinessHeaderFooterPageComponent, children: [
      {path: "", component: BusinessMainComponent},
      {path: "register", component: BusinessRegistrationComponent},
      {path: "journal", component: BusinessJournalComponent},
      {path: "specialists", component: BusinessSpecialistsComponent},
      {path: "services", component: BusinessServicesComponent},
    ]}
];
