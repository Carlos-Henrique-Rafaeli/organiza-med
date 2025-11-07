export interface ListagemMedicosApiResponse {
  quantidadeRegistros: number;
  registros: ListagemMedicosModel[];
}

export interface ListagemMedicosModel {
  id: string;
  nome: string;
  crm: string;
}

export interface CadastrarMedicoModel {
  nome: string;
  crm: string;
}

export interface CadastrarMedicoResponseModel {
  id: string;
}

export interface EditarMedicoModel {
  nome: string;
  crm: string;
}

export interface EditarMedicoResponseModel {
  nome: string;
  crm: string;
}

export interface DetalhesMedicoModel {
  id: string;
  nome: string;
  crm: string;
}
