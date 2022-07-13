export enum TRANSACTION_TYPE {
  ACCUMULATE = 'accumulate',
  EXCHANGE = 'exchange',
}

export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum CartType {
  PRODUCT = 'product',
  VOUCHER = 'voucher',
}

export enum VOUCHER_TYPE {
  HOT = 'hot',
  NEW = 'new',
  FREE = 'free',
  ACCUMULATE = 'accumulate',
}

export enum BANNER_ACTION {
  VOUCHER_INFO = 'voucherinfo',
  OPEN_URL = 'openUrl',
  PRODUCT_INFO = 'productinfo',
  REDIRECT = 'redirect',
}

export enum STATE {
  PENDING = 'pending',
  PROCESSING = 'processing',
  DONE = 'done',
  ERROR = 'error',
}

export enum HISTORY_EXCHANGE_TYPE {
  ACCUMULATE = 'accumulate',
  EXCHANGE = 'exchange',
}

export enum MY_VOUCHER_USED {
  USED = 1,
  NOT_USED = 0,
}
