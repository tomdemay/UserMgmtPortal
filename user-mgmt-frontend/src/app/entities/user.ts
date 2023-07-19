/**
 * @description User entity - represents a user.
 * @property id: number - The id of the user. This is the primary key
 * @property firstName: string - The first name of the user.
 * @property lastName: string - The last name of the user.
 * @property address: string - The address of the user.
 * @property city: string - The city of the user.
 * @property state: string - The state of the user.
 * @property zipCode: string - The zip code of the user.
 * @property phone: string - The phone of the user.
 * @property email: string - The email of the user.
 * @property dob: Date - The dob of the user.
 * @property ssn: string - The ssn of the user.
 * @property picture: string - The picture of the user.
 */
export interface User {
  $id?: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  dob: Date;
  ssn: string;
  picture: string;
}
