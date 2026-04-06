import moment from 'moment'

export const validate_date_format = (value, format) => {
  return moment(value, format, true).isValid()
}

export const change_datetime_format = (string_date, from_format, to_format) => {
  if (!string_date) return null

  let date
  if (from_format === 'iso') {
    date = moment(string_date)
  } else {
    date = moment(string_date, from_format)
  }

  if (to_format === 'iso') {
    return date.format()
  }
  return date.format(to_format)
}

export const object_to_array = (obj, key_field, value_field) => {
  let result = []
  Object.keys(obj).forEach(k => {
    result.push({
      [key_field]: k,
      [value_field]: obj[k]
    })
  })
  return result
}

export const array_to_object = (array, key_field, value_field) => {
  let result = {}
  array.forEach(i => {
    let key = i[key_field]
    if (key) {
      result[key] = i[value_field]
    }
  })
  return result
}

export const validators = {
  star: val => {
    if (typeof val === 'string') {
      if (!val.length) return false
      if (isNaN(val)) return false
      if (val > 5 || val < 0) return false
    }
    return true
  },
  phone: val => {
    let phone_regex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/
    return phone_regex.test(val) || val === null
  },
  place: val => {
    if (val === null) return false
    if (typeof val === 'object') {
      if (!Object.keys(val).length) return false
    }
    return true
  },
  code: val => {
    let code_regex = /^\w{1,64}(?:[,]+\w{1,64})*$/
    return code_regex.test(val)
  }
}
