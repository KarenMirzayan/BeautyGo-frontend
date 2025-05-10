import {Component, OnInit} from '@angular/core';
import {DropdownComponent} from "../dropdown/dropdown.component";
import {NgIf} from "@angular/common";
import {NgxMaskDirective} from "ngx-mask";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BusinessApplicationDto} from "../models";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminServiceService} from "../admin-service.service";

@Component({
  selector: 'app-admin-request-detail',
  standalone: true,
  imports: [
    DropdownComponent,
    NgIf,
    NgxMaskDirective,
    FormsModule
  ],
  templateUrl: './admin-request-detail.component.html',
  styleUrl: './admin-request-detail.component.css'
})
export class AdminRequestDetailComponent implements OnInit{
  application: BusinessApplicationDto | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private businessApplicationService: AdminServiceService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.fetchApplication(id);
    } else {
      this.error = 'Invalid application ID';
      this.isLoading = false;
    }
  }

  fetchApplication(id: number): void {
    this.businessApplicationService.getBusinessApplicationById(id).subscribe({
      next: (application) => {
        this.application = application;
        this.isLoading = false;
        console.log(application);
      },
      error: (err) => {
        this.error = 'Failed to load application details';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  approveApplication(): void {
    if (this.application?.id) {
      this.businessApplicationService.approveBusinessApplication(this.application.id).subscribe({
        next: () => {
          this.router.navigate(['/admin/requests']);
        },
        error: (err) => {
          this.error = 'Failed to approve application';
          console.error(err);
        },
      });
    }
  }
}
