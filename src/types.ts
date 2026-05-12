export interface Product {
  id: string;
  name: string;
  anime: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  stock: number;
  category: string;
  featured?: boolean;
  createdAt?: any;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
  verifiedPurchase?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id?: string;
  userId?: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt?: any;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: any;
  wishlist?: string[]; // Array of product IDs
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}
