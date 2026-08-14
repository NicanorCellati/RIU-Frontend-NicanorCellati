import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { HeroUniverse, SuperHeroFormValue } from '../../../core/models/super-hero.model';
import { SuperHeroService } from '../../../core/services/super-hero/super-hero.service';
import { UppercaseDirective } from '../../../core/directives/uppercase.directive';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, UppercaseDirective],
  templateUrl: './hero-form.component.html',
})
export class HeroFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly heroService = inject(SuperHeroService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly universes: HeroUniverse[] = ['Marvel', 'DC', 'Dark Horse', 'Valiant'];

  private heroId: number | null = null;
  readonly isEditMode = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    realName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    power: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    universe: this.fb.nonNullable.control<HeroUniverse>('Marvel', Validators.required),
  });

  constructor() {
    // Si la ruta trae :id, precarga el héroe correspondiente en modo edición.
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const idParam = params.get('id');
          if (!idParam) {
            return [];
          }
          this.heroId = Number(idParam);
          this.isEditMode.set(true);
          return this.heroService.getById(this.heroId);
        }),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (hero) => this.form.patchValue(hero),
        error: () => this.errorMessage.set('No se pudo cargar el héroe solicitado.'),
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    const value = this.form.getRawValue();

    const request$ =
      this.isEditMode() && this.heroId
        ? this.heroService.update({ id: this.heroId, ...value })
        : this.heroService.create(value);

    request$.subscribe({
      next: () => this.router.navigate(['/heroes']),
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('No se pudo guardar el héroe. Intentá nuevamente.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/heroes']);
  }

  /** Getter de conveniencia para simplificar el template con lambdas legibles. */
  hasError(controlName: keyof SuperHeroFormValue, error: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(error);
  }
}
