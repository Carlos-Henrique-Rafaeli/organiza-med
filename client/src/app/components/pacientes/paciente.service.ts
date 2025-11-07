import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map, Observable, tap } from 'rxjs';
import {
  CadastrarPacienteModel,
  CadastrarPacienteResponseModel,
  ListagemPacientesModel,
  ListagemPacientesApiResponse,
  EditarPacienteModel,
  EditarPacienteResponseModel,
  DetalhesPacienteModel,
} from './paciente.models';

@Injectable()
export class PacienteService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + '/api/pacientes';

  public cadastrar(
    pacienteModel: CadastrarPacienteModel,
  ): Observable<CadastrarPacienteResponseModel> {
    return this.http.post<CadastrarPacienteResponseModel>(this.apiUrl, pacienteModel);
  }

  public editar(
    id: string,
    editarPacienteModel: EditarPacienteModel,
  ): Observable<EditarPacienteResponseModel> {
    const urlCompleto = `${this.apiUrl}/${id}`;
    return this.http.put<EditarPacienteResponseModel>(urlCompleto, editarPacienteModel);
  }

  public excluir(id: string): Observable<null> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http.delete<null>(urlCompleto);
  }

  public selecionarTodas(): Observable<ListagemPacientesModel[]> {
    return this.http
      .get<{ sucesso: boolean; dados: ListagemPacientesApiResponse }>(this.apiUrl)
      .pipe(map((res) => res.dados.registros));
  }

  public selecionarPorId(id: string): Observable<DetalhesPacienteModel> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http
      .get<{ sucesso: boolean; dados: DetalhesPacienteModel }>(urlCompleto)
      .pipe(map((res) => res.dados));
  }
}
