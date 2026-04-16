# ============================================
# Supabase Agent Skills - Automated Installation
# ============================================
# This script installs both Supabase Agent Skills automatically
# Run this if the interactive prompt doesn't work
# ============================================

Write-Host "🚀 Musharaka - Supabase Agent Skills Installation" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if npx is available
Write-Host "Checking for Node.js and npm..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js or npm not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Installing Supabase Agent Skills..." -ForegroundColor Yellow
Write-Host ""

# Try to install skills non-interactively
Write-Host "Attempting automated installation..." -ForegroundColor Cyan

# Method 1: Try with --skills flag
$npxOutput = npx skills add supabase/agent-skills --skills supabase,supabase-postgres-best-practices 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Agent Skills installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Installed Skills:" -ForegroundColor Cyan
    Write-Host "  ✓ Supabase - General Supabase guidance" -ForegroundColor Green
    Write-Host "  ✓ Postgres Best Practices - PostgreSQL optimization" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "⚠️  Automated installation encountered issues." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Trying alternative method..." -ForegroundColor Cyan
    Write-Host ""
    
    # Method 2: Install individually
    Write-Host "Installing Supabase skill..." -ForegroundColor Yellow
    npx skills add https://github.com/supabase/agent-skills.git --skill supabase
    
    Write-Host ""
    Write-Host "Installing Postgres Best Practices skill..." -ForegroundColor Yellow
    npx skills add https://github.com/supabase/agent-skills.git --skill supabase-postgres-best-practices
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Agent Skills installed successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Installation failed." -ForegroundColor Red
        Write-Host ""
        Write-Host "Please try manual installation:" -ForegroundColor Yellow
        Write-Host "1. Run: npx skills add supabase/agent-skills" -ForegroundColor White
        Write-Host "2. Press SPACE to select both skills" -ForegroundColor White
        Write-Host "3. Press ENTER to install" -ForegroundColor White
        Write-Host ""
        Write-Host "See MCP_SETUP_GUIDE.md for detailed instructions." -ForegroundColor Cyan
        exit 1
    }
}

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Restart VS Code to load the new configuration" -ForegroundColor White
Write-Host "   Press Ctrl+Shift+P → Type 'Reload Window' → Press Enter" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test the integration by asking your AI assistant:" -ForegroundColor White
Write-Host '   "What tables do I have in my Supabase database?"' -ForegroundColor Gray
Write-Host ""
Write-Host "3. Review the setup guide:" -ForegroundColor White
Write-Host "   MCP_SETUP_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "✨ Your AI assistant now has full context of your Supabase project!" -ForegroundColor Green
Write-Host ""
