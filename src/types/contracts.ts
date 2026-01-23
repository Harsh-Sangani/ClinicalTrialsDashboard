export type Contract = {
  id: string;
  study_number: string;
  department: string;
  contract_value: number;
  balance: number;
  status: "Ongoing" | "Finalized" | "Expired";
  start_date: string;
  end_date: string;
  created_at: string;
};