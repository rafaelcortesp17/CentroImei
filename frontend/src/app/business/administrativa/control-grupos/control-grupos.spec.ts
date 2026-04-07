import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlGrupos } from './control-grupos';

describe('ControlGrupos', () => {
  let component: ControlGrupos;
  let fixture: ComponentFixture<ControlGrupos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlGrupos],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlGrupos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
