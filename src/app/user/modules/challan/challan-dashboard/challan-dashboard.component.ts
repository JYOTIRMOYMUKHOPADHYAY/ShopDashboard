import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { purchaseDetailsTemplate } from 'src/app/services/dynamicFormService/dynamic-form-template';
import { DynamicFormService } from 'src/app/services/dynamicFormService/dynamic-form.service';

@Component({
  selector: 'app-challan-dashboard',
  templateUrl: './challan-dashboard.component.html',
  styleUrls: ['./challan-dashboard.component.scss']
})
export class ChallanDashboardComponent implements OnInit {
  userForm!: FormGroup;
  purchaseDetailsTemplate = purchaseDetailsTemplate;

  constructor(private fb: FormBuilder, private dynamicFormService: DynamicFormService) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone_no: ['', [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      purchaseDetails: this.fb.array([])
    });
  }

  get purchaseDetailsFormArray(): FormArray {
    return this.userForm.get('purchaseDetails') as FormArray;
  }

  addPurchase(): void {
    const purchaseFormGroup = this.dynamicFormService.createFormGroupFromTemplate(
      this.purchaseDetailsTemplate
    );

    this.subscribeToValueChanges(purchaseFormGroup);

    this.purchaseDetailsFormArray.push(purchaseFormGroup);
  }

  private subscribeToValueChanges(purchaseFormGroup: FormGroup): void {
    this.purchaseDetailsTemplate.forEach(controlTemplate => {
      const control = purchaseFormGroup.get(controlTemplate.name) as FormControl;

      if (controlTemplate.name === 'price' || controlTemplate.name === 'count') {
        control.valueChanges.subscribe(() => {
          this.updateTotalPrice(purchaseFormGroup);
        });
      }

      if (controlTemplate.disabled) {
        control.disable();
      }
    });
  }

  updateTotalPrice(purchaseFormGroup: FormGroup): void {
    const price = purchaseFormGroup.get('price')!.value;
    const count = purchaseFormGroup.get('count')!.value;
    const total_price = price * count;
    purchaseFormGroup.get('total_price')!.setValue(total_price);
  }

  removePurchase(index: number): void {
    this.purchaseDetailsFormArray.removeAt(index);
  }


  calculateTotalAmount(): number {
    let totalAmount = 0;
  
    this.purchaseDetailsFormArray.controls.forEach((purchaseGroup) => {
      console.log(purchaseGroup.get('total_price')!.value)
      if (purchaseGroup.get('total_price')!.value > 0){
         totalAmount += purchaseGroup.get('total_price')!.value;
      }
     
    });
  
    return totalAmount;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      console.log(formData);
      // Here you can perform further actions with the form data, like sending it to a server.
    }
  }
}
