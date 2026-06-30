export interface IOption 
{
  id: string;
  label: string;
  value: string | number;
  name?: string;
  selected?: boolean | number;
  checked?: boolean | number;
}

export type TSelectSearchOptions = Array<IOption>;

export interface IOptionType
{
  value: string;
  label: string;
}

export interface ICode {
  code: string;
  qr_code: string;
  table_id?: string;
}