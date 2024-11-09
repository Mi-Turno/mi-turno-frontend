import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosCheckComponent } from './servicios-check.component';

describe('ServiciosCheckComponent', () => {
  let component: ServiciosCheckComponent;
  let fixture: ComponentFixture<ServiciosCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
