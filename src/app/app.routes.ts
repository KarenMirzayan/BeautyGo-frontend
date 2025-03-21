import { Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {BusinessMainComponent} from "./business-main/business-main.component";

export const routes: Routes = [
  {path: "", component: MainComponent},
  {path: "business", component: BusinessMainComponent},
];
