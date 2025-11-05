export interface RegistroModel {
  userName: string;
  email: string;
  password: string;
}

export interface LoginModel {
  userName: string;
  password: string;
}

export interface AccessTokenModel {
  chave: string;
  dataExpiracao: Date;
  usuario: UsuarioModel;
}

export interface UsuarioModel {
  id: string;
  userName: string;
  email: string;
}
