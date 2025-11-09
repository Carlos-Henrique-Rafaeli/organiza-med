export interface ListagemAtividadesApiResponse {
  quantidadeRegistros: number;
  registros: ListagemAtividadesModel[];
}

export interface ListagemAtividadesModel {
  id: string;
  tipoAtividade: string;
  dataInicio: Date;
  dataTermino: Date;
  paciente: PacienteAtividadeModel;
  medicos: MedicoAtividadeModel[];
}

export interface CadastrarAtividadeModel {
  tipoAtividade: string;
  inicio: Date;
  termino: Date;
  pacienteId: string;
  medicos: string[];
}

export interface CadastrarAtividadeResponseModel {
  id: string;
}

export interface DetalhesAtividadeModel {
  id: string;
  tipoAtividade: string;
  dataInicio: Date;
  dataTermino: Date;
  paciente: PacienteAtividadeModel;
  medicos: MedicoAtividadeModel[];
}

export interface PacienteAtividadeModel {
  id: string;
  nome: string;
}

export interface MedicoAtividadeModel {
  id: string;
  nome: string;
}
