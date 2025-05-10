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
import {AuthComponent} from "./auth/auth.component";
import { SalonComponent } from './salon/salon.component';
import { SalonServicesComponent } from './salon-services/salon-services.component';
import { SalonAppointmentComponent } from './salon-appointment/salon-appointment.component';
import {BusinessPageComponent} from "./business-page/business-page.component";
import { HistoryComponent } from './history/history.component';
import { ReviewComponent } from './review/review.component';
import {EmployeePageComponent} from "./employee-page/employee-page.component";
import {EmployeeMainComponent} from "./employee-main/employee-main.component";
import {EmployeeJournalComponent} from "./employee-journal/employee-journal.component";
import {AdminPageComponent} from "./admin-page/admin-page.component";
import {AdminMainComponent} from "./admin-main/admin-main.component";
import {AdminRequestsComponent} from "./admin-requests/admin-requests.component";
import {AdminRequestDetailComponent} from "./admin-request-detail/admin-request-detail.component";
import {AdminReviewsComponent} from "./admin-reviews/admin-reviews.component";

export const routes: Routes = [
  {path: "", component: HeaderFooterPageComponent, children: [
      {path: "", component: MainComponent},
      {path: "account", component: PersonalAccountComponent},
      {path: "history", component: HistoryComponent},
      {path: "review", component: ReviewComponent},
      {path: "contacts", component: ContactsPageComponent},
      {path: "category", component: CategoryComponent},
      {path: "search/:query", component: SearchComponent},
      {path:"authentication", component: AuthComponent},
      {path: "salon/:id", component: SalonComponent},
      {path: "salon/:id/services", component: SalonServicesComponent},
      {path: "salon/:business_id/appointment/:service_id", component: SalonAppointmentComponent},
    ]},
  {path: "business", component: BusinessHeaderFooterPageComponent, children: [
      {path: "", component: BusinessMainComponent},
      {path: "account", component: PersonalAccountComponent},
      {path: "register", component: BusinessRegistrationComponent},
      {path: "journal", component: BusinessJournalComponent},
      {path: "specialists", component: BusinessSpecialistsComponent},
      {path: "services", component: BusinessServicesComponent},
      {path: "authentication", component: AuthComponent},
      {path: "page", component: BusinessPageComponent},
    ]},
  {path: "employee", component: EmployeePageComponent, children: [
      {path: "", component: EmployeeMainComponent},
      {path: "journal", component: EmployeeJournalComponent},
      {path: "authentication", component: AuthComponent},
      {path: "account", component: PersonalAccountComponent},
    ]},
  {path: "admin", component: AdminPageComponent, children: [
      {path: "", component: AdminMainComponent},
      {path: "authentication", component: AuthComponent},
      {path: "account", component: PersonalAccountComponent},
      {path: "requests", component: AdminRequestsComponent},
      {path: "requests/:id", component: AdminRequestDetailComponent},
      {path: "reviews", component: AdminReviewsComponent},
    ]}
];
