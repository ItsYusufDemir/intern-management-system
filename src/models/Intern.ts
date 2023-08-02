export interface Intern {
  intern_id?: number;
  first_name: string;
  last_name: string;
  id_no: string;
  phone_number: string;
  email: string;
  uni: string | null;
  major: string | null;
  grade: number | null;
  gpa: number | null;
  team_id: number;
  birthday: Date | null;
  internship_starting_date: Date;
  internship_ending_date: Date;
  cv_url: string | null;
  photo_url: string | null;
  overall_success: number | null;
  assignment_grades: number[];
}