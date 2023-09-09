import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() {
    // Set pdfmake virtual file system
    (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
  }

  generatePdf(data: any): void {
    const invoiceNumber = (Math.random() * 1000).toFixed(0);

    pdfMake.createPdf({
      content: [
        // ... PDF content definition (omitted for brevity) ...
      ],
      // ... PDF style definitions (omitted for brevity) ...
    }).print();
  }
}
