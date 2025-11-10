export interface ListagemAtividadesApiResponse {
  quantidadeRegistros: number;
  registros: ListagemAtividadesModel[];
}

export interface ListagemAtividadesModel {
  id: string;
  tipoAtividade: string;
  inicio: Date;
  termino: Date;
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

export interface EditarAtividadeModel {
  tipoAtividade: string;
  inicio: Date;
  termino: Date;
  pacienteId: string;
  medicos: string[];
}

export interface EditarAtividadeResponseModel {
  tipoAtividade: string;
  inicio: Date;
  termino: Date;
  pacienteId: string;
  medicos: string[];
}

export interface DetalhesAtividadeModel {
  id: string;
  tipoAtividade: string;
  inicio: Date;
  termino: Date;
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
