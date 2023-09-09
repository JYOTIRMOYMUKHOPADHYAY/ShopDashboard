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
    const total_price = (price * count).toFixed(2);
    purchaseFormGroup.get('total_price')!.setValue(parseFloat(total_price));
  }

  removePurchase(index: number): void {
    this.purchaseDetailsFormArray.removeAt(index);
  }

  calculateTotalAmount(): number {
    let totalAmount = 0;
    this.purchaseDetailsFormArray.controls.forEach((purchaseGroup) => {
      if (purchaseGroup.get('total_price')!.value > 0) {
        totalAmount += purchaseGroup.get('total_price')!.value;
        ;
      }
    });
    return Math.ceil(totalAmount);
  }

  calculateDueAmount(): number {
    let balance = this.calculateTotalAmount() - this.userForm.value.paymentRecieve
    if (balance < 0) {
      this.dynamicHtml = this.sanitizer.bypassSecurityTrustHtml(`<span>Advanced Amount :</span> <span>${Math.abs(balance)}</span>`);
      return 0;
    }
    this.dynamicHtml = this.sanitizer.bypassSecurityTrustHtml('');
    return this.calculateTotalAmount() > 0 ? balance : 0
  }
  calculateDue(data: any) {
    let due = this.calculateTotalAmount() - data.paymentRecieve
    if (due < 0) {
      return 0
    } else {
      return due
    }
  }

  calculateAdvance(data: any) {
    let due = this.calculateTotalAmount() - data.paymentRecieve
    if (due < 0) {
      return Math.abs(due)
    } else {
      return 0
    }
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
                bold: true,
                style: 'userDetails'
              },
              { text: data.address, style: 'userDetails' },
              { text: data.phone_no, style: 'userDetails' }
            ],
            [
              {
                text: `Invoice Date: ${new Date().toLocaleString()}`,
                alignment: 'right',
                style: 'userDetails'
              },
              {
                text: `Invoice No : ${((Math.random() * 1000).toFixed(0))}`,
                alignment: 'right',
                style: 'userDetails'
              }
            ]
          ]
        },
        {
          table: {
            headerRows: 1,
            widths: [10, '*', 80, 80, 80],
            body: [
              [{ text: '#', style: 'tableHeader' }, { text: 'Item & Description', style: 'tableHeader' }, { text: 'Quantity', style: 'tableHeader' }, { text: 'Rate(₹)', style: 'tableHeader' }, { text: 'Amount(₹)', style: 'tableHeader' }],
              ...data.purchaseDetails.map((p: any, index: number) => ([{ text: index + 1, style: 'tablebody' }, { text: p.product_name + " (" + p.measurement + ")", style: 'tablebody' }, { text: p.count + " " + p.type, style: 'tablebody' }, { text: p.price + ".00", style: 'tablebody' }, { text: (parseInt(p.price) * parseInt(p.count)).toFixed(2), style: 'tablebody' }])),
              [{ text: '', colSpan: 2, border: [false, false, false, false], }, {}, { text: 'Total Amount', colSpan: 2, style: 'tableFooter', border: [false, false, false, false], }, {}, { text: this.calculateTotalAmount().toFixed(2) + ' (₹) ', style: 'tablePricingFooter' }],
              // [{ text: '', colSpan: 2, border: [false, false, false, false], }, {}, { text: 'Payment Receive', colSpan: 2, style: 'tableFooter', border: [false, false, false, false], }, {}, { text: data.paymentRecieve + ".00", style: 'tableFooter' }],
              // [{ text: '', colSpan: 2, border: [false, false, false, false], }, {}, { text: 'Due', colSpan: 2, style: 'tableFooter', border: [false, false, false, false], }, {}, { text: this.calculateDue(data) + '.00', style: 'tableFooter' }],
              // [{ text: '', colSpan: 2, border: [false, false, false, false], }, {}, { text: 'Advance amount', colSpan: 2, style: 'tableFooter', border: [false, false, false, false] }, {}, { text: this.calculateAdvance(data) + '.00', style: 'tableFooter' }]
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 50, 0, 70]
        },
        // {
        //   text: 'Additional Details',
        //   style: 'sectionHeader'
        // },
        // {
        //   text: "this.invoice.additionalDetails",
        //   margin: [0, 0, 0, 15]
        // },

        {
          columns: [
            [
              {
                text: "Buyer's Signature ______________________________",
                bold: true,
                style: 'userDetails'
              }
            ],
            [
              {
                text: "Seller's Signature ______________________________",
                bold: true,
                alignment: 'right',
                style: 'userDetails'
              }
            ]
          ]
        },
        {
          text: 'Thank you for your business.',
          style: 'tablebody',
          alignment: 'center',
          margin: [0, 50, 0, 50]
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 15,
          margin: [0, 20, 0, 20]
        },
        userDetails: {
          bold: true,
          fontSize: 10,
          margin: [0, 2, 0, 2]
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'white',
          fillColor: "black",
          margin: [10, 5, 10, 5]
        },
        tablebody: {
          bold: false,
          fontSize: 9,
          color: 'black',
          margin: [10, 5, 10, 5]
        },
        tablePricingFooter: {
          bold: true,
          fontSize: 10,
          color: 'black',
          fillColor: '#dee0e3',
          margin: [10, 3, 0, 3]
        },
        tableFooter: {
          bold: true,
          fontSize: 10,
          color: 'black',
          fillColor: '#dee0e3',
          margin: [10, 3, 10, 3]
        }
      }
    }).print();

  }
}
