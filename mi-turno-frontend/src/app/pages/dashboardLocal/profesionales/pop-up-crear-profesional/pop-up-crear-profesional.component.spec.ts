import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpCrearProfesionalComponent } from './pop-up-crear-profesional.component';

describe('PopUpCrearProfesionalComponent', () => {
  let component: PopUpCrearProfesionalComponent;
  let fixture: ComponentFixture<PopUpCrearProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpCrearProfesionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpCrearProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
