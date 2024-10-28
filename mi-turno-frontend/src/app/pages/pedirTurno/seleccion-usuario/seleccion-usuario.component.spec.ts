import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionUsuarioComponent } from './seleccion-usuario.component';

describe('SeleccionUsuarioComponent', () => {
  let component: SeleccionUsuarioComponent;
  let fixture: ComponentFixture<SeleccionUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
