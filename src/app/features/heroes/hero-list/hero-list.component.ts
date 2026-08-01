import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';

import { SuperHero } from '../../../core/models/super-hero.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SuperHeroService } from '../../../core/services/super-hero/super-hero.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

const PAGE_SIZE = 5;

@Component({
  selector: 'app-hero-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PaginationComponent, ConfirmDialogComponent],
  templateUrl: './hero-list.component.html',
})
export class HeroListComponent {
  private readonly heroService = inject(SuperHeroService);
  private readonly router = inject(Router);

  /** Input de filtro por nombre, con debounce para no disparar una búsqueda por cada caracter tipeado. */
  readonly filterControl = new FormControl('', { nonNullable: true });

  /** Lista completa (ya filtrada por el backend en memoria) que llega de forma reactiva. */
  private readonly heroes = signal<SuperHero[]>([]);
  private readonly currentPage = signal(1);

  /** Héroe pendiente de confirmación de borrado (null = diálogo cerrado). */
  readonly heroToDelete = signal<SuperHero | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly totalItems = computed(() => this.heroes().length);
  readonly pageSize = PAGE_SIZE;
  readonly page = this.currentPage.asReadonly();

  readonly pagedHeroes = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.heroes().slice(start, start + PAGE_SIZE);
  });

  constructor() {
    // Búsqueda reactiva: cada cambio en el input dispara automáticamente
    // una nueva consulta al servicio, cancelando la anterior con switchMap
    // si el usuario sigue escribiendo (evita condiciones de carrera).
    this.filterControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => this.heroService.search(term)),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (heroes) => {
          this.heroes.set(heroes);
          this.currentPage.set(1);
          this.errorMessage.set(null);
        },
        error: () => this.errorMessage.set('No se pudo cargar el listado de héroes.'),
      });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onAdd(): void {
    this.router.navigate(['/heroes/nuevo']);
  }

  onEdit(hero: SuperHero): void {
    this.router.navigate(['/heroes', hero.id, 'editar']);
  }

  onDeleteRequest(hero: SuperHero): void {
    this.heroToDelete.set(hero);
  }

  onDeleteCancel(): void {
    this.heroToDelete.set(null);
  }

  onDeleteConfirm(): void {
    const hero = this.heroToDelete();
    if (!hero?.id) {
      return;
    }
    this.heroService.delete(hero.id).subscribe({
      next: () => {
        this.heroes.update((list) => list.filter((h) => h.id !== hero.id));
        this.heroToDelete.set(null);
      },
      error: () => {
        this.errorMessage.set('No se pudo eliminar el héroe. Intentá nuevamente.');
        this.heroToDelete.set(null);
      },
    });
  }
}
