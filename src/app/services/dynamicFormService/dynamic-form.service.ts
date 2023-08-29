import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  constructor(private fb: FormBuilder) { }

  createFormGroupFromTemplate(template: any): FormGroup {
    const group: any = {};
    for (const control of template) {
      group[control.name] = [control.defaultValue || '', Validators.required];
    }
    return this.fb.group(group);
  }
}
