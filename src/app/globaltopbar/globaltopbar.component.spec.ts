import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobaltopbarComponent } from './globaltopbar.component';

describe('GlobaltopbarComponent', () => {
  let component: GlobaltopbarComponent;
  let fixture: ComponentFixture<GlobaltopbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GlobaltopbarComponent]
    });
    fixture = TestBed.createComponent(GlobaltopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
