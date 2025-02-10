import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionLocalComponent } from './configuracion-local.component';

describe('ConfiguracionLocalComponent', () => {
  let component: ConfiguracionLocalComponent;
  let fixture: ComponentFixture<ConfiguracionLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionLocalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
