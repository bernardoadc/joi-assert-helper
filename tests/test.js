import test from 'ava'
import chalk from 'chalk'
import Joi from 'joi'

import { config as joiMsgConfig, validate, assert, multiAssert, attempt } from '../index.js'

test('config', function (t) {
  joiMsgConfig({ bullet: '*', color: chalk.blue, titleColor: chalk.purple })

  const output = validate('a', Joi.number().integer().required().label('Value'), 'is wrong.')
  t.is(output, chalk.blue('* "a" is wrong. Value must be a number'))

  joiMsgConfig({ bullet: '*', color: c => c, titleColor: t => t }) // removes colors to simplify further tests
})

test('validate', function (t) {
  t.is(validate(3, Joi.number().integer().required().label('Value')), '')

  const output = validate('a', Joi.number().integer().required().label('Value'), 'is wrong.')
  t.is(output, '* "a" is wrong. Value must be a number')
})

test('assert', function (t) {
  try {
    assert(['D', 'E'], Joi.array().min(1).items(
      Joi.valid('A', 'B', 'C').label('Values')
    ).label('Values'), 'isn\'t known.', 'Error checking values!')
  } catch (e) {
    const output = e.message
    t.is(output, `Error checking values!
* "D" isn't known. Values must be one of [A, B, C]
* "E" isn't known. Values must be one of [A, B, C]`)
  }
})

test('multiAssert', function (t) {
  try {
    multiAssert('Error defining graph!',
      validate('a', Joi.number().integer().required().label('X coordinate')),
      validate('b', Joi.number().integer().required().label('Y coordinate'))
    )
  } catch (e) {
    const output = e.message
    t.is(output, 'Error defining graph!\n* X coordinate must be a number\n* Y coordinate must be a number')
  }
})

test('attempt', function (t) {
  try {
    let x = attempt(3, Joi.number().integer().required().label('Value'), 'is wrong.')
    t.is(x, 3)

    x = attempt('a', Joi.number().integer().required().label('Value'), 'is wrong.') // eslint-disable-line no-unused-vars
  } catch (e) {
    const output = e.message
    t.is(output, '* "a" is wrong. Value must be a number')
  }
})
