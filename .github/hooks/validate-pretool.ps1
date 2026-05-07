$ErrorActionPreference = 'Stop'

$workspaceRoot = [System.IO.Path]::GetFullPath('C:\Users\Roger.Renjifo\Desktop\agentsDemo\copilotAgents')

function Get-StringValues {
  param([object]$Value)

  if ($null -eq $Value) { return @() }

  if ($Value -is [string]) { return @($Value) }

  if ($Value -is [System.Collections.IDictionary]) {
    $all = @()
    foreach ($k in $Value.Keys) {
      $all += Get-StringValues -Value $Value[$k]
    }
    return $all
  }

  if ($Value -is [psobject]) {
    $all = @()
    foreach ($prop in $Value.PSObject.Properties) {
      $all += Get-StringValues -Value $prop.Value
    }
    return $all
  }

  if ($Value -is [System.Collections.IEnumerable] -and -not ($Value -is [string])) {
    $all = @()
    foreach ($item in $Value) {
      $all += Get-StringValues -Value $item
    }
    return $all
  }

  return @()
}

function Resolve-FileUriToPath {
  param([string]$Raw)

  try {
    $uri = [Uri]$Raw
    if ($uri.Scheme -ne 'file') { return $null }
    return [System.IO.Path]::GetFullPath($uri.LocalPath)
  }
  catch {
    return $null
  }
}

function Is-OutsideWorkspace {
  param([string]$Candidate)

  if ([string]::IsNullOrWhiteSpace($Candidate)) { return $false }

  $trimmed = $Candidate.Trim()

  if ($trimmed -match '(^|\s)\.\.(\\|/)' -or $trimmed -match '(\\|/)\.\.(\\|/|$)') {
    return $true
  }

  if ($trimmed -match '^[a-zA-Z]:\\') {
    $absolute = [System.IO.Path]::GetFullPath($trimmed)
    return -not $absolute.StartsWith($workspaceRoot, [System.StringComparison]::OrdinalIgnoreCase)
  }

  if ($trimmed -match '^file://') {
    $uriPath = Resolve-FileUriToPath -Raw $trimmed
    if ($null -ne $uriPath) {
      return -not $uriPath.StartsWith($workspaceRoot, [System.StringComparison]::OrdinalIgnoreCase)
    }
  }

  if ($trimmed -match '(^|\s)cd\s+\.\.(\\|/|$)' -or $trimmed -match '(^|\s)cd\s+[a-zA-Z]:\\') {
    if ($trimmed -match '(^|\s)cd\s+([a-zA-Z]:\\[^\s]*)') {
      $cdTarget = $Matches[2]
      $absoluteCd = [System.IO.Path]::GetFullPath($cdTarget)
      return -not $absoluteCd.StartsWith($workspaceRoot, [System.StringComparison]::OrdinalIgnoreCase)
    }

    return $true
  }

  return $false
}

function Emit-Allow {
  $output = @{
    hookSpecificOutput = @{
      hookEventName = 'PreToolUse'
      permissionDecision = 'allow'
      permissionDecisionReason = 'Within workspace policy'
    }
  } | ConvertTo-Json -Depth 10 -Compress

  Write-Output $output
  exit 0
}

function Emit-Deny {
  param([string]$Reason)

  $output = @{
    hookSpecificOutput = @{
      hookEventName = 'PreToolUse'
      permissionDecision = 'deny'
      permissionDecisionReason = $Reason
    }
  } | ConvertTo-Json -Depth 10 -Compress

  Write-Output $output
  exit 2
}

try {
  $stdin = [Console]::In.ReadToEnd()
  if ([string]::IsNullOrWhiteSpace($stdin)) {
    Emit-Allow
  }

  $payload = $stdin | ConvertFrom-Json
  $strings = Get-StringValues -Value $payload

  foreach ($text in $strings) {
    if (Is-OutsideWorkspace -Candidate $text) {
      Emit-Deny -Reason "Blocked by repository policy: outside workspace root is not allowed."
    }
  }

  Emit-Allow
}
catch {
  Emit-Deny -Reason "Hook validation error: $($_.Exception.Message)"
}
