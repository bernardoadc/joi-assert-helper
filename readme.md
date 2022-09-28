# Joi Error Msg

> A helper to show Joi errors as nicely formatted strings

[Joi](https://www.npmjs.com/package/joi)'s validation functions retrieve detailed errors when schemas are not validated. But they are not ready to be shown to your users.

- The `validate` function returns error details without throwing:

```js
const { error, value } = Joi.number().integer().validate(5.5)

/*
{
  value: 5.5,
  error: [Error [ValidationError]: "value" must be an integer] {
    _original: 5.5,
    details: [
      {
        message: '"value" must be an integer',
        path: [],
        type: 'number.integer',
        context: { label: 'value', value: 5.5 }
      }
    ]
  }
}
*/
```

- The `assert` function lets you throw errors when a schema is not validated:

```js
Joi.assert(5.5, Joi.number().integer())

/*
Uncaught Error [ValidationError]: "value" must be an integer
    at Object.exports.process (/some/project/node_modules/.pnpm/joi@17.6.0/node_modules/joi/lib/errors.js:193:16)
    at Object.internals.entry (/some/project/node_modules/.pnpm/joi@17.6.0/node_modules/joi/lib/validator.js:153:26)
    at Object.exports.entry (/some/project/node_modules/.pnpm/joi@17.6.0/node_modules/joi/lib/validator.js:27:30)
    at internals.Base.validate (/some/project/node_modules/.pnpm/joi@17.6.0/node_modules/joi/lib/base.js:548:26)
    at Object.internals.assert (/some/project/node_modules/.pnpm/joi@17.6.0/node_modules/joi/lib/index.js:225:27)
    at Object.assert (/some/project/node_modules/.pnpm/joi@17.6.0/node_modules/joi/lib/index.js:102:19) {
  _original: 5.5,
  details: [
    {
      message: '"value" must be an integer',
      path: [],
      type: 'number.integer',
      context: [Object]
    }
  ]
}
*/
```

- The `attempt` function will return value if ok, and throw if not:

```js
const x = Joi.attempt(5.5, Joi.number().integer())

/*
Uncaught Error [ValidationError]: "value" must be an integer
    at Object.exports.process (/some/project/node_modules/.pnpm/joi@17.6.0/node_modules/joi/lib/errors.js:193:16)
    at Object.internals.entry (/some/project/node_modules/.pnpm/joi@17.6.0/node_modules/joi/lib/validator.js:153:26)
    at Object.exports.entry (/some/project/node_modules/.pnpm/joi@17.6.0/node_modules/joi/lib/validator.js:27:30)
    at internals.Base.validate (/some/project/node_modules/.pnpm/joi@17.6.0/node_modules/joi/lib/base.js:548:26)
    at Object.internals.assert (/some/project/node_modules/.pnpm/joi@17.6.0/node_modules/joi/lib/index.js:225:27)
    at Object.assert (/some/project/node_modules/.pnpm/joi@17.6.0/node_modules/joi/lib/index.js:102:19) {
  _original: 5.5,
  details: [
    {
      message: '"value" must be an integer',
      path: [],
      type: 'number.integer',
      context: [Object]
    }
  ]
}
*/
```

## Usage

```js
import Joi from 'joi'
import { validate, assert, multiAssert, attempt } from 'joi-error-msg'

// validate (value, schema, mentionWrongValueWith = '')
// Gets error msg, if any
let errorMsg = validate('a', Joi.number().integer().label('Value')) // use joi's label to define value's name
/* '➤ Value must be a number' */
validate('b', Joi.number().integer().label('Height'), 'is no good!')
/* '➤ "b" is no good! Height must be a number' */

// assert (titleMsg = '', value, schema, mentionWrongValueWith = '', titleMsg = '')
// Throw if error
try {
  const schema = Joi.array().min(1).items(
      Joi.valid('A', 'B', 'C').label('Value')
    ).label('Values')

  l.assert(['D'], schema, '', 'Error checking values!')
} catch (e) {
  console.error(e)
}
/*
Error checking values!
➤ Value must be one of [A, B, C]
*/

// multiAssert (titleMsg = '', ...validates)
// Validate multiple schemas, and throw if any errors
try {
  l.multiAssert('Error defining graph!',
    l.validate('a', Joi.number().integer().required().label('X coordinate')),
    l.validate('b', Joi.number().integer().required().label('Y coordinate'))
  )
} catch (e) {
  console.error(e)
}
/*
Error: Error defining graph!
➤ X coordinate must be a number
➤ Y coordinate must be a number
*/

// attempt (titleMsg = '', value, schema, mentionWrongValueWith = '', titleMsg = '')
try {
  let x = attempt(3, Joi.number().integer().required().label('Value'), 'is wrong.')
  /* x = 3 */

  x = attempt('a', Joi.number().integer().required().label('Value'), 'is wrong.')
} catch (e) {
  console.error(e)
}
/* '➤ "a" is wrong. Value must be a number' */
```

## Advanced usage

The bullets in error list can be configured. E.g.:

```js
import { config as joiMsgConfig } from 'joi-error-msg'

joiMsgConfig({ bullet: '*' })
```

Error messages can be colored with functions. For example, simply use [chalk](https://www.npmjs.com/package/chalk)

```js
import { config as joiMsgConfig } from 'joi-error-msg'
import chalk from 'chalk'

joiMsgConfig({ color: chalk.yellow, titleColor: chalk.red })
```

<div style="font-family: monospace; font-size: small">
<span style="color: red">
Error: Error defining graph!
</span>
<span style="color: yellow">

➤ X coordinate must be a number
➤ Y coordinate must be a number
</span>
</div>

Note that if you already have a Joi error, you could use just the error formatting function:

```js
import Joi from 'joi'
import errorMsg from 'joi-error-msg'
// errorMsg (joiError, mentionWrongValueWith = '')

const { error, value } = Joi.number().integer().validate(5.5)
if (error) console.error(errorMsg(error))
```

## Other projects similar to this

- [joi-summarize](https://www.npmjs.com/package/joi-summarize)
- [joi-error-formatter](https://www.npmjs.com/package/joi-error-formatter)
- [joi-message](https://www.npmjs.com/package/joi-message)
- [make-joiful-errors](https://www.npmjs.com/package/make-joiful-errors)
- [custom-joi-error](https://www.npmjs.com/package/custom-joi-error)
