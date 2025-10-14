/**
 * Category Field Configuration System
 * Defines all category-specific fields for the marketplace
 */

export type FieldType = 'text' | 'number' | 'select' | 'multiselect' | 'textarea';

export interface FieldOption {
  value: string;
  label: string;
}

export interface CategoryField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: FieldOption[];
  min?: number;
  max?: number;
  unit?: string;
  helpText?: string;
}

export interface CategoryConfig {
  name: string;
  label: string;
  icon: string;
  fields: CategoryField[];
}

// Common field definitions (reusable across categories)
const COMMON_SIZES = {
  shirtSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map(s => ({ value: s, label: s })),
  neckSizes: Array.from({ length: 10 }, (_, i) => {
    const size = 14 + i * 0.5;
    return { value: size.toString(), label: `${size}"` };
  }),
  waistSizes: Array.from({ length: 17 }, (_, i) => {
    const size = 28 + i * 2;
    return { value: size.toString(), label: size.toString() };
  }),
  inseamSizes: Array.from({ length: 11 }, (_, i) => {
    const size = 28 + i * 2;
    return { value: size.toString(), label: `${size}"` };
  }),
  shoeSizes: Array.from({ length: 25 }, (_, i) => {
    const size = 7 + i * 0.5;
    return { value: size.toString(), label: size.toString() };
  }),
  jacketSizes: ['34', '36', '38', '40', '42', '44', '46', '48', '50', '52'].map(s => ({ value: s, label: s })),
};

const COMMON_MATERIALS = {
  fabric: [
    { value: 'Cotton', label: 'Cotton' },
    { value: 'Wool', label: 'Wool' },
    { value: 'Linen', label: 'Linen' },
    { value: 'Silk', label: 'Silk' },
    { value: 'Polyester', label: 'Polyester' },
    { value: 'Cashmere', label: 'Cashmere' },
    { value: 'Blend', label: 'Blend' },
  ],
  leather: [
    { value: 'Full Grain Leather', label: 'Full Grain Leather' },
    { value: 'Top Grain Leather', label: 'Top Grain Leather' },
    { value: 'Genuine Leather', label: 'Genuine Leather' },
    { value: 'Suede', label: 'Suede' },
    { value: 'Patent Leather', label: 'Patent Leather' },
    { value: 'Vegan Leather', label: 'Vegan Leather' },
  ],
  metal: [
    { value: 'Stainless Steel', label: 'Stainless Steel' },
    { value: 'Gold', label: 'Gold' },
    { value: 'Silver', label: 'Silver' },
    { value: 'Platinum', label: 'Platinum' },
    { value: 'Titanium', label: 'Titanium' },
    { value: 'Brass', label: 'Brass' },
  ],
};

const FITS = [
  { value: 'Slim Fit', label: 'Slim Fit' },
  { value: 'Regular Fit', label: 'Regular Fit' },
  { value: 'Classic Fit', label: 'Classic Fit' },
  { value: 'Relaxed Fit', label: 'Relaxed Fit' },
  { value: 'Oversized', label: 'Oversized' },
];

// Category Configurations
export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  // TOPS
  'dress-shirt': {
    name: 'dress-shirt',
    label: 'Dress Shirt',
    icon: '👔',
    fields: [
      {
        name: 'neckSize',
        label: 'Neck Size',
        type: 'select',
        required: true,
        options: COMMON_SIZES.neckSizes,
        unit: 'inches',
      },
      {
        name: 'sleeveLength',
        label: 'Sleeve Length',
        type: 'select',
        required: true,
        options: Array.from({ length: 9 }, (_, i) => {
          const size = 32 + i;
          return { value: size.toString(), label: `${size}"` };
        }),
        unit: 'inches',
      },
      {
        name: 'fit',
        label: 'Fit',
        type: 'select',
        required: true,
        options: FITS,
      },
      {
        name: 'pattern',
        label: 'Pattern',
        type: 'select',
        required: true,
        options: [
          { value: 'Solid', label: 'Solid' },
          { value: 'Striped', label: 'Striped' },
          { value: 'Checked', label: 'Checked' },
          { value: 'Gingham', label: 'Gingham' },
          { value: 'Printed', label: 'Printed' },
        ],
      },
      {
        name: 'collarStyle',
        label: 'Collar Style',
        type: 'select',
        required: false,
        options: [
          { value: 'Spread', label: 'Spread' },
          { value: 'Point', label: 'Point' },
          { value: 'Button-Down', label: 'Button-Down' },
          { value: 'Cutaway', label: 'Cutaway' },
          { value: 'Band', label: 'Band' },
        ],
      },
    ],
  },

  'casual-shirt': {
    name: 'casual-shirt',
    label: 'Casual Shirt',
    icon: '👕',
    fields: [
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        required: true,
        options: COMMON_SIZES.shirtSizes,
      },
      {
        name: 'fit',
        label: 'Fit',
        type: 'select',
        required: true,
        options: FITS,
      },
      {
        name: 'sleeveLength',
        label: 'Sleeve Length',
        type: 'select',
        required: true,
        options: [
          { value: 'Short Sleeve', label: 'Short Sleeve' },
          { value: 'Long Sleeve', label: 'Long Sleeve' },
          { value: '3/4 Sleeve', label: '3/4 Sleeve' },
        ],
      },
    ],
  },

  't-shirt': {
    name: 't-shirt',
    label: 'T-Shirt',
    icon: '👕',
    fields: [
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        required: true,
        options: COMMON_SIZES.shirtSizes,
      },
      {
        name: 'fit',
        label: 'Fit',
        type: 'select',
        required: true,
        options: FITS,
      },
      {
        name: 'neckline',
        label: 'Neckline',
        type: 'select',
        required: false,
        options: [
          { value: 'Crew Neck', label: 'Crew Neck' },
          { value: 'V-Neck', label: 'V-Neck' },
          { value: 'Henley', label: 'Henley' },
          { value: 'Scoop Neck', label: 'Scoop Neck' },
        ],
      },
    ],
  },

  'polo-shirt': {
    name: 'polo-shirt',
    label: 'Polo Shirt',
    icon: '👕',
    fields: [
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        required: true,
        options: COMMON_SIZES.shirtSizes,
      },
      {
        name: 'fit',
        label: 'Fit',
        type: 'select',
        required: true,
        options: FITS,
      },
    ],
  },

  'sweater': {
    name: 'sweater',
    label: 'Sweater',
    icon: '🧶',
    fields: [
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        required: true,
        options: COMMON_SIZES.shirtSizes,
      },
      {
        name: 'style',
        label: 'Style',
        type: 'select',
        required: true,
        options: [
          { value: 'Crew Neck', label: 'Crew Neck' },
          { value: 'V-Neck', label: 'V-Neck' },
          { value: 'Cardigan', label: 'Cardigan' },
          { value: 'Turtleneck', label: 'Turtleneck' },
          { value: 'Quarter Zip', label: 'Quarter Zip' },
          { value: 'Hoodie', label: 'Hoodie' },
        ],
      },
    ],
  },

  // BOTTOMS
  'dress-pants': {
    name: 'dress-pants',
    label: 'Dress Pants',
    icon: '👖',
    fields: [
      {
        name: 'waistSize',
        label: 'Waist Size',
        type: 'select',
        required: true,
        options: COMMON_SIZES.waistSizes,
        unit: 'inches',
      },
      {
        name: 'inseam',
        label: 'Inseam',
        type: 'select',
        required: true,
        options: COMMON_SIZES.inseamSizes,
        unit: 'inches',
      },
      {
        name: 'fit',
        label: 'Fit',
        type: 'select',
        required: true,
        options: FITS,
      },
      {
        name: 'rise',
        label: 'Rise',
        type: 'select',
        required: false,
        options: [
          { value: 'Low Rise', label: 'Low Rise' },
          { value: 'Mid Rise', label: 'Mid Rise' },
          { value: 'High Rise', label: 'High Rise' },
        ],
      },
    ],
  },

  'jeans': {
    name: 'jeans',
    label: 'Jeans',
    icon: '👖',
    fields: [
      {
        name: 'waistSize',
        label: 'Waist Size',
        type: 'select',
        required: true,
        options: COMMON_SIZES.waistSizes,
        unit: 'inches',
      },
      {
        name: 'inseam',
        label: 'Inseam',
        type: 'select',
        required: true,
        options: COMMON_SIZES.inseamSizes,
        unit: 'inches',
      },
      {
        name: 'fit',
        label: 'Fit',
        type: 'select',
        required: true,
        options: [
          { value: 'Skinny', label: 'Skinny' },
          { value: 'Slim', label: 'Slim' },
          { value: 'Straight', label: 'Straight' },
          { value: 'Bootcut', label: 'Bootcut' },
          { value: 'Relaxed', label: 'Relaxed' },
          { value: 'Loose', label: 'Loose' },
        ],
      },
      {
        name: 'wash',
        label: 'Wash',
        type: 'select',
        required: false,
        options: [
          { value: 'Raw', label: 'Raw' },
          { value: 'Light Wash', label: 'Light Wash' },
          { value: 'Medium Wash', label: 'Medium Wash' },
          { value: 'Dark Wash', label: 'Dark Wash' },
          { value: 'Black', label: 'Black' },
          { value: 'Distressed', label: 'Distressed' },
        ],
      },
    ],
  },

  'chinos': {
    name: 'chinos',
    label: 'Chinos',
    icon: '👖',
    fields: [
      {
        name: 'waistSize',
        label: 'Waist Size',
        type: 'select',
        required: true,
        options: COMMON_SIZES.waistSizes,
        unit: 'inches',
      },
      {
        name: 'inseam',
        label: 'Inseam',
        type: 'select',
        required: true,
        options: COMMON_SIZES.inseamSizes,
        unit: 'inches',
      },
      {
        name: 'fit',
        label: 'Fit',
        type: 'select',
        required: true,
        options: FITS,
      },
    ],
  },

  'shorts': {
    name: 'shorts',
    label: 'Shorts',
    icon: '🩳',
    fields: [
      {
        name: 'waistSize',
        label: 'Waist Size',
        type: 'select',
        required: true,
        options: COMMON_SIZES.waistSizes,
        unit: 'inches',
      },
      {
        name: 'inseam',
        label: 'Inseam',
        type: 'select',
        required: true,
        options: [
          { value: '5', label: '5"' },
          { value: '7', label: '7"' },
          { value: '9', label: '9"' },
          { value: '11', label: '11"' },
        ],
        unit: 'inches',
      },
      {
        name: 'style',
        label: 'Style',
        type: 'select',
        required: false,
        options: [
          { value: 'Casual', label: 'Casual' },
          { value: 'Athletic', label: 'Athletic' },
          { value: 'Cargo', label: 'Cargo' },
          { value: 'Board Shorts', label: 'Board Shorts' },
        ],
      },
    ],
  },

  // OUTERWEAR
  'suit-jacket': {
    name: 'suit-jacket',
    label: 'Suit Jacket',
    icon: '🤵',
    fields: [
      {
        name: 'chestSize',
        label: 'Chest Size',
        type: 'select',
        required: true,
        options: COMMON_SIZES.jacketSizes,
        unit: 'inches',
      },
      {
        name: 'fit',
        label: 'Fit',
        type: 'select',
        required: true,
        options: FITS,
      },
      {
        name: 'buttons',
        label: 'Number of Buttons',
        type: 'select',
        required: false,
        options: [
          { value: '1', label: '1 Button' },
          { value: '2', label: '2 Buttons' },
          { value: '3', label: '3 Buttons' },
          { value: 'double', label: 'Double Breasted' },
        ],
      },
    ],
  },

  'blazer': {
    name: 'blazer',
    label: 'Blazer',
    icon: '🧥',
    fields: [
      {
        name: 'chestSize',
        label: 'Chest Size',
        type: 'select',
        required: true,
        options: COMMON_SIZES.jacketSizes,
        unit: 'inches',
      },
      {
        name: 'fit',
        label: 'Fit',
        type: 'select',
        required: true,
        options: FITS,
      },
    ],
  },

  'coat': {
    name: 'coat',
    label: 'Coat',
    icon: '🧥',
    fields: [
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        required: true,
        options: COMMON_SIZES.shirtSizes,
      },
      {
        name: 'style',
        label: 'Style',
        type: 'select',
        required: true,
        options: [
          { value: 'Overcoat', label: 'Overcoat' },
          { value: 'Trench Coat', label: 'Trench Coat' },
          { value: 'Peacoat', label: 'Peacoat' },
          { value: 'Parka', label: 'Parka' },
          { value: 'Bomber', label: 'Bomber' },
          { value: 'Puffer', label: 'Puffer' },
        ],
      },
      {
        name: 'length',
        label: 'Length',
        type: 'select',
        required: false,
        options: [
          { value: 'Short', label: 'Short (Waist)' },
          { value: 'Mid', label: 'Mid (Hip)' },
          { value: 'Long', label: 'Long (Knee)' },
        ],
      },
    ],
  },

  // FOOTWEAR
  'dress-shoes': {
    name: 'dress-shoes',
    label: 'Dress Shoes',
    icon: '👞',
    fields: [
      {
        name: 'shoeSize',
        label: 'Shoe Size (US)',
        type: 'select',
        required: true,
        options: COMMON_SIZES.shoeSizes,
      },
      {
        name: 'width',
        label: 'Width',
        type: 'select',
        required: false,
        options: [
          { value: 'Narrow (B)', label: 'Narrow (B)' },
          { value: 'Medium (D)', label: 'Medium (D)' },
          { value: 'Wide (E/EE)', label: 'Wide (E/EE)' },
        ],
      },
      {
        name: 'style',
        label: 'Style',
        type: 'select',
        required: true,
        options: [
          { value: 'Oxford', label: 'Oxford' },
          { value: 'Derby', label: 'Derby' },
          { value: 'Loafer', label: 'Loafer' },
          { value: 'Monk Strap', label: 'Monk Strap' },
          { value: 'Brogue', label: 'Brogue' },
        ],
      },
    ],
  },

  'sneakers': {
    name: 'sneakers',
    label: 'Sneakers',
    icon: '👟',
    fields: [
      {
        name: 'shoeSize',
        label: 'Shoe Size (US)',
        type: 'select',
        required: true,
        options: COMMON_SIZES.shoeSizes,
      },
      {
        name: 'style',
        label: 'Style',
        type: 'select',
        required: false,
        options: [
          { value: 'Low Top', label: 'Low Top' },
          { value: 'High Top', label: 'High Top' },
          { value: 'Mid Top', label: 'Mid Top' },
          { value: 'Slip On', label: 'Slip On' },
        ],
      },
    ],
  },

  'boots': {
    name: 'boots',
    label: 'Boots',
    icon: '🥾',
    fields: [
      {
        name: 'shoeSize',
        label: 'Shoe Size (US)',
        type: 'select',
        required: true,
        options: COMMON_SIZES.shoeSizes,
      },
      {
        name: 'style',
        label: 'Style',
        type: 'select',
        required: true,
        options: [
          { value: 'Chelsea', label: 'Chelsea' },
          { value: 'Chukka', label: 'Chukka' },
          { value: 'Combat', label: 'Combat' },
          { value: 'Work Boot', label: 'Work Boot' },
          { value: 'Hiking', label: 'Hiking' },
          { value: 'Western', label: 'Western' },
        ],
      },
      {
        name: 'shaftHeight',
        label: 'Shaft Height',
        type: 'select',
        required: false,
        options: [
          { value: 'Ankle', label: 'Ankle' },
          { value: 'Mid', label: 'Mid' },
          { value: 'Knee High', label: 'Knee High' },
        ],
      },
    ],
  },

  // ACCESSORIES
  'tie': {
    name: 'tie',
    label: 'Tie',
    icon: '👔',
    fields: [
      {
        name: 'length',
        label: 'Length',
        type: 'number',
        required: true,
        unit: 'inches',
        min: 54,
        max: 62,
        placeholder: '58',
      },
      {
        name: 'width',
        label: 'Width',
        type: 'number',
        required: true,
        unit: 'cm',
        min: 5,
        max: 10,
        placeholder: '8',
      },
      {
        name: 'pattern',
        label: 'Pattern',
        type: 'select',
        required: true,
        options: [
          { value: 'Solid', label: 'Solid' },
          { value: 'Striped', label: 'Striped' },
          { value: 'Paisley', label: 'Paisley' },
          { value: 'Geometric', label: 'Geometric' },
          { value: 'Floral', label: 'Floral' },
          { value: 'Polka Dot', label: 'Polka Dot' },
        ],
      },
    ],
  },

  'belt': {
    name: 'belt',
    label: 'Belt',
    icon: '👖',
    fields: [
      {
        name: 'waistSize',
        label: 'Waist Size',
        type: 'select',
        required: true,
        options: COMMON_SIZES.waistSizes,
        unit: 'inches',
      },
      {
        name: 'width',
        label: 'Belt Width',
        type: 'select',
        required: true,
        options: [
          { value: '1', label: '1"' },
          { value: '1.25', label: '1.25"' },
          { value: '1.5', label: '1.5"' },
          { value: '1.75', label: '1.75"' },
        ],
        unit: 'inches',
      },
      {
        name: 'buckleType',
        label: 'Buckle Type',
        type: 'select',
        required: true,
        options: [
          { value: 'Plate', label: 'Plate Buckle' },
          { value: 'Frame', label: 'Frame Buckle' },
          { value: 'Box Frame', label: 'Box Frame' },
          { value: 'D-Ring', label: 'D-Ring' },
          { value: 'Automatic', label: 'Automatic' },
        ],
      },
    ],
  },

  'cufflinks': {
    name: 'cufflinks',
    label: 'Cufflinks',
    icon: '💎',
    fields: [
      {
        name: 'metalType',
        label: 'Metal Type',
        type: 'select',
        required: true,
        options: COMMON_MATERIALS.metal,
      },
      {
        name: 'closureType',
        label: 'Closure Type',
        type: 'select',
        required: true,
        options: [
          { value: 'Bullet Back', label: 'Bullet Back' },
          { value: 'Whale Back', label: 'Whale Back' },
          { value: 'Chain Link', label: 'Chain Link' },
          { value: 'Ball Return', label: 'Ball Return' },
        ],
      },
      {
        name: 'style',
        label: 'Style',
        type: 'select',
        required: false,
        options: [
          { value: 'Classic', label: 'Classic' },
          { value: 'Modern', label: 'Modern' },
          { value: 'Vintage', label: 'Vintage' },
          { value: 'Novelty', label: 'Novelty' },
        ],
      },
    ],
  },

  'pocket-square': {
    name: 'pocket-square',
    label: 'Pocket Square',
    icon: '🎨',
    fields: [
      {
        name: 'dimensions',
        label: 'Dimensions',
        type: 'select',
        required: true,
        options: [
          { value: '12x12', label: '12" x 12"' },
          { value: '15x15', label: '15" x 15"' },
          { value: '17x17', label: '17" x 17"' },
        ],
        unit: 'inches',
      },
      {
        name: 'hemType',
        label: 'Hem Type',
        type: 'select',
        required: false,
        options: [
          { value: 'Hand-Rolled', label: 'Hand-Rolled' },
          { value: 'Machine', label: 'Machine' },
          { value: 'Raw Edge', label: 'Raw Edge' },
        ],
      },
      {
        name: 'pattern',
        label: 'Pattern',
        type: 'select',
        required: true,
        options: [
          { value: 'Solid', label: 'Solid' },
          { value: 'Paisley', label: 'Paisley' },
          { value: 'Geometric', label: 'Geometric' },
          { value: 'Floral', label: 'Floral' },
          { value: 'Polka Dot', label: 'Polka Dot' },
        ],
      },
    ],
  },

  'watch': {
    name: 'watch',
    label: 'Watch',
    icon: '⌚',
    fields: [
      {
        name: 'caseSize',
        label: 'Case Size',
        type: 'number',
        required: true,
        unit: 'mm',
        min: 36,
        max: 50,
        placeholder: '40',
      },
      {
        name: 'movement',
        label: 'Movement',
        type: 'select',
        required: true,
        options: [
          { value: 'Automatic', label: 'Automatic' },
          { value: 'Quartz', label: 'Quartz' },
          { value: 'Manual', label: 'Manual' },
          { value: 'Smart', label: 'Smart' },
        ],
      },
      {
        name: 'caseMaterial',
        label: 'Case Material',
        type: 'select',
        required: true,
        options: COMMON_MATERIALS.metal,
      },
      {
        name: 'bandType',
        label: 'Band Type',
        type: 'select',
        required: true,
        options: [
          { value: 'Leather', label: 'Leather' },
          { value: 'Metal Bracelet', label: 'Metal Bracelet' },
          { value: 'Rubber', label: 'Rubber' },
          { value: 'Fabric/NATO', label: 'Fabric/NATO' },
        ],
      },
      {
        name: 'waterResistance',
        label: 'Water Resistance',
        type: 'select',
        required: false,
        options: [
          { value: 'None', label: 'None' },
          { value: '30m', label: '30m (3 ATM)' },
          { value: '50m', label: '50m (5 ATM)' },
          { value: '100m', label: '100m (10 ATM)' },
          { value: '200m', label: '200m (20 ATM)' },
        ],
      },
    ],
  },

  'bag': {
    name: 'bag',
    label: 'Bag',
    icon: '💼',
    fields: [
      {
        name: 'style',
        label: 'Style',
        type: 'select',
        required: true,
        options: [
          { value: 'Messenger', label: 'Messenger' },
          { value: 'Briefcase', label: 'Briefcase' },
          { value: 'Backpack', label: 'Backpack' },
          { value: 'Duffle', label: 'Duffle' },
          { value: 'Tote', label: 'Tote' },
        ],
      },
      {
        name: 'capacity',
        label: 'Laptop Capacity',
        type: 'select',
        required: false,
        options: [
          { value: 'None', label: 'None' },
          { value: '13"', label: '13 inch' },
          { value: '15"', label: '15 inch' },
          { value: '17"', label: '17 inch' },
        ],
      },
    ],
  },

  'wallet': {
    name: 'wallet',
    label: 'Wallet',
    icon: '👛',
    fields: [
      {
        name: 'style',
        label: 'Style',
        type: 'select',
        required: true,
        options: [
          { value: 'Bifold', label: 'Bifold' },
          { value: 'Trifold', label: 'Trifold' },
          { value: 'Money Clip', label: 'Money Clip' },
          { value: 'Cardholder', label: 'Card Holder' },
          { value: 'Zip Around', label: 'Zip Around' },
        ],
      },
      {
        name: 'cardSlots',
        label: 'Card Slots',
        type: 'number',
        required: false,
        min: 1,
        max: 20,
        placeholder: '6',
      },
    ],
  },

  'sunglasses': {
    name: 'sunglasses',
    label: 'Sunglasses',
    icon: '🕶️',
    fields: [
      {
        name: 'frameShape',
        label: 'Frame Shape',
        type: 'select',
        required: true,
        options: [
          { value: 'Aviator', label: 'Aviator' },
          { value: 'Wayfarer', label: 'Wayfarer' },
          { value: 'Round', label: 'Round' },
          { value: 'Square', label: 'Square' },
          { value: 'Cat Eye', label: 'Cat Eye' },
          { value: 'Clubmaster', label: 'Clubmaster' },
        ],
      },
      {
        name: 'lensType',
        label: 'Lens Type',
        type: 'select',
        required: false,
        options: [
          { value: 'Polarized', label: 'Polarized' },
          { value: 'Non-Polarized', label: 'Non-Polarized' },
          { value: 'Gradient', label: 'Gradient' },
          { value: 'Mirrored', label: 'Mirrored' },
        ],
      },
    ],
  },

  'hat': {
    name: 'hat',
    label: 'Hat',
    icon: '🎩',
    fields: [
      {
        name: 'style',
        label: 'Style',
        type: 'select',
        required: true,
        options: [
          { value: 'Baseball Cap', label: 'Baseball Cap' },
          { value: 'Beanie', label: 'Beanie' },
          { value: 'Fedora', label: 'Fedora' },
          { value: 'Bucket Hat', label: 'Bucket Hat' },
          { value: 'Snapback', label: 'Snapback' },
          { value: 'Trucker', label: 'Trucker' },
        ],
      },
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        required: false,
        options: [
          { value: 'One Size', label: 'One Size' },
          { value: 'S/M', label: 'S/M' },
          { value: 'L/XL', label: 'L/XL' },
          { value: '7', label: '7' },
          { value: '7 1/8', label: '7 1/8' },
          { value: '7 1/4', label: '7 1/4' },
          { value: '7 3/8', label: '7 3/8' },
          { value: '7 1/2', label: '7 1/2' },
          { value: '7 5/8', label: '7 5/8' },
          { value: '7 3/4', label: '7 3/4' },
          { value: '8', label: '8' },
        ],
      },
    ],
  },

  'scarf': {
    name: 'scarf',
    label: 'Scarf',
    icon: '🧣',
    fields: [
      {
        name: 'length',
        label: 'Length',
        type: 'number',
        required: true,
        unit: 'inches',
        min: 50,
        max: 90,
        placeholder: '70',
      },
      {
        name: 'width',
        label: 'Width',
        type: 'number',
        required: true,
        unit: 'inches',
        min: 10,
        max: 30,
        placeholder: '12',
      },
    ],
  },
};

// Helper function to get all category options for dropdown
export function getCategoryOptions(): FieldOption[] {
  return Object.values(CATEGORY_CONFIGS).map(config => ({
    value: config.name,
    label: `${config.icon} ${config.label}`,
  }));
}

// Helper function to get fields for a specific category
export function getFieldsForCategory(category: string): CategoryField[] {
  return CATEGORY_CONFIGS[category]?.fields || [];
}

// Helper function to check if a category exists
export function isValidCategory(category: string): boolean {
  return category in CATEGORY_CONFIGS;
}

