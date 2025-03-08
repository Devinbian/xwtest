# Set error action preference
$ErrorActionPreference = "Stop"

# Set input and output directories
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptPath
$InputDir = Join-Path $ProjectRoot "public\images\products\tektronix\img"
$OutputDir = $InputDir
$BgDir = Join-Path $ProjectRoot "public\images\products"

# Start logging
$LogFile = Join-Path $ScriptPath "processing_log.txt"
Start-Transcript -Path $LogFile
Write-Host "[Start] Processing images..." 

try {
    # Check if ImageMagick is installed
    if (-not (Get-Command "magick" -ErrorAction SilentlyContinue)) {
        throw "Error: ImageMagick not found! Please install ImageMagick and add it to system PATH."
    }

    # Check and create output directory
    if (-not (Test-Path -Path $OutputDir)) {
        New-Item -Path $OutputDir -ItemType Directory
        Write-Host "[Info] Created output directory: $OutputDir"
    }

    # Check background image
    $BgPath = Join-Path -Path $BgDir -ChildPath "bg1.png"
    if (-not (Test-Path -Path $BgPath)) {
        throw "Error: Background image bg1.png not found at path: $BgPath"
    }

    # Get all image files
    $ImageFiles = Get-ChildItem -Path $InputDir -Include @("*.jpg", "*.png", "*.webp", "*.avif") -File -Recurse

    if ($ImageFiles.Count -eq 0) {
        Write-Host "[Warning] No image files found in input directory"
        return
    }

    foreach ($file in $ImageFiles) {
        Write-Host "[Processing] $($file.Name)"
        
        $OriginalFile = $file.FullName
        $FileName = $file.Name
        $TmpDir = Join-Path -Path $OutputDir -ChildPath "tmp_$FileName"
        
        # Create temp directory
        if (-not (Test-Path -Path $TmpDir)) {
            New-Item -Path $TmpDir -ItemType Directory | Out-Null
        }
        
        try {
            # Step 1: Trim background
            Write-Host "  [1/3] Trimming background..."
            magick convert "$OriginalFile" -trim +repage "$TmpDir\trimmed.png"
            
            # Step 2: Resize
            Write-Host "  [2/3] Resizing..."
            magick convert "$TmpDir\trimmed.png" -resize 530x "$TmpDir\resized.png"
            
            # Step 3: Composite
            Write-Host "  [3/3] Compositing..."
            magick composite -gravity center "$TmpDir\resized.png" "$BgPath" "$OutputDir\$FileName"
            
            Write-Host "[Success] Processed: $FileName"
        }
        catch {
            Write-Host "[Error] Failed to process: $FileName - $($_.Exception.Message)" -ForegroundColor Red
        }
        finally {
            # Cleanup temp files
            if (Test-Path -Path $TmpDir) {
                Remove-Item -Path $TmpDir -Recurse -Force
            }
        }
    }
}
catch {
    Write-Host "[Error] $($_.Exception.Message)" -ForegroundColor Red
    throw
}
finally {
    Stop-Transcript
    Write-Host "`n[Complete] Log saved to: $LogFile"
    Write-Host "Press any key to continue..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} 