import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallanDashboardComponent } from './challan-dashboard.component';

describe('ChallanDashboardComponent', () => {
  let component: ChallanDashboardComponent;
  let fixture: ComponentFixture<ChallanDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallanDashboardComponent]
    });
    fixture = TestBed.createComponent(ChallanDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
