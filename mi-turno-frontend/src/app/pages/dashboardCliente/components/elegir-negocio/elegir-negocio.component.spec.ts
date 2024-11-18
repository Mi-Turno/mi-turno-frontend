import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElegirNegocioComponent } from './elegir-negocio.component';

describe('ElegirNegocioComponent', () => {
  let component: ElegirNegocioComponent;
  let fixture: ComponentFixture<ElegirNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElegirNegocioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElegirNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
