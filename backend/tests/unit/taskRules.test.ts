import { describe, it, expect } from 'vitest'
import { canTransition, Status } from '../../src/utils/taskRules'

describe('canTrasition', () => {
  it('impede troca de status', () => {
    expect(canTransition("CANCELLED", "COMPLETED")).toBe(false)
  })
})