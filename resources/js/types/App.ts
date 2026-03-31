export interface Option {
  id: string;
  label: string;
  value: string | number;
  name?: string;
  selected?: boolean | number;
  checked?: boolean | number;
}

export interface ICode {
  code: string;
  qr_code: string;
  table_id?: string;
}