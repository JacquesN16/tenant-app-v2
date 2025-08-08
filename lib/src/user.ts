export type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type User = {
  // Required fields
  id: string; // A unique identifier is highly recommended
  firstName: string;
  lastName: string;
  email: string;
  token: string;

  // Optional fields
  phone?: string;
  address?: Address;
  avatarUrl?: string;
  propertyIds?: string[]; // To link to the properties they own
  createdAt?: Date;
  updatedAt?: Date;
};
