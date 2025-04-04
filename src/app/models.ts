export interface Business {
  id: number;
  name: string;
  phone: string;
  address: string;
  category: string;
}

export interface Service {
  id: number,
  name: string,
  duration: number,
  highestPrice: number,
  lowestPrice: number,
  business_id: number,
  topic: string
}

export interface Staff {
  id: number,
  name: string,
  position: string,
  businessId: number,
  services: Service[],
}
