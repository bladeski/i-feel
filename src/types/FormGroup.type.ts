export type FormGroup = {
  name: string;
  fields: Field[];
}

export type Field = {
  name: string;
  type: 'text' | 'select' | 'multiselect';
  options?: Option[]
  value: string | Option | Option[];
  label: string;
  placeholder?: string;
  required?: boolean;
}

type Option = {
  value: string | number;
  label: string;
  options?: Option[];
}