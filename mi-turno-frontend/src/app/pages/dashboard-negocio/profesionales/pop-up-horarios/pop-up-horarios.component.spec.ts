import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpHorariosComponent } from './pop-up-horarios.component';

describe('PopUpHorariosComponent', () => {
  let component: PopUpHorariosComponent;
  let fixture: ComponentFixture<PopUpHorariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpHorariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
