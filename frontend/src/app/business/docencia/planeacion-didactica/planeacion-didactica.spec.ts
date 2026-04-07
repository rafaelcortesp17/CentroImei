import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaneacionDidactica } from './planeacion-didactica';

describe('PlaneacionDidactica', () => {
  let component: PlaneacionDidactica;
  let fixture: ComponentFixture<PlaneacionDidactica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaneacionDidactica],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaneacionDidactica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
