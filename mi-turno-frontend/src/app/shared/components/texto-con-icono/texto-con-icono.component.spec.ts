import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextoConIconoComponent } from './texto-con-icono.component';

describe('TextoConIconoComponent', () => {
  let component: TextoConIconoComponent;
  let fixture: ComponentFixture<TextoConIconoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextoConIconoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextoConIconoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
