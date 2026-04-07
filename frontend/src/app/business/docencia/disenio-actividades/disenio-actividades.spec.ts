import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisenioActividades } from './disenio-actividades';

describe('DisenioActividades', () => {
  let component: DisenioActividades;
  let fixture: ComponentFixture<DisenioActividades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisenioActividades],
    }).compileComponents();

    fixture = TestBed.createComponent(DisenioActividades);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
