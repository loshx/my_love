$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$nodePath = if ($nodeCommand) { $nodeCommand.Source } else { Join-Path $env:TEMP 'gabi-node-runtime\node.exe' }
if (-not (Test-Path -LiteralPath $nodePath)) {
    throw 'Node.js nu este disponibil. Instaleaza Node.js 22 sau mai nou, apoi ruleaza din nou.'
}
Write-Host 'Site local: http://127.0.0.1:3000. Pentru oprire: Ctrl+C.'
& $nodePath --watch server.mjs
