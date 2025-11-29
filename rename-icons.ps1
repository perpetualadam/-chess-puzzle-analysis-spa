# PowerShell script to rename downloaded icons to correct format

Write-Host "🎨 Chess PWA Icon Renamer" -ForegroundColor Green
Write-Host ""

$iconsPath = "icons"

# Check if icons folder exists
if (-not (Test-Path $iconsPath)) {
    Write-Host "❌ Icons folder not found!" -ForegroundColor Red
    exit
}

# Get all PNG files in icons folder
$files = Get-ChildItem -Path $iconsPath -Filter "*.png"

Write-Host "Found $($files.Count) PNG files in /icons/ folder" -ForegroundColor Cyan
Write-Host ""

# Expected icon sizes
$sizes = @(16, 32, 72, 96, 128, 144, 152, 192, 384, 512)

foreach ($file in $files) {
    Write-Host "File: $($file.Name)" -ForegroundColor Yellow
    
    # Try to extract size from filename
    if ($file.Name -match '(\d+)x(\d+)') {
        $size = $matches[1]
        $correctName = "icon-${size}x${size}.png"
        
        if ($file.Name -ne $correctName) {
            $newPath = Join-Path $iconsPath $correctName
            
            # Check if target already exists
            if (Test-Path $newPath) {
                Write-Host "  ⚠️  $correctName already exists, skipping..." -ForegroundColor Yellow
            } else {
                Rename-Item -Path $file.FullName -NewName $correctName
                Write-Host "  ✅ Renamed to: $correctName" -ForegroundColor Green
            }
        } else {
            Write-Host "  ✅ Already correct: $correctName" -ForegroundColor Green
        }
    } else {
        Write-Host "  ⚠️  Could not determine size from filename" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Checking for all required icons..." -ForegroundColor Cyan

$missing = @()
foreach ($size in $sizes) {
    $filename = "icon-${size}x${size}.png"
    $filepath = Join-Path $iconsPath $filename
    
    if (Test-Path $filepath) {
        Write-Host "  ✅ $filename" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $filename (MISSING)" -ForegroundColor Red
        $missing += $size
    }
}

Write-Host ""

if ($missing.Count -gt 0) {
    Write-Host "⚠️  Missing $($missing.Count) icon(s): $($missing -join ', ')" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please download these sizes from the icon generator:" -ForegroundColor Cyan
    Write-Host "  http://localhost:8080/simple-icon-generator.html" -ForegroundColor White
} else {
    Write-Host "🎉 All icons present!" -ForegroundColor Green
}

Write-Host ""

