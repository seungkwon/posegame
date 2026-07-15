param(
  [switch]$FrontendOnly,
  [switch]$BackendOnly
)

$ErrorActionPreference = "Stop"

if ($FrontendOnly -and $BackendOnly) {
  throw "Choose only one of -FrontendOnly or -BackendOnly."
}

function Run-Step {
  param(
    [string]$Name,
    [string]$Command,
    [string]$WorkingDirectory
  )

  Write-Host ""
  Write-Host "==> $Name" -ForegroundColor Cyan
  Push-Location $WorkingDirectory
  try {
    Invoke-Expression $Command
    if ($LASTEXITCODE -ne 0) {
      throw "$Name failed with exit code $LASTEXITCODE."
    }
  } finally {
    Pop-Location
  }
}

$runFrontend = -not $BackendOnly
$runBackend = -not $FrontendOnly

if ($runFrontend) {
  Run-Step -Name "Frontend smoke test" -Command "npm run smoke" -WorkingDirectory "frontend"
  Run-Step -Name "Frontend build" -Command "npm run build" -WorkingDirectory "frontend"
}

if ($runBackend) {
  Run-Step -Name "Backend smoke test" -Command "py -3.9 -m unittest tests.test_smoke" -WorkingDirectory "backend"
}

Write-Host ""
Write-Host "Verification completed successfully." -ForegroundColor Green
