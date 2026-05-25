export type Employee = {
  id: string;
  fullName: string;
  jobTitle: string;
  country: string;
  salary: number;
  email: string;
  department: string;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeInput = {
  fullName: string;
  jobTitle: string;
  country: string;
  salary: number;
  email: string;
  department: string;
};

export type EmployeeListResponse = {
  items: Employee[];
  total: number;
  page: number;
  pageSize: number;
};

export type CountryStats = {
  country: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  employeeCount: number;
};

export type JobTitleStats = {
  country: string;
  jobTitle: string;
  avgSalary: number;
  employeeCount: number;
};

export type OrgSummary = {
  totalEmployees: number;
  avgSalary: number;
  countryCount: number;
};
