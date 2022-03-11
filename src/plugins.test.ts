import { parseConfiguration } from './plugins'

it('Should parse configuration', () => {
  expect(parseConfiguration(['k1=v1', 'k2=v2'])).toEqual({ k1: 'v1', k2: 'v2' })
  expect(parseConfiguration(['{ "a" : "b" }', 'c.d = e'])).toEqual({ a: 'b', c: { d: 'e' } })
})
