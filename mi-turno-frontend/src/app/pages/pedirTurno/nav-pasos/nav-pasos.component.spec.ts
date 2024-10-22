import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPasosComponent } from './nav-pasos.component';

describe('NavPasosComponent', () => {
  let component: NavPasosComponent;
  let fixture: ComponentFixture<NavPasosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavPasosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavPasosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
