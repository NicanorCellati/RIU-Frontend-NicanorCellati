import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UppercaseDirective } from './uppercase.directive';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UppercaseDirective],
  template: `<input [formControl]="control" appUppercase />`,
})
class HostComponent {
  readonly control = new FormControl('', { nonNullable: true });
}

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let input: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  function typeValue(value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('debería convertir el valor ingresado a mayúsculas, tanto en el input como en el FormControl', () => {
    typeValue('spiderman');

    expect(input.value).toBe('SPIDERMAN');
    expect(fixture.componentInstance.control.value).toBe('SPIDERMAN');
  });

  it('si el valor ya está en mayúsculas, igual sincroniza el FormControl sin reescribir el input', () => {
    typeValue('SUPERMAN');

    expect(input.value).toBe('SUPERMAN');
    expect(fixture.componentInstance.control.value).toBe('SUPERMAN');
  });
});
