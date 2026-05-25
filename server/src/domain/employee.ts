export type Employee = {
  id: string;
  fullName: string;
  jobTitle: string;
  country: string;
  salary: number;
  email: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateEmployeeInput = {
  fullName: string;
  jobTitle: string;
  country: string;
  salary: number;
  email: string;
  department: string;
};

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
