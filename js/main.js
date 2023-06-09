const cardholder_text = document.querySelector("span.cardholder")
const card_number_text = document.querySelector("div.card-number")
const card_exp_text = document.querySelector("span.card-exp")
const card_cvc_text = document.querySelector("span.card-cvc")
// Gets the form fields values when user typing.
function onInputEvent(event, callback) {
  let value = event.target.value
  callback(value)
}
// Shows warnings to the users in case their input is wrong.
function setValidInput(isValid, input, p_index) {
  if (isValid) {
    input.classList.remove("invalid-input")
    invalid_inputs_p[p_index].classList.remove("invalid-input")  
  }
  else {
    input.classList.add("invalid-input")
    invalid_inputs_p[p_index].classList.add("invalid-input")
  }
} 
// REFRESH GRAPHICS
const refreshCardholder = value => cardholder_text.innerHTML = value
const refreshCardNumber = value => {
  if (value.length <= 16) card_number_text.innerHTML = value.replace(/(\d{4})/g, "$1 ")
}
const refreshExpDate = (value, input) => {
  const text = card_exp_text.innerHTML
  let length = value.length
  if (length != 2 && length != 0) value = value.replace(/^(\d).*$/, "0$1")
  else if (length == 0) value = "00"
  if (input.name === "exp-month") card_exp_text.innerHTML = text.replace(/(\d{2}\/)/, value + "/")
  else card_exp_text.innerHTML = text.replace(/(\/\d{2})/, "/" + value)
}
const refreshCVC = value => {
  if (value.length <= 4) card_cvc_text.innerHTML = value
}
// /REFRESH GRAPHICS
// VALIDATE USER INPUT
const REGEX = {
  CARDHOLDER: /^[a-zA-Z]+( [a-zA-Z]+)+?$/,
  CARD_NUMBER: /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
  CVC: /^\d{3,4}$/
}
const VALID_INPUTS = {
  CARDHOLDER: null,
  CARD_NUMBER: null,
  EXP_MM: null,
  EXP_YY: null,
  CVC: null,
}
const invalid_inputs_p = document.querySelectorAll("form p")

function validateWithRegExp(value, regex) {
  if (value.match(regex) !== null)
    return value
  return null
}
function validateExpMM(value) {
  value = parseInt(value)
  if (isNaN(value))
    return false
  else if (value <= new Date().getMonth() + 1 || value > 12)
    return false
  
  VALID_INPUTS.EXP_MM = value - 1
  return true
}
function validateExpYY(value) {  
  value = parseInt(value)
  const this_year = new Date().getFullYear() - 2000
  if (isNaN(value))
    return false
  else if (value < this_year || value > this_year + 6)
    return false
  
  VALID_INPUTS.EXP_YY = value + 2000
  return true
}
// /VALIDATE USER INPUT
const inputs = document.querySelectorAll("form .input-field")
inputs.forEach((input) => {
  switch (input.name) {
    case "cardholder":
      input.addEventListener("input", event => {
        onInputEvent(event, value => {
          refreshCardholder(value)
          VALID_INPUTS.CARDHOLDER = validateWithRegExp(value, REGEX.CARDHOLDER)
          setValidInput((VALID_INPUTS.CARDHOLDER != null), input, 0)
        })
      })
      break
    case "card-number":
      input.addEventListener("input", event => {
        onInputEvent(event, value => {
          refreshCardNumber(value)
          VALID_INPUTS.CARD_NUMBER = validateWithRegExp(value, REGEX.CARD_NUMBER)
          setValidInput((VALID_INPUTS.CARD_NUMBER != null), input, 1)
        })
      })
      break
    case "exp-month":
      input.addEventListener("input", event => {
        onInputEvent(event, value => {
          refreshExpDate(value, input)
          setValidInput(validateExpMM(value), input, 2)
        })
      })
      break
    case "exp-year":
      input.addEventListener("input", event => {
        onInputEvent(event, value => {
          refreshExpDate(value, input)
          setValidInput(validateExpYY(value), input, 2)
        })
      })
      break
    case "card-cvc":
      input.addEventListener("input", event => {
        onInputEvent(event, value => {
          refreshCVC(value, input)
          VALID_INPUTS.CVC = validateWithRegExp(value, REGEX.CVC)
          setValidInput((VALID_INPUTS.CVC != null), input, 3)
        })
      })
  }
})
const form = document.getElementById("form-payment")
form.addEventListener("submit", event => {
  event.preventDefault()
  if (VALID_INPUTS.CARDHOLDER != null && VALID_INPUTS.CARD_NUMBER != null && VALID_INPUTS.EXP_MM != null && VALID_INPUTS.EXP_YY != null && VALID_INPUTS.CVC != null) {
    document.querySelectorAll("body>section").forEach((section) => {
      section.classList.add("pass-form")
    })
  } else invalid_inputs_p[4].classList.add("invalid-input")
})
