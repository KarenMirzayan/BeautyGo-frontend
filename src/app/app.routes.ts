import { Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
import { PersonalAccountComponent } from './personal-account/personal-account.component';
import { ContactsComponent } from './contacts/contacts.component';
import { CategoryComponent } from './category/category.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
  {path: "", component: MainComponent},
  {path: "account", component: PersonalAccountComponent},
  {path: "contacts", component: ContactsComponent},
  {path: "category", component: CategoryComponent},
  {path: "search", component: SearchComponent}
];
