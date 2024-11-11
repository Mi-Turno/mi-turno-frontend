import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupElegirNegocioComponent } from './popup-elegir-negocio.component';

describe('PopupElegirNegocioComponent', () => {
  let component: PopupElegirNegocioComponent;
  let fixture: ComponentFixture<PopupElegirNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupElegirNegocioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupElegirNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
