export interface Condition {
  id: string;
  max: number;
  name: string;
  set: number;
  type: string;
}

export interface Filter {
  id: string;
  name: String;
  corporation: String;
  createdBy: String;
  conditions: Condition[];
}