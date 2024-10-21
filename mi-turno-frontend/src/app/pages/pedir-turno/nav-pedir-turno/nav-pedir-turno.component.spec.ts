import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPedirTurnoComponent } from './nav-pedir-turno.component';

describe('NavPedirTurnoComponent', () => {
  let component: NavPedirTurnoComponent;
  let fixture: ComponentFixture<NavPedirTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavPedirTurnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavPedirTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
