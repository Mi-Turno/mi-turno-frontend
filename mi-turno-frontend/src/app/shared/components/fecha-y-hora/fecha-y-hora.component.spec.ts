import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FechaYHoraComponent } from './fecha-y-hora.component';

describe('FechaYHoraComponent', () => {
  let component: FechaYHoraComponent;
  let fixture: ComponentFixture<FechaYHoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FechaYHoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FechaYHoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
