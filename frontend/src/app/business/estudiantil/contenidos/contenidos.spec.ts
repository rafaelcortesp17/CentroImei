import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contenidos } from './contenidos';

describe('Contenidos', () => {
  let component: Contenidos;
  let fixture: ComponentFixture<Contenidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contenidos],
    }).compileComponents();

    fixture = TestBed.createComponent(Contenidos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
