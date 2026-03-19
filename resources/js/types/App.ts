export interface Option {
  id: string;
  label: string;
  value: string | number;
  name?: string;
}

export interface ICode {
  code: string;
  qr_code: string;
  table_id?: string;
}