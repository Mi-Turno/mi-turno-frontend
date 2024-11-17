import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaTurnosComponent } from './tabla-turnos.component';

describe('TablaTurnosComponent', () => {
  let component: TablaTurnosComponent;
  let fixture: ComponentFixture<TablaTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaTurnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
