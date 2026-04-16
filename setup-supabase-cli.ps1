# ============================================
# Supabase CLI Installation Script
# ============================================
# This script helps you install and set up the Supabase CLI
# Run this script to get started quickly
# ============================================

Write-Host "🚀 Musharaka - Supabase CLI Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js first:" -ForegroundColor Red
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Installing Supabase CLI..." -ForegroundColor Yellow
Write-Host ""

# Install Supabase CLI globally
npm install -g supabase

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Supabase CLI installed successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Verify installation
    Write-Host "Verifying installation..." -ForegroundColor Yellow
    supabase --version
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Login to Supabase:" -ForegroundColor White
    Write-Host "   supabase login" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "2. Initialize in your project:" -ForegroundColor White
    Write-Host '   cd "c:\Users\ALBASHA CENTER\Desktop\مشاريع\musharaka-sa\musharaka-sa"' -ForegroundColor Yellow
    Write-Host "   supabase init" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "3. Link to your project:" -ForegroundColor White
    Write-Host "   supabase link --project-ref awuqpxwfpsasvuulexdk" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "For detailed instructions, see:" -ForegroundColor White
    Write-Host "   SUPABASE_CONNECTION_GUIDE.md" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Installation failed. Try manual installation:" -ForegroundColor Red
    Write-Host ""
    Write-Host "Option 1 - Using winget (Windows):" -ForegroundColor Yellow
    Write-Host "   winget install Supabase.CLI" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2 - Using npm:" -ForegroundColor Yellow
    Write-Host "   npm install -g supabase" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3 - Download from GitHub:" -ForegroundColor Yellow
    Write-Host "   https://github.com/supabase/cli/releases" -ForegroundColor White
    Write-Host ""
}
