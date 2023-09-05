import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { purchaseDetailsTemplate } from 'src/app/services/dynamicFormService/dynamic-form-template';
import { DynamicFormService } from 'src/app/services/dynamicFormService/dynamic-form.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-challan-dashboard',
  templateUrl: './challan-dashboard.component.html',
  styleUrls: ['./challan-dashboard.component.scss']
})
export class ChallanDashboardComponent implements OnInit {
  userForm!: FormGroup;
  purchaseDetailsTemplate = purchaseDetailsTemplate;
  dynamicHtml: SafeHtml | undefined;
  constructor(private fb: FormBuilder, private dynamicFormService: DynamicFormService, private sanitizer: DomSanitizer) {
    (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone_no: ['', [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      paymentRecieve: [0, Validators.required],
      purchaseDetails: this.fb.array([]),
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
    const total_price = Math.round(price * count);
    purchaseFormGroup.get('total_price')!.setValue(total_price);
  }

  removePurchase(index: number): void {
    this.purchaseDetailsFormArray.removeAt(index);
  }

  calculateTotalAmount(): number {
    let totalAmount = 0;
    this.purchaseDetailsFormArray.controls.forEach((purchaseGroup) => {
      if (purchaseGroup.get('total_price')!.value > 0) {
        totalAmount += Math.round(purchaseGroup.get('total_price')!.value);
      }
    });
    return totalAmount;
  }

  calculateDueAmount(): number {
    let balance = this.calculateTotalAmount() - this.userForm.value.paymentRecieve
    if (balance < 0) {
      this.dynamicHtml = this.sanitizer.bypassSecurityTrustHtml(`<span>Advanced Amount :</span> <span>${Math.abs(balance)}</span>`);
      return 0;
    }
    this.dynamicHtml = this.sanitizer.bypassSecurityTrustHtml('');
    return this.calculateTotalAmount() > 0 ? this.calculateTotalAmount() - this.userForm.value.paymentRecieve : 0
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      console.log(formData);
      this.generatePdf(formData)
      // Here you can perform further actions with the form data, like sending it to a server.
    }
  }



  generatePdf(data: any) {
     return pdfMake.createPdf({
      content: [
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: data.name,
                bold:true
              },
              { text: data.address },
              { text: data.phone_no}
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              { 
                text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [{text: 'Product Name', style: 'tableHeader'}, {text: 'Price', style: 'tableHeader'}, {text: 'Quantity', style: 'tableHeader'}, {text: 'Amount', style: 'tableHeader'}],
              ...data.purchaseDetails.map((p: any) => ([p.product_name + " (" + p.measurement + ")", p.price, p.count, (parseInt(p.price)*parseInt(p.count)).toFixed(2)])),
              [{text: 'Total Amount', colSpan: 3, style: 'tableHeader'}, {}, {}, {text: this.calculateTotalAmount(), style: 'tableHeader'}],
              [{text: 'Payment Receive', colSpan: 3 ,style: 'tableHeader'}, {}, {}, {text: data.paymentRecieve, style: 'tableHeader'}],
              [{text: 'Due', colSpan: 3, style: 'tableHeader'}, {}, {}, {text: this.calculateTotalAmount() - data.paymentRecieve, style: 'tableHeader'}]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
            text: "this.invoice.additionalDetails",
            margin: [0, 0 ,0, 15]          
        },
       
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
            ul: [
              'Order can be return in max 10 days.',
              'Warrenty of the product will be subject to the manufacturer terms and conditions.',
              'This is system generated invoice.',
            ],
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15,0, 15]          
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    }).print();

  }
}
