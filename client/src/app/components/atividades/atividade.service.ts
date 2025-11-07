import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ListagemAtividadesModel, ListagemAtividadesApiResponse } from './atividade.models';

@Injectable()
export class AtividadeService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + '/api/atividades-medicas';

  public selecionarTodas(): Observable<ListagemAtividadesModel[]> {
    return this.http
      .get<{ sucesso: boolean; dados: ListagemAtividadesApiResponse }>(this.apiUrl)
      .pipe(map((res) => res.dados.registros));
  }
}
