export const OPTIONS_POINT = {
  '*-*': 'TẤT CẢ',
  '1-10000': 'Từ 1 đến 10.000 điểm',
  '10000-100000': 'Từ 10.000 đến 100.000 điểm',
  '100000-9000000000': 'Từ 100.000 điểm trở lên',
}

export const DEFAULT_ERROR_MESSAGE = 'Hệ thống đang bận vui lòng thực hiện sau'

export const DEFAULT_REFRESH_INFO = 1000 * 60 * 5

export const RULE_PHONE = {
  pattern: /^[0-9]{1,20}$/,
  message: 'Số lưu ký không phù hợp',
}

export const RULE_POINT = {
  pattern: /^[1-9][0-9]{0,14}$/,
  message: 'Điểm tặng không phù hợp',
}

export const RULE_PHONE_OTP = {
  pattern: /^[0-9]{10,15}$/,
  message: 'Số điện thoại không phù hợp',
}

export const RULE_OTP = {
  pattern: /^[0-9]{4,6}$/,
  message: 'Mã OTP không phù hợp',
}
