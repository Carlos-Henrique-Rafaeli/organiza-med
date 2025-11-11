import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';
import {
  CadastrarMedicoModel,
  CadastrarMedicoResponseModel,
  EditarMedicoModel,
  EditarMedicoResponseModel,
  ListagemMedicosModel,
  ListagemMedicosApiResponse,
  DetalhesMedicoModel,
} from './medico.models';

@Injectable()
export class MedicoService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + '/api/medicos';

  public cadastrar(medicoModel: CadastrarMedicoModel): Observable<CadastrarMedicoResponseModel> {
    return this.http.post<CadastrarMedicoResponseModel>(this.apiUrl, medicoModel);
  }

  public editar(
    id: string,
    editarMedicoModel: EditarMedicoModel,
  ): Observable<EditarMedicoResponseModel> {
    const urlCompleto = `${this.apiUrl}/${id}`;
    return this.http.put<EditarMedicoResponseModel>(urlCompleto, editarMedicoModel);
  }

  public excluir(id: string): Observable<null> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http.delete<null>(urlCompleto);
  }

  public selecionarTodas(): Observable<ListagemMedicosModel[]> {
    return this.http
      .get<{ sucesso: boolean; dados: ListagemMedicosApiResponse }>(this.apiUrl)
      .pipe(map((res) => res.dados.registros));
  }

  public selecionarPorId(id: string): Observable<DetalhesMedicoModel> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http
      .get<{ sucesso: boolean; dados: DetalhesMedicoModel }>(urlCompleto)
      .pipe(map((res) => res.dados));
  }
}
