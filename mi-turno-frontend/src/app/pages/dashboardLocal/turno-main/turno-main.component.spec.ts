import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoMainComponent } from './turno-main.component';

describe('TurnoMainComponent', () => {
  let component: TurnoMainComponent;
  let fixture: ComponentFixture<TurnoMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnoMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
