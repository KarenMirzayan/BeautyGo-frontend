export interface Business {
  id: number;
  name: string;
  phone: string;
  address: string;
  description: string;
  topic: string;
  category: string;
  ownerId: number;
  services: Service[];
  rating: number;
}

export interface Service {
  id: number,
  name: string,
  duration: number,
  highestPrice: number,
  lowestPrice: number,
  businessId: number,
  topic: string,
  staffIds: number[]
}

export interface Staff {
  id: number,
  name: string,
  surname: string,
  position: string,
  phone: string,
  business_id: number,
  services: string[],
}

export interface User {
  id: number;
  fullname: string;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string | null;
  role: string;
  gender?: string; // e.g., "male", "female"
  birthdate?: string;
}

export interface AvailableTimeSlot {
  id: number | null;
  serviceId: number;
  staffId: number;
  businessId: number;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  startTime: string;
  status: string | null;
  notes: string | null;
}

export interface BusinessApplicationDto {
  id: number;
  ownerName: string;
  ownerSurname: string;
  ownerId: number;
  phone: string;
  country: string;
  city: string;
  businessName: string;
  businessType: string;
  link: string;
  description: string;
  verified: boolean;
  address: string;
  createdAt: string;
}

export interface ReviewDto {
  businessId: number;
  reservationId: number;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment?: string;
}


export interface ReservationDto {
  id: number;
  serviceId: number;
  staffId: number;
  businessId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
}

export interface TimeSlot {
  time: string;
  isHalfHour: boolean;
  isAvailable: boolean;
}

export interface ReservationDisplay {
  reservation: ReservationDto;
  top: number;
  height: number;
}
