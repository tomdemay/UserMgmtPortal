export const usPhoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;     // (123) 456-7890
// pretty cool regex, huh? I didn't write it. but was so impressed with it I had to use it.
// validates all state abbreviations
export const stateRegex = /^(A[LKZR]|C[AOT]|D[CE]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AT]|[WV]A|W[IY])$/;

export const zipCodeRegex = /^\d{5}$/;   // 5 digits
export const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;  // mm/dd/yyyy
export const ssnRegex = /^(?!0{3})(?!6{3})[0-8]\d{2}-(?!0{2})\d{2}-(?!0{4})\d{4}$/;   // 123-45-6789
export const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;    // http://www.google.com (this is by no means a complete url regex. some are too restrictive)

export const firstNameLength = 50;
export const lastNameLength = 50;
export const addressLength = 100;
export const cityLength = 50;
export const stateLength = 2;
export const emailLength = 100;


