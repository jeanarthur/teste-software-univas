import { test, expect } from '@playwright/test'
test.describe('Usuários', () => {

    test('navega para Usuários e lista itens do backend', async ({ page }) => {
        await page.goto('/') // Dashboard
        await page.getByRole('link', { name: 'Usuários' }).click()
        // Título da seção
        await expect(page.getByRole('heading', { name: /Usuários/i })).toBeVisible()
        // Emails semeados (seed do backend)
        await expect(page.getByText(/john.doe@example.com/i)).toBeVisible()
        await expect(page.getByText(/jane.smith@example.com/i)).toBeVisible()
    });

    test('cria usuário e aparece na lista', async ({ page }) => {
        await page.goto('/users')
        await page.getByRole('button', { name: /Adicionar Usuário/i }).click()
        const uniqueEmail = `aluno.${Date.now()}@ex.com`
        await page.getByLabel('Nome:').fill('Aluno E2E')
        await page.getByLabel('Email:').fill(uniqueEmail)
        await page.getByRole('button', { name: /Criar/i }).click()
        // Aguarda recarga da lista
        await expect(page.getByText(uniqueEmail)).toBeVisible()
    });

    test('atualiza usuário e aparece na lista', async ({ page }) => {
        await page.goto('/users')
        await page.getByRole('button', { name: /Editar/i }).first().click()
        const uniqueEmail = `aluno.${Date.now()}.atualizado@ex.com`
        await page.getByLabel('Nome:').fill('Aluno E2E (Atualizado)')
        await page.getByLabel('Email:').fill(uniqueEmail)
        await page.getByRole('button', { name: /Atualizar/i }).click()
        // Aguarda recarga da lista
        await expect(page.getByText(uniqueEmail)).toBeVisible()
    });

    test('exluir usuário e aparece na lista', async ({ page }) => {
        await page.goto('/users')

        // cria um usuário
        await page.getByRole('button', { name: /Adicionar Usuário/i }).click()
        const uniqueEmail = `aluno.${Date.now()}@ex.com`
        await page.getByLabel('Nome:').fill('Aluno E2E')
        await page.getByLabel('Email:').fill(uniqueEmail)
        await page.getByRole('button', { name: /Criar/i }).click()
        // Aguarda recarga da lista
        await expect(page.getByText(uniqueEmail)).toBeVisible()

        // exclui o usuário criado
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: /Excluir/i }).first().click()
        // Aguarda recarga da lista
        await expect(page.getByText(uniqueEmail)).not.toBeVisible()
    });

});
