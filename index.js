let bullet = '➤'
let titleColor = t => t
let color = m => m

export function config (options = {}) {
  if (options.bullet) bullet = options.bullet
  if (options.color) color = options.color
  if (options.titleColor) titleColor = options.titleColor
}

function addTitleMsg (titleMsg) {
  return titleMsg ? titleColor(titleMsg) + '\n' : ''
}

export function errorMsg (joiError, mentionWrongValueWith = '') {
  return color(joiError.details // eslint-disable-line curly
    .map(function (d) {
      let msg = bullet + ' '
      if (mentionWrongValueWith) msg += `"${d.context.value}" ${mentionWrongValueWith} ` // mentions specific wrong value
      msg += d.message.replaceAll('"', '') // allows better/custom phrasing

      return msg
    })
    .join('\n')) // aggregate and return string with all error messages
}

const getErrors = (value, schema) => schema.validate(value, { abortEarly: false }).error

export function validate (value, schema, mentionWrongValueWith = '') {
  const errors = getErrors(value, schema)

  if (errors) return errorMsg(errors, mentionWrongValueWith)
  else return ''
}

export function assert (value, schema, mentionWrongValueWith = '', titleMsg = '') {
  const errors = getErrors(value, schema)

  if (errors) throw new Error(addTitleMsg(titleMsg) + errorMsg(errors, mentionWrongValueWith))
}

export function multiAssert (titleMsg = '', ...validates) {
  const errorMsgs = validates.filter(e => !!e).join('\n')

  if (errorMsgs) throw new Error(addTitleMsg(titleMsg) + errorMsgs)
}

export function attempt (value, schema, mentionWrongValueWith = '', titleMsg = '') {
  const errors = getErrors(value, schema)

  if (errors) throw new Error(addTitleMsg(titleMsg) + errorMsg(errors, mentionWrongValueWith))
  else return value
}

export default errorMsg
