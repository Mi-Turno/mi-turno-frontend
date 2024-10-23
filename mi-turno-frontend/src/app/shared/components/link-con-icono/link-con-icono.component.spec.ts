import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkConIconoComponent } from './link-con-icono.component';

describe('LinkConIconoComponent', () => {
  let component: LinkConIconoComponent;
  let fixture: ComponentFixture<LinkConIconoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkConIconoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkConIconoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
