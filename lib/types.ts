export interface Shop {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  qrCodeUrl?: string;
}

export interface Order {
  id: string;
  shopId: string;
  orderNumber: string;
  files: FileUpload[];
  status: 'pending' | 'processing' | 'completed' | 'archived';
  createdAt: Date;
  completedAt?: Date;
}

export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
}
