import { Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {BusinessMainComponent} from "./business-main/business-main.component";
import { PersonalAccountComponent } from './personal-account/personal-account.component';
import { CategoryComponent } from './category/category.component';
import { SearchComponent } from './search/search.component';
import {ContactsPageComponent} from "./contacts-page/contacts-page.component";

export const routes: Routes = [
  {path: "", component: MainComponent},
  {path: "account", component: PersonalAccountComponent},
  {path: "contacts", component: ContactsPageComponent},
  {path: "category", component: CategoryComponent},
  {path: "search", component: SearchComponent},
  {path: "business", component: BusinessMainComponent},
];
