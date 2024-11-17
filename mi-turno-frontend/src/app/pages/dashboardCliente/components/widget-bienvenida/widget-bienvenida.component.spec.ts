import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetBienvenidaComponent } from './widget-bienvenida.component';

describe('WidgetBienvenidaComponent', () => {
  let component: WidgetBienvenidaComponent;
  let fixture: ComponentFixture<WidgetBienvenidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetBienvenidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetBienvenidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
