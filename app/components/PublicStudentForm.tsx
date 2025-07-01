'use client';

import { useState } from 'react';
import { StudentFormData } from '../types/student';
import LocationSelector from './LocationSelector';

interface PublicStudentFormProps {
  onSubmit: (formData: StudentFormData) => Promise<void>;
}

export default function PublicStudentForm({ onSubmit }: PublicStudentFormProps) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    phone: '',
    socialContact: '',
    dob: currentDate,
    referrer: '',
    province: '',
    country: '',
    targetScore: 30,
    startDate: currentDate,
    studyDuration: 1,
    tuitionPaymentDates: [currentDate], // Default to current date
    tuitionPaymentStatus: 'pending',
    trainerName: '',
    tuitionFee: 0,
    notes: '',
    type: 'class', // Default to class
    isProcess: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format number to Vietnamese currency format
  const formatVND = (value: number): string => {
    return value.toLocaleString('vi-VN');
  };

  const handleTuitionFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove all non-digit characters
    const numericValue = inputValue.replace(/\D/g, '');
    const parsedValue = parseInt(numericValue) || 0;
    setFormData({...formData, tuitionFee: parsedValue});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Ensure payment date is set to current date
      const submissionData = {
        ...formData,
        tuitionPaymentDates: [currentDate]
      };
      await onSubmit(submissionData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-base font-medium text-gray-700">Họ và tên</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fc5d01] focus:ring-[#fc5d01] text-base"
          required
        />
      </div>

      <div>
        <label className="block text-base font-medium text-gray-700">Số điện thoại</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fc5d01] focus:ring-[#fc5d01] text-base"
          required
        />
      </div>

      <div>
        <label className="block text-base font-medium text-gray-700">Tên Zalo hoặc Facebook liên hệ (Không bắt buộc)</label>
        <input
          type="text"
          value={formData.socialContact}
          onChange={(e) => setFormData({...formData, socialContact: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fc5d01] focus:ring-[#fc5d01] text-base"
        />
      </div>

      <div>
        <label className="block text-base font-medium text-gray-700">Ngày sinh</label>
        <input
          type="date"
          value={formData.dob}
          onChange={(e) => setFormData({...formData, dob: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fc5d01] focus:ring-[#fc5d01] text-base"
          required
        />
      </div>

      <div>
        <label className="block text-base font-medium text-gray-700">Người giới thiệu (Không bắt buộc)</label>
        <input
          type="text"
          value={formData.referrer}
          onChange={(e) => setFormData({...formData, referrer: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fc5d01] focus:ring-[#fc5d01] text-base"
        />
      </div>

      <LocationSelector
        country={formData.country}
        province={formData.province}
        onCountryChange={(country) => {
          setFormData(prev => ({...prev, country}));
        }}
        onProvinceChange={(province) => {
          setFormData(prev => ({...prev, province}));
        }}
      />

      <div>
        <label className="block text-base font-medium text-gray-700">Điểm mục tiêu</label>
        <select
          value={formData.targetScore}
          onChange={(e) =>
            setFormData({ ...formData, targetScore: Number(e.target.value) })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fc5d01] focus:ring-[#fc5d01] text-base"
          required
        >
          <option value={30}>30</option>
          <option value={36}>36</option>
          <option value={42}>42</option>
          <option value={50}>50</option>
          <option value={58}>58</option>
          <option value={65}>65</option>
          <option value={79}>79</option>
        </select>
      </div>

      <div>
        <label className="block text-base font-medium text-gray-700">Học phí (VND)</label>
        <input
          type="text"
          value={formatVND(formData.tuitionFee)}
          onChange={handleTuitionFeeChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fc5d01] focus:ring-[#fc5d01] text-base"
          required
          placeholder="Ví dụ: 6.500.000"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-[#fc5d01] hover:bg-[#fd7f33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fc5d01] disabled:opacity-50"
        >
          {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
        </button>
      </div>
    </form>
  );
}
