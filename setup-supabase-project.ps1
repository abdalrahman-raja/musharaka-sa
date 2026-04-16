# ============================================
# Supabase Setup Script for Musharaka Financial
# ============================================
# This script automates the Supabase CLI setup process
# Run with PowerShell: .\setup-supabase-project.ps1
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Supabase Project Setup" -ForegroundColor Cyan
Write-Host "  Musharaka Financial Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Project Configuration
$PROJECT_REF = "awuqpxwfpsasvuulexdk"
$PROJECT_URL = "https://awuqpxwfpsasvuulexdk.supabase.co"

Write-Host "Project Reference: $PROJECT_REF" -ForegroundColor Yellow
Write-Host "Project URL: $PROJECT_URL" -ForegroundColor Yellow
Write-Host ""

# Step 1: Check if Supabase CLI is installed
Write-Host "[1/5] Checking Supabase CLI installation..." -ForegroundColor Green
try {
    $supabaseVersion = supabase --version 2>&1
    Write-Host "✓ Supabase CLI is installed: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Supabase CLI is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Supabase CLI:" -ForegroundColor Yellow
    Write-Host "  Windows: winget install supabase" -ForegroundColor White
    Write-Host "  Or download from: https://github.com/supabase/cli/releases" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Step 2: Login to Supabase
Write-Host ""
Write-Host "[2/5] Checking Supabase login status..." -ForegroundColor Green
try {
    $loginStatus = supabase status 2>&1
    if ($loginStatus -match "Not logged in") {
        Write-Host "You need to login to Supabase" -ForegroundColor Yellow
        Write-Host "Opening browser for login..." -ForegroundColor Yellow
        supabase login
        Write-Host "✓ Login completed" -ForegroundColor Green
    } else {
        Write-Host "✓ Already logged in to Supabase" -ForegroundColor Green
    }
} catch {
    Write-Host "Checking login status..." -ForegroundColor Yellow
    Write-Host "If not logged in, please run: supabase login" -ForegroundColor Yellow
}

# Step 3: Initialize project (if not already initialized)
Write-Host ""
Write-Host "[3/5] Checking project initialization..." -ForegroundColor Green
if (Test-Path ".\supabase\config.toml") {
    Write-Host "✓ Project already initialized" -ForegroundColor Green
} else {
    Write-Host "Initializing Supabase project..." -ForegroundColor Yellow
    supabase init
    Write-Host "✓ Project initialized" -ForegroundColor Green
}

# Step 4: Link to cloud project
Write-Host ""
Write-Host "[4/5] Linking to cloud project..." -ForegroundColor Green
Write-Host "Project Reference: $PROJECT_REF" -ForegroundColor Cyan
supabase link --project-ref $PROJECT_REF

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Successfully linked to cloud project" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to link project" -ForegroundColor Red
    Write-Host "Please check your internet connection and try again" -ForegroundColor Yellow
    exit 1
}

# Step 5: Verify connection
Write-Host ""
Write-Host "[5/5] Verifying connection..." -ForegroundColor Green
supabase status

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Next steps
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Apply database schema:" -ForegroundColor White
Write-Host "   - Go to: $PROJECT_URL/sql/new" -ForegroundColor Cyan
Write-Host "   - Copy contents of database-schema.sql" -ForegroundColor Cyan
Write-Host "   - Paste and click 'Run'" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Add admin user:" -ForegroundColor White
Write-Host "   Option A (SQL):" -ForegroundColor Gray
Write-Host "   - Use SQL Editor with scripts/add-admin-user.sql" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Option B (Node.js):" -ForegroundColor Gray
Write-Host "   - Run: node scripts/add-admin-user.js" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Test the connection:" -ForegroundColor White
Write-Host "   - Visit: $PROJECT_URL" -ForegroundColor Cyan
Write-Host ""

Write-Host "Admin Credentials (after adding user):" -ForegroundColor Yellow
Write-Host "  Username: WailAdmin1000" -ForegroundColor Cyan
Write-Host "  Password: Zoro232594!@#$" -ForegroundColor Cyan
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  Arabic: SUPABASE_CLI_SETUP_AR.md" -ForegroundColor Cyan
Write-Host "  English: SUPABASE_CLI_SETUP.md" -ForegroundColor Cyan
Write-Host ""

Write-Host "Happy coding! 🚀" -ForegroundColor Green
