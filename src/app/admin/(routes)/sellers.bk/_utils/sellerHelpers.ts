import {
  ICreateSellerAdminBody,
  ISellerAddress,
  ISellerAdminItem,
  ISellerFormData,
  SellerStatus
} from "../_types/seller.types";

// Status formatting and display utilities
export const getSellerStatusColor = (status: SellerStatus): string => {
  switch (status) {
    case SellerStatus.ACTIVE:
      return "text-green-600 bg-green-50 border-green-200";
    case SellerStatus.PENDING:
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case SellerStatus.SUSPENDED:
      return "text-red-600 bg-red-50 border-red-200";
    case SellerStatus.REJECTED:
      return "text-red-600 bg-red-50 border-red-200";
    case SellerStatus.INACTIVE:
      return "text-gray-600 bg-gray-50 border-gray-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export const getSellerStatusLabel = (status: SellerStatus): string => {
  switch (status) {
    case SellerStatus.ACTIVE:
      return "Active";
    case SellerStatus.PENDING:
      return "Pending";
    case SellerStatus.SUSPENDED:
      return "Suspended";
    case SellerStatus.REJECTED:
      return "Rejected";
    case SellerStatus.INACTIVE:
      return "Inactive";
    default:
      return "Unknown";
  }
};

// Address formatting utilities
export const formatAddress = (address: ISellerAddress): string => {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.country,
    address.zipCode,
  ].filter(Boolean);
  
  return parts.join(", ");
};

export const getShortAddress = (address: ISellerAddress): string => {
  const parts = [
    address.city,
    address.state,
    address.country,
  ].filter(Boolean);
  
  return parts.join(", ");
};

export const getPrimaryAddress = (addresses?: ISellerAddress[]): ISellerAddress | undefined => {
  if (!addresses || addresses.length === 0) return undefined;
  return addresses.find(addr => addr.isDefault) || addresses[0];
};

// Seller display utilities
export const getSellerDisplayName = (seller: ISellerAdminItem): string => {
  return seller.storeName || `Seller ${seller._id.slice(-6)}`;
};

export const getSellerImageUrl = (seller: ISellerAdminItem): string | undefined => {
  return seller.image?.url;
};

export const getSellerBannerUrl = (seller: ISellerAdminItem): string | undefined => {
  return seller.banner?.url;
};

// Rating utilities
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 4.0) return "text-yellow-600";
  if (rating >= 3.0) return "text-orange-600";
  return "text-red-600";
};

// Sales and numbers formatting
export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

// Date formatting
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDatetime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getRelativeTime = (date: Date | string): string => {
  const d = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

// Commission utilities
export const formatCommissionRate = (rate: number): string => {
  return `${rate.toFixed(1)}%`;
};

export const calculateCommissionAmount = (saleAmount: number, rate: number): number => {
  return (saleAmount * rate) / 100;
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Form data transformation utilities
export const transformSellerFormData = (formData: ISellerFormData): ICreateSellerAdminBody => {
  return {
    ...formData,
    // Transform image/banner from string URLs to proper objects if needed
    image: typeof formData.image === "string" && formData.image 
      ? { url: formData.image, alt: "Seller image" }
      : formData.image,
    banner: typeof formData.banner === "string" && formData.banner
      ? { url: formData.banner, alt: "Seller banner" }
      : formData.banner,
    // Clean up empty strings and undefined values
    phoneNumber: formData.phoneNumber || undefined,
    alternatePhone: formData.alternatePhone || undefined,
    storeDescription: formData.storeDescription || undefined,
    // Ensure addresses have proper structure
    addresses: formData.addresses?.filter(addr => 
      addr.street && addr.city && addr.state && addr.country && addr.zipCode
    ),
    // Clean up social links
    socialLinks: formData.socialLinks ? {
      website: formData.socialLinks.website || undefined,
      facebook: formData.socialLinks.facebook || undefined,
      instagram: formData.socialLinks.instagram || undefined,
      twitter: formData.socialLinks.twitter || undefined,
      youtube: formData.socialLinks.youtube || undefined,
      linkedin: formData.socialLinks.linkedin || undefined,
    } : undefined,
    // Clean up policies
    policies: formData.policies ? {
      returnPolicy: formData.policies.returnPolicy || undefined,
      shippingPolicy: formData.policies.shippingPolicy || undefined,
      privacyPolicy: formData.policies.privacyPolicy || undefined,
      termsOfService: formData.policies.termsOfService || undefined,
    } : undefined,
  };
};

// Seller analytics utilities
export const calculateSellerPerformance = (seller: ISellerAdminItem) => {
  const orderValue = seller.totalOrders > 0 ? seller.totalSales / seller.totalOrders : 0;
  const productValue = seller.totalProducts > 0 ? seller.totalSales / seller.totalProducts : 0;
  
  return {
    averageOrderValue: orderValue,
    averageProductValue: productValue,
    ratingPercentage: (seller.averageRating / 5) * 100,
    isHighPerformer: seller.averageRating >= 4.5 && seller.totalOrders >= 100,
    isNewSeller: new Date(seller.joinedDate).getTime() > Date.now() - (90 * 24 * 60 * 60 * 1000), // 90 days
  };
};

// Search and filter utilities
export const filterSellers = (sellers: ISellerAdminItem[], searchTerm: string): ISellerAdminItem[] => {
  if (!searchTerm.trim()) return sellers;
  
  const term = searchTerm.toLowerCase();
  return sellers.filter(seller => 
    seller.storeName.toLowerCase().includes(term) ||
    seller.contactEmail.toLowerCase().includes(term) ||
    seller.slug.toLowerCase().includes(term) ||
    seller._id.toLowerCase().includes(term)
  );
};

// URL and slug utilities
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const getSellerProfileUrl = (seller: ISellerAdminItem): string => {
  return `/seller/${seller.slug}`;
};

export const getSellerAdminUrl = (sellerId: string): string => {
  return `/admin/sellers/${sellerId}`;
};

// Export utilities for bulk operations
export const getSelectedSellerIds = (selectedSellers: Record<string, boolean>): string[] => {
  return Object.entries(selectedSellers)
    .filter(([, isSelected]) => isSelected)
    .map(([id]) => id);
};

export const areAllSellersSelected = (
  sellers: ISellerAdminItem[], 
  selectedSellers: Record<string, boolean>
): boolean => {
  return sellers.every(seller => selectedSellers[seller._id]);
};

export const areSomeSellersSelected = (selectedSellers: Record<string, boolean>): boolean => {
  return Object.values(selectedSellers).some(Boolean);
};