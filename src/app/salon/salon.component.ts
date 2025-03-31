import {Component, OnInit} from '@angular/core';
import {Business} from "../models";
import {BusinessService} from "../business.service";
import {NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-salon',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './salon.component.html',
  styleUrl: './salon.component.css'
})
export class SalonComponent implements OnInit{
  business: Business | null = null;

  constructor(private businessService: BusinessService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.businessService.getBusiness(id).subscribe((data) => {
          this.business = data;
        });
      }
    });
  }
}
