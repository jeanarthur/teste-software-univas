import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb, seedMinimal } from './testDb'

describe('Users API', () => {
    afterAll(async () => {
        await prisma.$disconnect()
        await appPrisma.$disconnect()
    })
    beforeEach(async () => {
        await resetDb()
    })
    it('POST /api/users cria usuário válido', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ name: 'Ana', email: 'ana@ex.com' })
        expect(res.status).toBe(201)
        expect(res.body.data).toMatchObject({ name: 'Ana', email: 'ana@ex.com' })
    })
    it('PUT /api/users atualiza usuário válido', async () => {
        var user = await prisma.user.create({ data: { name: 'Ana', email: 'ana@ex.com' } })
        var updatedUser = { name: 'Anabelle', email: 'anabelle@ex.com' };
        const res = await request(app)
            .put(`/api/users/${user.id}`)
            .send(updatedUser)
        const res2 = await request(app).get('/api/users')
        expect(res2.status).toBe(200)
        expect(Array.isArray(res2.body.data)).toBe(true)
        expect(res2.body.data.some((u: any) => u.email === 'anabelle@ex.com')).toBe(true)
    })
    it('GET /api/users lista usuários', async () => {
        await prisma.user.create({ data: { name: 'Ana', email: 'ana@ex.com' } })
        const res = await request(app).get('/api/users')
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body.data)).toBe(true)
        expect(res.body.data.some((u: any) => u.email === 'ana@ex.com')).toBe(true)
    })
    it('DELETE /api/users deleta usuário válido', async () => {
        var user = await prisma.user.create({ data: { name: 'Ana', email: 'ana@ex.com' } })
        const res = await request(app)
            .delete(`/api/users/${user.id}`)
            .send()
        expect(res.status).toBe(204)
    })
})
