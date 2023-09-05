import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ChallanDashboardComponent } from './challan-dashboard.component';
import { SharedMaterialModuleModule } from 'src/app/shared-material-module/shared-material-module.module';

describe('ChallanDashboardComponent', () => {
  let component: ChallanDashboardComponent;
  let fixture: ComponentFixture<ChallanDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChallanDashboardComponent],
      imports: [ReactiveFormsModule, SharedMaterialModuleModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallanDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the total amount', () => {
    component.userForm.controls['name'].setValue('John');
    component.userForm.controls['address'].setValue('123 Main St');
    component.userForm.controls['phone_no'].setValue('1234567890');
    component.addPurchase();
    component.addPurchase();
    fixture.detectChanges();

    const totalAmountEl = fixture.debugElement.query(By.css('.total-amount'));
    expect(totalAmountEl.nativeElement.textContent).toContain('Total Amount: 0'); // Update with actual expected value
  });

  // Add more test cases as needed
});
