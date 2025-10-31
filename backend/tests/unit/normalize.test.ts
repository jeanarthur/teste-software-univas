import { describe, it, expect } from 'vitest'
import { normalizeName } from '../../src/utils/normalize'

describe('canNormalize', () => {
  it('coloca em lowercase', () => {
    expect(normalizeName('TESTE')).toBe('teste')
  })
})