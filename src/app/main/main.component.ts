import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Business} from "../models";
import {BusinessService} from "../business.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterLink,
    NgForOf
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  businesses: Business[] = []

  constructor(private businessService: BusinessService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.businessService.getAllBusinesses().subscribe((data) => {
      this.businesses = data;
      console.log(data);
    });
  }

  business() {
    this.router.navigate(['business/'])
  }
}
