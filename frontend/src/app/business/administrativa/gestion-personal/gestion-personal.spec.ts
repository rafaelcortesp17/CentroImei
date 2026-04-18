import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPersonal } from './gestion-personal';

describe('GestionPersonal', () => {
  let component: GestionPersonal;
  let fixture: ComponentFixture<GestionPersonal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPersonal],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionPersonal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
