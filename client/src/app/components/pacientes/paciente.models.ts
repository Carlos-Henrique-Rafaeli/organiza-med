export interface ListagemPacientesApiResponse {
  sucesso: boolean;
  dados: DadosListagem;
}

export interface DadosListagem {
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
