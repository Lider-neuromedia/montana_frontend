export interface DataVendedor {
    id: number;
    name: string;
    clientes?: [];
    apellidos: string;
    dni: number;
    email: string;
    email_verified_at?: string;
    pedidos?: [];
    password: string;
    confirm_password?: string;
    rol_id: 2;
    user_data?: {
      codigo:number;
      telefono: string
    };
    userdata?: {
        codigo:number;
        telefono: string
      };
    data_user?: {
        codigo:number;
        telefono: string
      }
}