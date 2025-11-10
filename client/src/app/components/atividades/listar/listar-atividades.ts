import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter, map } from 'rxjs';
import { ListagemAtividadesModel } from '../atividade.models';
import { AtividadeService } from '../atividade.service';

@Component({
  selector: 'app-listar-atividades',
  imports: [MatButtonModule, MatIconModule, MatCardModule, RouterLink, AsyncPipe, DatePipe],
  templateUrl: './listar-atividades.html',
})
export class ListarAtividades {
  protected readonly route = inject(ActivatedRoute);
  protected readonly atividadeService = inject(AtividadeService);

  protected atividades$ = new BehaviorSubject<ListagemAtividadesModel[]>([]);

  constructor() {
    this.carregarAtividades();
  }

  protected readonly atividade$ = this.route.data.pipe(
    filter((data) => data['atividades']),
    map((data) => {
      const atividades = data['atividades'] as ListagemAtividadesModel[];

      return atividades.map((a) => ({
        ...a,
        inicio: this.converterUtcParaLocal(a.inicio),
        termino: this.converterUtcParaLocal(a.termino),
      }));
    }),
  );

  private converterUtcParaLocal(data: string | Date): Date {
    const d = new Date(data);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  }

  carregarAtividades(tipo?: string): void {
    this.atividadeService.selecionarTodas(tipo).subscribe((atividades) => {
      const convertidas = atividades.map((a) => ({
        ...a,
        inicio: this.converterUtcParaLocal(a.inicio),
        termino: this.converterUtcParaLocal(a.termino),
      }));
      this.atividades$.next(convertidas);
    });
  }

  filtrar(tipo?: string): void {
    this.carregarAtividades(tipo);
  }
}
