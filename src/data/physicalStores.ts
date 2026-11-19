export interface PhysicalStore {
  id: string;
  code: string;
  name: string;
  tagline: string;
  campusLocation: string;
  building: string;
  roomOrShop: string;
  operatingHours: string;
  phone: string;
  whatsappDesk: string;
  manager: string;
  status: 'Open' | 'Closes at 7 PM' | 'Open Today';
  isFlagship: boolean;
  services: string[];
}

export const PHYSICAL_STORES: PhysicalStore[] = [
  {
    id: 'store-1',
    code: 'SINATRA-HUB-01',
    name: 'Sinatra Flagship Store (Student Centre)',
    tagline: 'Main Campus Outfitting & Collection Hub',
    campusLocation: 'Egerton University Main Campus, Njoro',
    building: 'Student Centre Complex',
    roomOrShop: 'Room 12 (Ground Floor next to Campus Cafeteria)',
    operatingHours: 'Mon – Sat: 8:30 AM – 6:30 PM (Sun: 1:00 PM – 5:00 PM)',
    phone: '+254 712 345 678',
    whatsappDesk: '+254 712 345 678',
    manager: 'Brian K. (Store Lead)',
    status: 'Open Today',
    isFlagship: true,
    services: [
      'Same-Day Parcel Collection',
      'Fitting Room & Size Trials',
      'Instant Exchanges & Returns',
      'Custom Campus Embroidery Drop-off',
    ],
  },
  {
    id: 'store-2',
    code: 'SINATRA-PAVILION-02',
    name: 'Sinatra Pavilion Store (Gate B Annex)',
    tagline: 'Commercial Hub & Express Locker Collection Point',
    campusLocation: 'Egerton Gate B Commercial Plaza',
    building: 'Varsity Commercial Complex',
    roomOrShop: 'Shop 04 (Facing Gate B Main Entrance)',
    operatingHours: 'Mon – Sat: 9:00 AM – 7:00 PM',
    phone: '+254 700 112 233',
    whatsappDesk: '+254 700 112 233',
    manager: 'Grace M. (Pavilion Supervisor)',
    status: 'Open Today',
    isFlagship: false,
    services: [
      'After-Hours Parcel Locker Box Pickup',
      'Fast Express Collection',
      'Direct M-Pesa Till Payment',
      'Streetwear New Drops Showcase',
    ],
  },
];
