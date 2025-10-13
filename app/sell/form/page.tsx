"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

interface FormData {
  title: string;
  description: string;
  brand: string;
  price_cents: number;
  shipping_cents: number;
  condition: string;
  category: string;
  color: string;
  material: string;
  width_cm: number;
  location: string;
}

export default function SellFormPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  
  // Separate state for price display values to avoid cursor jumping
  const [priceDisplay, setPriceDisplay] = useState("");
  const [shippingDisplay, setShippingDisplay] = useState("5.99");

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    brand: "",
    price_cents: 0,
    shipping_cents: 599,
    condition: "",
    category: "",
    color: "",
    material: "",
    width_cm: 0,
    location: "",
  });

  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];
  const categories = ["tie", "belt", "cufflinks", "pocket-square"];
  const brands = [
    "Drake's", "Tom Ford", "Brunello Cucinelli", "Hermes", "Tiffany & Co.",
    "Brooks Brothers", "Turnbull & Asser", "Charvet", "Brioni", "Other"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields properly
    if (name === 'width_cm') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else if (name.includes('_cents')) {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate that at least one image is uploaded
      if (images.length === 0) {
        setError('Please upload at least one image');
        setLoading(false);
        return;
      }

      // Validate all required fields
      if (!formData.title.trim()) {
        setError('Please enter an item title');
        setLoading(false);
        return;
      }

      if (!formData.description.trim() || formData.description.length < 10) {
        setError('Please enter a description (at least 10 characters)');
        setLoading(false);
        return;
      }

      if (!formData.brand) {
        setError('Please select a brand');
        setLoading(false);
        return;
      }

      if (!formData.category) {
        setError('Please select a category (tie, belt, cufflinks, or pocket-square)');
        setLoading(false);
        return;
      }

      if (!formData.condition) {
        setError('Please select the item condition');
        setLoading(false);
        return;
      }

      if (!formData.color.trim()) {
        setError('Please enter the item color');
        setLoading(false);
        return;
      }

      if (!formData.location.trim()) {
        setError('Please enter your location');
        setLoading(false);
        return;
      }

      // Validate price
      if (formData.price_cents < 100) {
        setError('Price must be at least $1.00');
        setLoading(false);
        return;
      }

      // Prepare item data, excluding zero values for optional fields
      const itemData: Record<string, unknown> = {
        ...formData,
        images: images,
      };
      
      // Remove width_cm if it's 0 (optional field)
      if (itemData.width_cm === 0) {
        delete itemData.width_cm;
      }
      
      // Remove material if empty (optional field)
      if (!itemData.material || itemData.material.trim() === '') {
        delete itemData.material;
      }

      console.log('Submitting item data:', itemData); // Debug log

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      const result = await response.json();
      console.log('API response:', result); // Debug log

      if (!response.ok) {
        // Show detailed validation errors if available
        if (result.details && Array.isArray(result.details)) {
          // Translate technical errors to user-friendly messages
          const userFriendlyErrors = result.details.map((err: string) => {
            if (err.includes('title')) return 'Title: Please check the title format';
            if (err.includes('description')) return 'Description: Must be 10-2000 characters';
            if (err.includes('brand')) return 'Brand: Please select a valid brand';
            if (err.includes('category')) return 'Category: Please select tie, belt, cufflinks, or pocket-square';
            if (err.includes('condition')) return 'Condition: Please select an item condition';
            if (err.includes('color')) return 'Color: Please enter a valid color name';
            if (err.includes('price_cents')) return 'Price: Must be between $1.00 and $10,000.00';
            if (err.includes('shipping_cents')) return 'Shipping: Must be between $0.00 and $20.00';
            if (err.includes('width_cm')) return 'Width: Must be a valid number';
            if (err.includes('location')) return 'Location: Please enter your location';
            if (err.includes('images')) return 'Images: Please upload 1-10 images';
            return err; // Fallback to original error
          });
          throw new Error(userFriendlyErrors.join('\n'));
        }
        throw new Error(result.error || 'Failed to create listing');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to list items for sale.
          </p>
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d24]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-dark md:text-4xl dark:text-white">
            List New Item
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Create a listing for your premium accessory
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-[#1f2329] rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
            <h2 className="text-xl font-semibold text-dark dark:text-white mb-6">
              Basic Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
                  placeholder="e.g., Navy Grenadine Tie"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  maxLength={2000}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
                  placeholder="Describe the item's features, condition, and any notable details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand *
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
                >
                  <option value="">Select a brand</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white dark:bg-[#1f2329] rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
            <h2 className="text-xl font-semibold text-dark dark:text-white mb-6">
              Pricing
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    name="price_cents"
                    value={priceDisplay}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers and decimal point
                      if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                        setPriceDisplay(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({ ...prev, price_cents: Math.round(value * 100) }));
                      if (value > 0) {
                        setPriceDisplay(value.toFixed(2));
                      }
                    }}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white pl-8 pr-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Minimum $1.00, Maximum $10,000.00</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shipping Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    name="shipping_cents"
                    value={shippingDisplay}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers and decimal point
                      if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                        setShippingDisplay(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({ ...prev, shipping_cents: Math.round(value * 100) }));
                      if (value > 0) {
                        setShippingDisplay(value.toFixed(2));
                      } else {
                        setShippingDisplay("5.99");
                        setFormData(prev => ({ ...prev, shipping_cents: 599 }));
                      }
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white pl-8 pr-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
                    placeholder="5.99"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Default $5.99</p>
              </div>
            </div>
          </div>

          {/* Condition & Details */}
          <div className="bg-white dark:bg-[#1f2329] rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
            <h2 className="text-xl font-semibold text-dark dark:text-white mb-6">
              Condition & Details
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
                >
                  <option value="">Select condition</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color *
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  required
                  maxLength={30}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
                  placeholder="e.g., Navy, Black, Burgundy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Material <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  maxLength={50}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
                  placeholder="e.g., Silk, Wool, Leather"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Width (cm) <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  name="width_cm"
                  value={formData.width_cm || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and decimal point
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
                  placeholder="8"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#151821] dark:text-white"
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white dark:bg-[#1f2329] rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
            <h2 className="text-xl font-semibold text-dark dark:text-white mb-6">
              Photos
            </h2>
            
            <ImageUpload
              images={images}
              onImagesChange={handleImagesChange}
              maxImages={10}
              className="w-full"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Please fix the following:</p>
                  {error.split('\n').map((err, idx) => (
                    <p key={idx} className="text-red-600 dark:text-red-400 text-sm">{err}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:flex-1 rounded-xl border border-gray-300 px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold text-dark transition hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-gray-700 dark:text-white dark:hover:border-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 rounded-xl bg-primary px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Listing...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
