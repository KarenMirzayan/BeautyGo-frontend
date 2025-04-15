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
  phoneNumber: string;
  email: string | null;
  role: string;
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
