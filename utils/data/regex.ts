export const isEmailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isPhoneNumberRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

export const isZipCodeRegex = /^\d{5}(?:[-\s]\d{4})?$/;

export const isInternationalPhoneNumberRegex =
  /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;

export const hasNumberRegex = /[0-9]/;

export const hasSymbolRegex = /[\W_]/;

export const hasCapitalLetterRegex = /[A-Z]/;

export const wordPatternGlobalRegex = /\b\w+\b/g;
