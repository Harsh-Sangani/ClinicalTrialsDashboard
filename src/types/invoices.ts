export type Invoice = {
  id: string;
  department: string;
  study_number: string;
  invoice_number: string;
  invoice_description: string | null;
  cost: number;
  contract_number: string;
  payment_date: string | null;
  uploaded_by_email: string;
  created_at: string;
};
