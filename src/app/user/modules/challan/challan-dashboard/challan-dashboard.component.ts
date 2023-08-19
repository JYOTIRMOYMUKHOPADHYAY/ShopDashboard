import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-challan-dashboard',
  templateUrl: './challan-dashboard.component.html',
  styleUrls: ['./challan-dashboard.component.scss']
})
export class ChallanDashboardComponent {
  
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // create form fields with validations
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      Phone: [
        '',
        [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      // assign nested array to Referrals field
      purchaseDetails: this.fb.array([])
    });
  }

  onSubmit(values: any){
    console.log(values)
  }
}
