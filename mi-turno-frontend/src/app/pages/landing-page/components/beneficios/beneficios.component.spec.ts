import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosComponent } from './beneficios.component';

describe('BeneficiosComponent', () => {
  let component: BeneficiosComponent;
  let fixture: ComponentFixture<BeneficiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
