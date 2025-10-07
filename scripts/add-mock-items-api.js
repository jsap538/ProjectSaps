// Script to add mock items via API calls
// This approach uses the existing API endpoints instead of direct database access

const mockItems = [
  {
    title: "Navy Grenadine Silk Tie",
    description: "Handcrafted navy grenadine silk tie from Italy. Features a subtle texture and classic width. Perfect for business and formal occasions. Made from the finest silk with traditional craftsmanship.",
    brand: "Drake's",
    price_cents: 6500,
    shipping_cents: 599,
    images: [
      "https://placehold.co/600x750/1a2742/FFFFFF?text=Navy+Grenadine+Tie",
      "https://placehold.co/600x750/2a3752/FFFFFF?text=Tie+Detail",
      "https://placehold.co/600x750/3a4752/FFFFFF?text=Tie+Back"
    ],
    condition: "Like New",
    category: "tie",
    color: "Navy",
    material: "Grenadine Silk",
    width_cm: 8,
    location: "New York, NY"
  },
  {
    title: "Bar Stripe Repp Tie",
    description: "Classic bar stripe repp tie in navy and white. Traditional English design with diagonal stripes. Made from premium silk with hand-rolled edges. A timeless addition to any gentleman's wardrobe.",
    brand: "Brooks Brothers",
    price_cents: 3500,
    shipping_cents: 599,
    images: [
      "https://placehold.co/600x750/2a3752/FFFFFF?text=Bar+Stripe+Tie",
      "https://placehold.co/600x750/3a4752/FFFFFF?text=Stripe+Detail"
    ],
    condition: "Good",
    category: "tie",
    color: "Navy",
    material: "Repp Silk",
    width_cm: 8,
    location: "Boston, MA"
  },
  {
    title: "Burgundy Silk Tie",
    description: "Luxurious burgundy silk tie with subtle sheen. Perfect for evening events and special occasions. Made from premium Italian silk with meticulous attention to detail.",
    brand: "Tom Ford",
    price_cents: 8900,
    shipping_cents: 799,
    images: [
      "https://placehold.co/600x750/3a1722/FFFFFF?text=Burgundy+Silk+Tie",
      "https://placehold.co/600x750/4a2722/FFFFFF?text=Silk+Detail"
    ],
    condition: "New",
    category: "tie",
    color: "Burgundy",
    material: "Silk",
    width_cm: 8,
    location: "Los Angeles, CA"
  },
  {
    title: "Classic Black Leather Belt",
    description: "Premium black leather belt with silver buckle. Handcrafted from Italian leather with traditional construction. Adjustable sizing with multiple holes for perfect fit.",
    brand: "Hermès",
    price_cents: 12500,
    shipping_cents: 799,
    images: [
      "https://placehold.co/600x750/0a0a0a/FFFFFF?text=Black+Leather+Belt",
      "https://placehold.co/600x750/1a1a1a/FFFFFF?text=Belt+Buckle"
    ],
    condition: "Like New",
    category: "belt",
    color: "Black",
    material: "Italian Leather",
    width_cm: 3.5,
    location: "Miami, FL"
  },
  {
    title: "Silver Cufflinks Set",
    description: "Elegant silver cufflinks with geometric pattern. Made from sterling silver with polished finish. Perfect for formal occasions and business meetings. Comes in presentation box.",
    brand: "Tiffany & Co.",
    price_cents: 15000,
    shipping_cents: 699,
    images: [
      "https://placehold.co/600x750/4a5568/FFFFFF?text=Silver+Cufflinks",
      "https://placehold.co/600x750/5a6578/FFFFFF?text=Cufflink+Detail"
    ],
    condition: "New",
    category: "cufflinks",
    color: "Silver",
    material: "Sterling Silver",
    location: "New York, NY"
  },
  {
    title: "Gold Cufflinks",
    description: "Luxurious gold cufflinks with subtle engraving. Made from 18k gold with satin finish. Classic design that never goes out of style. Ideal for special occasions.",
    brand: "Tom Ford",
    price_cents: 20000,
    shipping_cents: 799,
    images: [
      "https://placehold.co/600x750/FFD700/000000?text=Gold+Cufflinks",
      "https://placehold.co/600x750/FFE700/000000?text=Gold+Detail"
    ],
    condition: "Good",
    category: "cufflinks",
    color: "Gold",
    material: "18k Gold",
    location: "Los Angeles, CA"
  },
  {
    title: "Red Pocket Square",
    description: "Vibrant red pocket square in pure silk. Hand-rolled edges with subtle sheen. Adds a perfect pop of color to any suit. Made in Italy with traditional techniques.",
    brand: "Brunello Cucinelli",
    price_cents: 5000,
    shipping_cents: 499,
    images: [
      "https://placehold.co/600x750/FF0000/FFFFFF?text=Red+Pocket+Square",
      "https://placehold.co/600x750/FF1000/FFFFFF?text=Silk+Texture"
    ],
    condition: "Like New",
    category: "pocket-square",
    color: "Red",
    material: "Pure Silk",
    location: "Boston, MA"
  },
  {
    title: "Navy Paisley Pocket Square",
    description: "Sophisticated navy paisley pocket square in silk. Intricate pattern with hand-rolled edges. Perfect for adding elegance to any formal attire.",
    brand: "Drake's",
    price_cents: 4500,
    shipping_cents: 499,
    images: [
      "https://placehold.co/600x750/1a2742/FFFFFF?text=Navy+Paisley",
      "https://placehold.co/600x750/2a3752/FFFFFF?text=Paisley+Pattern"
    ],
    condition: "New",
    category: "pocket-square",
    color: "Navy",
    material: "Silk",
    location: "Chicago, IL"
  }
];

async function addMockItems() {
  console.log('🚀 Starting to add mock items via API...');
  
  // Base URL - change this to your deployed URL or localhost
  const baseURL = 'http://localhost:3000'; // Change to your deployed URL
  
  for (let i = 0; i < mockItems.length; i++) {
    const item = mockItems[i];
    
    try {
      console.log(`📦 Adding item ${i + 1}/${mockItems.length}: ${item.title}`);
      
      const response = await fetch(`${baseURL}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: You'll need to be authenticated to add items
          // This script assumes you're running it while logged in
        },
        body: JSON.stringify(item)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Successfully added: ${item.title}`);
      } else {
        console.log(`❌ Failed to add: ${item.title} - Status: ${response.status}`);
        const errorText = await response.text();
        console.log(`   Error: ${errorText}`);
      }
      
      // Add a small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ Error adding ${item.title}:`, error.message);
    }
  }
  
  console.log('\n🎉 Finished adding mock items!');
  console.log('🌐 Check your browse page to see the new items.');
}

// Run the script
addMockItems();
