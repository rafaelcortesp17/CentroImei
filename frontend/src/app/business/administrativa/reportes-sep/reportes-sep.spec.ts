import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesSep } from './reportes-sep';

describe('ReportesSep', () => {
  let component: ReportesSep;
  let fixture: ComponentFixture<ReportesSep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesSep],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportesSep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
