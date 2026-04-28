export const SALES_TAX_RATE = 0.0825;

export const MULTI_TV_DISCOUNTS = {
  two: 0.10,
  three: 0.15,
  fourPlus: 0.20
};

export const PRICING = {
  TRIP_CHARGE: 19,
  TV_SIZES: {
    under24: { label: 'Under 24"', price: 29 },
    size25to55: { label: '25-55"', price: 99 },
    size56to75: { label: '56-75"', price: 119 },
    size76to85: { label: '76-85"', price: 129 },
    over86: { label: 'Over 86"', price: 159 }
  },
  TECHS: {
    one: { label: '1 Technician', price: 0 },
    two: { label: '2 Technicians', price: 59 }
  },
  MOUNT_TYPES: {
    own: { label: 'Already Have Mount', price: 0 },
    fixed: { label: 'Fixed Mount', price: 39 },
    tilt: { label: 'Tilt Mount', price: 49 },
    corner: { label: 'Corner Mount', price: 69 },
    fullMotion: { label: 'Full Motion', price: 69 },
    ceiling: { label: 'Ceiling Mount', price: 69 }
  },
  WALL_TYPES: {
    drywall: { label: 'Drywall', price: 0 },
    brick: { label: 'Brick/Concrete', price: 49 },
    stone: { label: 'Stone/Tile/Marble', price: 89 }
  },
  CABLE_MANAGEMENT: {
    exposed: { label: 'Exposed Wires', price: 0 },
    channel: { label: 'Cable Channel', price: 39 },
    inWallDrywall: { label: 'In-Wall (Drywall)', price: 89 },
    inWallPowerDrywall: { label: 'In-Wall + Power (Drywall)', price: 119 },
    inWallNonDrywall: { label: 'In-Wall (Hard Surface)', price: 249 },
    inWallPowerNonDrywall: { label: 'In-Wall + Power (Hard Surface)', price: 289 }
  },
  EXTRAS: {
    soundbar: { label: 'Soundbar Mounting', price: 59 },
    shelf: { label: 'Shelf Installation', price: 49 },
    other: { label: 'Other Installation', price: 49 }
  }
};

export const INITIAL_FORM_DATA = {
  tvSize: null,
  techCount: null,
  mountType: null,
  wallType: null,
  cableManagement: null,
  extras: [],
  tvCount: 1,
  multiTVDiscount: false,
  date: '',
  timeSlot: '',
  address: { street: '', apt: '', city: '', state: 'TX', zip: '' },
  contact: { fullName: '', phone: '', email: '' },
  instructions: '',
  marketing: false,
  terms: false,
  smsConsent: false
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone) => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  return cleaned.length === 10;
};

export const formatPhone = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export const validateZIP = (zip) => {
  return /^\d{5}$/.test(zip);
};

export const validateRequired = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined && value !== false;
};

export const calculateSalesTax = (amount) => {
  return amount * SALES_TAX_RATE;
};

export const calculatePrice = (data) => {
  const tvCount = 1;
  let unitPrice = 0;
  
  // Base Item Prices (Per TV)
  unitPrice += PRICING.TV_SIZES[data.tvSize]?.price || 0;
  unitPrice += PRICING.MOUNT_TYPES[data.mountType]?.price || 0;
  unitPrice += PRICING.WALL_TYPES[data.wallType]?.price || 0;
  unitPrice += PRICING.CABLE_MANAGEMENT[data.cableManagement]?.price || 0;

  // Extras (Per TV)
  data.extras.forEach(extra => {
    unitPrice += PRICING.EXTRAS[extra]?.price || 0;
  });

  // Techs (Per Visit - Not Multiplied)
  const techPrice = PRICING.TECHS[data.techCount]?.price || 0;

  // 1. Calculate Subtotal + Trip Charge
  const subtotal = (unitPrice * tvCount) + techPrice;
  const tripCharge = PRICING.TRIP_CHARGE;
  const baseAmount = subtotal + tripCharge;
  
  // 2. Pricing Discount
  let volumeDiscount = 0;
  if (baseAmount > 200) {
    volumeDiscount = 30;
  }

  // Result from step 1
  const amountAfterVolume = Math.max(0, baseAmount - volumeDiscount);

  // 3. Monday & Tuesday Discount (10% on the result of step 1)
  let dayOfWeekDiscount = 0;
  let saturdaySurcharge = 0;
  if (data.date) {
    const [year, month, day] = data.date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay(); 
    
    // Check if Monday (1) or Tuesday (2)
    if (dayOfWeek === 1 || dayOfWeek === 2) {
      dayOfWeekDiscount = amountAfterVolume * 0.10;
    }

    if (dayOfWeek === 6) {
      saturdaySurcharge = 29;
    }
    
  }

  // 4. Subtotal after discounts (Result 2)
  const taxableAmount = Math.max(0, amountAfterVolume - dayOfWeekDiscount);
  
  // 5. Apply sales tax
  const salesTax = calculateSalesTax(taxableAmount);
  
  // 6. Final estimated total
  const estimatedTotal = taxableAmount + salesTax //+ saturdaySurcharge;

  return {
    subtotal,
    tripCharge,
    baseAmount,
    volumeDiscount,
    dayOfWeekDiscount,
    taxableAmount,
    salesTax,
    estimatedTotal,
    discount: volumeDiscount + dayOfWeekDiscount // for compatibility
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};