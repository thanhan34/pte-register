export interface Student {
  id: string;
  name: string;
  phone: string;
  socialContact?: string; // Zalo or Facebook contact name
  dob: string; // date of birth
  referrer: string;
  province: string; // Province/City
  country: string; // Country
  targetScore: number;
  startDate: string;
  studyDuration: number; // in months
  tuitionPaymentDates: string[];
  tuitionPaymentStatus: 'paid' | 'pending' | 'overdue';
  trainerName: string;
  tuitionFee: number;
  notes: string;
  type: 'one-on-one' | 'class' | '2345';
  isProcess?: boolean; // Optional for backward compatibility, defaults to false for new 1-1 students
  isPublicSubmission?: boolean; // Flag to identify submissions from public form
  createdAt?: string;
  updatedAt?: string;
}

export type StudentFormData = Omit<Student, 'id'>;
