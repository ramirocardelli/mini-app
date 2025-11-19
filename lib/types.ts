export interface Project {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  creatorAddress: string;
  creatorName: string;
  createdAt: Date;
  imageUrl?: string;
}

export interface Donation {
  id: string;
  projectId: string;
  amount: number;
  donorAddress: string;
  timestamp: Date;
}
