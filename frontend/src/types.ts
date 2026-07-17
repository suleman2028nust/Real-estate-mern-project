export interface Listing {
  _id: string;
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  discountPrice: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  type: 'rent' | 'sale';
  offer: boolean;
  imageUrls: string[];
  userRef: string;
  createdAt: string;
  updatedAt: string;
}

export interface Landlord {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  listingRef: string;
  userRef: Landlord; // populated with user details
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
