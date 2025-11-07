export interface ListagemPacientesApiResponse {
  quantidadeRegistros: number;
  registros: ListagemPacientesModel[];
}

export interface ListagemPacientesModel {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}

export interface CadastrarPacienteModel {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}

export interface CadastrarPacienteResponseModel {
  id: string;
}

export interface EditarPacienteModel {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}

export interface EditarPacienteResponseModel {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}

export interface DetalhesPacienteModel {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}
