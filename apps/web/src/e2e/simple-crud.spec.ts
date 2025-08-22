import { test, expect } from "@playwright/test";

test.describe("Customer Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Wait for any loading states to clear
    await page.waitForFunction(
      () => {
        const loaders = document.querySelectorAll('[class*="animate-spin"]');
        return loaders.length === 0;
      },
      { timeout: 10000 }
    );
  });

  test("Create, Read, Update, Delete customer", async ({ page }) => {
    // CREATE
    await page.click('button:has-text("Nieuwe klant")');

    // Wait for modal to be visible
    await page.waitForSelector('[role="dialog"]', { state: "visible" });

    // Fill in the form with all required fields
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="lastName"]', "Doe");
    await page.fill('input[name="email"]', "john.doe@example.com");
    await page.fill('input[name="phone"]', "+31612345678");
    await page.fill('input[name="street"]', "Main Street 123");
    await page.fill('input[name="city"]', "Amsterdam");
    await page.fill('input[name="postalCode"]', "1000 AA"); // Dutch format with space
    await page.fill('input[name="country"]', "Netherlands");

    // Submit the form
    await page.click('button:has-text("Klant toevoegen")');

    // Wait for modal to close
    await page.waitForSelector('[role="dialog"]', { state: "hidden" });

    // READ - Verify customer was created
    await expect(page.locator("text=John Doe")).toBeVisible(),
      { timeout: 5000 };

    // READ - View customer details
    await page.click("text=John Doe");
    await expect(page).toHaveURL(/\/customers\/[^\/]+$/);
    await expect(page.locator("text=john.doe@example.com")).toBeVisible();

    // UPDATE
    await page.click('button:has-text("Bewerken")');

    // Wait for edit modal to be visible
    await page.waitForSelector('[role="dialog"]', { state: "visible" });

    // Update the first name
    await page.fill('input[name="firstName"]', "Johnny");

    // Click save and wait for modal to close
    await page.click('button:has-text("Opslaan")');

    // Wait for modal to close with a shorter timeout
    await page.waitForSelector('[role="dialog"]', {
      state: "hidden",
      timeout: 5000,
    });

    // Verify update - check the page title shows the updated name
    await expect(page.locator('h1:has-text("Johnny Doe")')).toBeVisible();

    // DELETE
    await page.click('button:has-text("Verwijderen")');

    // Wait for confirmation dialog
    await page.waitForSelector('[role="dialog"]', { state: "visible" });
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Verwijderen" })
      .click(); // Confirm in dialog

    // Verify deletion and redirect
    await expect(page).toHaveURL("/");
    await expect(page.locator("text=Johnny Doe")).not.toBeVisible();
  });

  test("Search functionality", async ({ page }) => {
    // Create a customer - Wait for the button to be visible and clickable
    await page.waitForSelector('button:has-text("Nieuwe klant")', {
      state: "visible",
      timeout: 5000,
    });
    await page.click('button:has-text("Nieuwe klant")');

    // Wait for modal to be visible
    await page.waitForSelector('[role="dialog"]', { state: "visible" });

    // Fill in the form
    await page.fill('input[name="firstName"]', "Alice");
    await page.fill('input[name="lastName"]', "Smith");
    await page.fill('input[name="email"]', "alice@example.com");
    await page.fill('input[name="phone"]', "+31612345678");
    await page.fill('input[name="street"]', "Test Street 123");
    await page.fill('input[name="city"]', "Amsterdam");
    await page.fill('input[name="postalCode"]', "1000 AA"); // Dutch format with space
    await page.fill('input[name="country"]', "Netherlands");
    await page.click('button:has-text("Klant toevoegen")');

    // Wait for modal to close
    await page.waitForSelector('[role="dialog"]', { state: "hidden" });

    // Wait a moment for the customer to appear
    await page.waitForTimeout(1000);

    // Search for the customer using the correct placeholder
    await page.fill(
      'input[placeholder="Zoek op naam, telefoon of email..."]',
      "Alice"
    );
    await expect(page.locator("text=Alice Smith")).toBeVisible();

    // Search for non-existent customer
    await page.fill(
      'input[placeholder="Zoek op naam, telefoon of email..."]',
      "NonExistent"
    );
    await expect(page.locator("text=Alice Smith")).not.toBeVisible();
  });

  test("Edit form should be pre-filled with customer data", async ({
    page,
  }) => {
    // Create a customer first
    await page.click('button:has-text("Nieuwe klant")');
    await page.waitForSelector('[role="dialog"]', { state: "visible" });

    // Fill in the form
    await page.fill('input[name="firstName"]', "Jane");
    await page.fill('input[name="lastName"]', "Smith");
    await page.fill('input[name="email"]', "jane.smith@example.com");
    await page.fill('input[name="phone"]', "+31612345678");
    await page.fill('input[name="street"]', "Test Street 456");
    await page.fill('input[name="city"]', "Rotterdam");
    await page.fill('input[name="postalCode"]', "2000 AB");
    await page.fill('input[name="country"]', "Netherlands");
    await page.fill('input[name="company"]', "Test Company");
    await page.fill('textarea[name="notes"]', "Test notes");

    await page.click('button:has-text("Klant toevoegen")');
    await page.waitForSelector('[role="dialog"]', { state: "hidden" });

    // View customer details
    await page.click("text=Jane Smith");
    await expect(page).toHaveURL(/\/customers\/[^\/]+$/);

    // Click edit button
    await page.click('button:has-text("Bewerken")');
    await page.waitForSelector('[role="dialog"]', { state: "visible" });

    // Verify that the form is pre-filled with the customer data
    await expect(page.locator('input[name="firstName"]')).toHaveValue("Jane");
    await expect(page.locator('input[name="lastName"]')).toHaveValue("Smith");
    await expect(page.locator('input[name="email"]')).toHaveValue(
      "jane.smith@example.com"
    );
    await expect(page.locator('input[name="phone"]')).toHaveValue(
      "+31612345678"
    );
    await expect(page.locator('input[name="street"]')).toHaveValue(
      "Test Street 456"
    );
    await expect(page.locator('input[name="city"]')).toHaveValue("Rotterdam");
    await expect(page.locator('input[name="postalCode"]')).toHaveValue(
      "2000 AB"
    );
    await expect(page.locator('input[name="country"]')).toHaveValue(
      "Netherlands"
    );
    await expect(page.locator('input[name="company"]')).toHaveValue(
      "Test Company"
    );
    await expect(page.locator('textarea[name="notes"]')).toHaveValue(
      "Test notes"
    );

    // Close the modal
    await page.click('button:has-text("Annuleren")');
    await page.waitForSelector('[role="dialog"]', { state: "hidden" });
  });
});
