import { test, expect } from '@playwright/test'
test.describe('Categorias', () => {

    test('navega para Categorias e lista itens do backend', async ({ page }) => {
        await page.goto('/') // Dashboard
        await page.getByRole('link', { name: 'Categorias' }).click()
        // Título da seção
        await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible()
        // Emails semeados (seed do backend)
        await expect(page.getByText(/Study/i)).toBeVisible()
        await expect(page.getByText(/Personal tasks and activities/i)).toBeVisible()
    });

    test('cria categoria e aparece na lista', async ({ page }) => {
        await page.goto('/categories')
        await page.getByRole('button', { name: /Adicionar Categoria/i }).click()
        const category = { name: `Cat.Teste_${Date.now()}`, description: `Desc.Teste_${Date.now()}`}
        await page.getByLabel('Nome:').fill(category.name)
        await page.getByLabel('Descrição:').fill(category.description)
        await page.getByRole('button', { name: /Criar/i }).click()
        // Aguarda recarga da lista
        await expect(page.getByText(category.name)).toBeVisible()
        await expect(page.getByText(category.description)).toBeVisible()
    });

    test('atualiza categoria e aparece na lista', async ({ page }) => {
        await page.goto('/categories')
        await page.getByRole('button', { name: /Editar/i }).first().click()
        const category = { name: `Cat.Teste_${Date.now()}`, description: `Desc.Teste_${Date.now()}`}
        await page.getByLabel('Nome:').fill(category.name)
        await page.getByLabel('Descrição:').fill(category.description)
        await page.getByRole('button', { name: /Atualizar/i }).click()
        // Aguarda recarga da lista
        await expect(page.getByText(category.name)).toBeVisible()
        await expect(page.getByText(category.description)).toBeVisible()
    });

    test('exluir categoria e sumir na lista', async ({ page }) => {
        await page.goto('/categories')

        // cria uma categoria
        await page.getByRole('button', { name: /Adicionar Categoria/i }).click()
        const category = { name: `Cat.Teste_${Date.now()}`, description: `Desc.Teste_${Date.now()}`}
        await page.getByLabel('Nome:').fill(category.name)
        await page.getByLabel('Descrição:').fill(category.description)
        await page.getByRole('button', { name: /Criar/i }).click()
        // Aguarda recarga da lista
        await expect(page.getByText(category.name)).toBeVisible()
        await expect(page.getByText(category.description)).toBeVisible()

        // exclui o usuário criado
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: /Excluir/i }).first().click()
        // Aguarda recarga da lista
        await expect(page.getByText(category.name)).not.toBeVisible()
        await expect(page.getByText(category.description)).not.toBeVisible()
    });

});
