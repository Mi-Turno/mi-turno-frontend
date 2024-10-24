import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesionalesMainComponent } from './profesionales-main.component';

describe('ProfesionalesMainComponent', () => {
  let component: ProfesionalesMainComponent;
  let fixture: ComponentFixture<ProfesionalesMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesionalesMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfesionalesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
