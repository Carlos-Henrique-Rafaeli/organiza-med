import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  ListagemAtividadesModel,
  ListagemAtividadesApiResponse,
  CadastrarAtividadeModel,
  CadastrarAtividadeResponseModel,
  DetalhesAtividadeModel,
  EditarAtividadeModel,
  EditarAtividadeResponseModel,
} from './atividade.models';

@Injectable()
export class AtividadeService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + '/api/atividades-medicas';

  public cadastrar(
    atividadeModel: CadastrarAtividadeModel,
  ): Observable<CadastrarAtividadeResponseModel> {
    return this.http.post<CadastrarAtividadeResponseModel>(this.apiUrl, atividadeModel);
  }

  public editar(
    id: string,
    editarAtividadeModel: EditarAtividadeModel,
  ): Observable<EditarAtividadeResponseModel> {
    const urlCompleto = `${this.apiUrl}/${id}`;
    return this.http.put<EditarAtividadeResponseModel>(urlCompleto, editarAtividadeModel);
  }

  public excluir(id: string): Observable<null> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http.delete<null>(urlCompleto);
  }

  public selecionarTodas(tipoAtividade?: string): Observable<ListagemAtividadesModel[]> {
    let params = new HttpParams();

    if (tipoAtividade) {
      params = params.set('tipoAtividade', tipoAtividade);
    }

    return this.http
      .get<{ sucesso: boolean; dados: ListagemAtividadesApiResponse }>(this.apiUrl, { params })
      .pipe(map((res) => res.dados.registros));
  }

  public selecionarPorId(id: string): Observable<DetalhesAtividadeModel> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http
      .get<{ sucesso: boolean; dados: DetalhesAtividadeModel }>(urlCompleto)
      .pipe(map((res) => res.dados));
  }
}
