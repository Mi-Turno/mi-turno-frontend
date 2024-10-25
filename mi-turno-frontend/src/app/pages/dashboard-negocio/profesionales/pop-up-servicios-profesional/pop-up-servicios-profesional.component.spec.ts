import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpServiciosProfesionalComponent } from './pop-up-servicios-profesional.component';

describe('PopUpServiciosProfesionalComponent', () => {
  let component: PopUpServiciosProfesionalComponent;
  let fixture: ComponentFixture<PopUpServiciosProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpServiciosProfesionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpServiciosProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
