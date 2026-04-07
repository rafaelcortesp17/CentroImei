import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaContenido } from './carga-contenido';

describe('CargaContenido', () => {
  let component: CargaContenido;
  let fixture: ComponentFixture<CargaContenido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaContenido],
    }).compileComponents();

    fixture = TestBed.createComponent(CargaContenido);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
