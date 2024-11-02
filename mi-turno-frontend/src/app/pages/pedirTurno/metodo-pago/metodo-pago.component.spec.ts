import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodoPagoComponent } from './metodo-pago.component';

describe('MetodoPagoComponent', () => {
  let component: MetodoPagoComponent;
  let fixture: ComponentFixture<MetodoPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetodoPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetodoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
