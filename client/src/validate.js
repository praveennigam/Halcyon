function cleanName(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function validateName(value) {
  const name = cleanName(value);
  if (!name) return 'Please enter your name.';
  if (name.length < 2) return 'Name looks too short.';
  if (name.length > 80) return 'Name is too long.';
  if (!/^[A-Za-z][A-Za-z .'-]*$/.test(name)) return 'Use letters in your name.';
  return '';
}

function validateEmail(value) {
  const email = String(value || '').trim();
  if (!email) return 'Please enter your email.';
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'That email does not look right.';
  }
  return '';
}

function validatePhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return 'Enter a mobile number.';
  if (!/^[6-9]\d{9}$/.test(digits)) return 'Enter a 10-digit mobile number.';
  return '';
}

export function validateCustomer(customer) {
  return {
    name: validateName(customer.name),
    email: validateEmail(customer.email),
    phone: validatePhone(customer.phone),
  };
}

export function hasErrors(errors) {
  return Boolean(errors.name || errors.email || errors.phone);
}

export function tidyCustomer(customer) {
  return {
    name: cleanName(customer.name),
    email: String(customer.email || '').trim(),
    phone: String(customer.phone || '').replace(/\D/g, ''),
  };
}
