import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelRecepcionComponent } from './panel-recepcion.component';

describe('PanelRecepcionComponent', () => {
  let component: PanelRecepcionComponent;
  let fixture: ComponentFixture<PanelRecepcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelRecepcionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelRecepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
