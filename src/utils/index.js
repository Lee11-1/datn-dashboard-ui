export const validators = {
  email: val => {
    const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return email_regex.test(val)
  },
  number: val => {
    if (typeof val === 'string') {
      if (!val.length) return false
      if (isNaN(val)) return false
    }
    return true
  },
  phone: val => {
    const phone_regex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/
    return phone_regex.test(val)
  },
  letters: val => {
    const letters_regex = /^[A-Za-z\s]+$/
    if(val.charAt(0).trim()){
      return letters_regex.test(val)
    }
  },
  condition_ranking: val => {
    const product_list_regex = /(\b, \b)|(\b$)/
    return product_list_regex.test(String(val))
  }
}


export const get_now = () => {
  return moment()
}


export const convert_date_to_string = (date, format) => {
  if (format === 'iso') return date.toISOString()
  return date.utc().format(format)
}