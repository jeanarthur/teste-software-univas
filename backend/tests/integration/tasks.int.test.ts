import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb, seedMinimal } from './testDb'

describe('Tasks API', () => {
    afterAll(async () => {
        await prisma.$disconnect()
        await appPrisma.$disconnect()
    })
    beforeEach(async () => {
        await resetDb()
    })
    it('POST /api/tasks cria task válida', async () => {
        const { user, category } = await seedMinimal();
        const task = {
            title: "Task Teste",
            description: "Descrição só pra teste",
            status: "PENDING",
            priority: "LOW",
            userId: user.id,
            categoryId: category.id
        }
        const res = await request(app)
            .post('/api/tasks')
            .send(task)
        expect(res.status).toBe(201)
        expect(res.body.data).toMatchObject(task)
    })
    it('PUT /api/tasks atualiza task válida', async () => {
        const { user, category } = await seedMinimal();
        const task = {
            title: "Task Teste",
            description: "Descrição só pra teste",
            status: "PENDING",
            priority: "LOW",
            userId: user.id,
            categoryId: category.id
        }
        const createRes = await request(app)
            .post('/api/tasks')
            .send(task)
        var updatedTask = createRes.body.data
        updatedTask.title = "Task Teste Atualizada"
        const res = await request(app)
            .put(`/api/tasks/${updatedTask.id}`)
            .send(updatedTask)
        const res2 = await request(app).get('/api/tasks')
        expect(res2.status).toBe(200)
        expect(Array.isArray(res2.body.data)).toBe(true)
        expect(res2.body.data.some((u: any) => u.title === updatedTask.title)).toBe(true)
    })
    it('GET /api/tasks lista tasks', async () => {
        const { user, category } = await seedMinimal();
        const task = {
            title: "Task Teste",
            description: "Descrição só pra teste",
            status: "PENDING",
            priority: "LOW",
            userId: user.id,
            categoryId: category.id
        }
        const createRes = await request(app)
            .post('/api/tasks')
            .send(task)
        const res = await request(app).get('/api/tasks')
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body.data)).toBe(true)
        expect(res.body.data.some((u: any) => u.title === task.title)).toBe(true)
    })
    it('DELETE /api/tasks deleta task válida', async () => {
        const { user, category } = await seedMinimal();
        const task = {
            title: "Task Teste",
            description: "Descrição só pra teste",
            status: "PENDING",
            priority: "LOW",
            userId: user.id,
            categoryId: category.id
        }
        const createRes = await request(app)
            .post('/api/tasks')
            .send(task)
        const res = await request(app)
            .delete(`/api/tasks/${createRes.body.data.id}`)
            .send()
        expect(res.status).toBe(204)
    })
})
