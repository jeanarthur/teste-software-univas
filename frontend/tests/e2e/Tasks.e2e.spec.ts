import { test, expect } from '@playwright/test'
test.describe('Tarefas', () => {

    test('navega para Tarefas e lista itens do backend', async ({ page }) => {
        await page.goto('/') // Dashboard
        await page.getByRole('link', { name: 'Tarefas' }).click()
        // Título da seção
        await expect(page.getByRole('heading', { name: /Tarefas/i })).toBeVisible()
        // Titulo e Usuário semeados (seed do backend)
        await expect(page.getByText(/Update resume/i).first()).toBeVisible()
        await expect(page.getByText(/John Doe/i).first()).toBeVisible()
    });

    test('cria tarefa e aparece na lista', async ({ page }) => {
        await page.goto('/tasks')
        await page.getByRole('button', { name: /Adicionar Tarefa/i }).click()
        const task = { 
            title: `TaskTeste_${Date.now()}`, 
            description: `DescTeste_${Date.now()}`,
            user: { index: 1 },
            category: { index: 1 }
        }
        await page.getByLabel('Título:').fill(task.title)
        await page.getByLabel('Descrição:').fill(task.description)
        await page.getByLabel('Usuário:').selectOption(task.user)
        await page.getByLabel('Categoria:').selectOption(task.category)
        await page.getByRole('button', { name: /Criar/i }).click()
        // Aguarda recarga da lista
        await expect(page.getByText(task.title)).toBeVisible()
    });

    test('atualiza tarefa e aparece na lista', async ({ page }) => {
        await page.goto('/tasks')
        await page.getByRole('button', { name: /Editar/i }).first().click()
        const task = { 
            title: `TaskTesteAtualizado_${Date.now()}`, 
            description: `DescTesteAtualizado_${Date.now()}`,
            user: { index: 1 },
            category: { index: 1 }
        }
        await page.getByLabel('Título:').fill(task.title)
        await page.getByLabel('Descrição:').fill(task.description)
        await page.getByLabel('Usuário:').selectOption(task.user)
        await page.getByLabel('Categoria:').selectOption(task.category)
        await page.getByRole('button', { name: /Atualizar/i }).click()
        // Aguarda recarga da lista
        await expect(page.getByText(task.title)).toBeVisible()
    });

    test('exluir tarefa e sumir na lista', async ({ page }) => {
        await page.goto('/tasks')

        // cria uma tarefa
        await page.getByRole('button', { name: /Adicionar Tarefa/i }).click()
        const task = { 
            title: `TaskTeste_${Date.now()}`, 
            description: `DescTeste_${Date.now()}`,
            user: { index: 1 },
            category: { index: 1 }
        }
        await page.getByLabel('Título:').fill(task.title)
        await page.getByLabel('Descrição:').fill(task.description)
        await page.getByLabel('Usuário:').selectOption(task.user)
        await page.getByLabel('Categoria:').selectOption(task.category)
        await page.getByRole('button', { name: /Criar/i }).click()
        // Aguarda recarga da lista
        await expect(page.getByText(task.title)).toBeVisible()

        // exclui a tarefa criado
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: /Excluir/i }).first().click()

        // Aguarda recarga da lista
        await expect(page.getByText(task.title)).not.toBeVisible()
    });

});
