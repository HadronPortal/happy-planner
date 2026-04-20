param(
  [string]$RustDeskExe
)

Add-Type -AssemblyName Microsoft.VisualBasic
Add-Type -AssemblyName System.Windows.Forms
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class WinApi {
  [DllImport("user32.dll")]
  public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);

  [DllImport("user32.dll")]
  public static extern bool SetForegroundWindow(IntPtr hWnd);
}
"@

$workingDir = Split-Path $RustDeskExe -Parent

Start-Process -FilePath $RustDeskExe -WorkingDirectory $workingDir -WindowStyle Normal

Start-Sleep -Milliseconds 2200

[Microsoft.VisualBasic.Interaction]::AppActivate('RustDesk') | Out-Null
Start-Sleep -Milliseconds 700

[System.Windows.Forms.SendKeys]::SendWait('^v')
Start-Sleep -Milliseconds 500

# 8 TABs
1..8 | ForEach-Object {
    [System.Windows.Forms.SendKeys]::SendWait('{TAB}')
    Start-Sleep -Milliseconds 180
}

Start-Sleep -Milliseconds 300
[System.Windows.Forms.SendKeys]::SendWait('{ENTER}')

# espera a sessão abrir
Start-Sleep -Milliseconds 4500

# tenta maximizar todas as janelas do processo rustdesk
Get-Process rustdesk -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.MainWindowHandle -ne 0) {
        [WinApi]::SetForegroundWindow($_.MainWindowHandle) | Out-Null
        Start-Sleep -Milliseconds 200
        [WinApi]::ShowWindowAsync($_.MainWindowHandle, 3) | Out-Null
        Start-Sleep -Milliseconds 200
    }
}

# reforço final: tenta focar por título e maximizar novamente
[Microsoft.VisualBasic.Interaction]::AppActivate('RustDesk') | Out-Null
Start-Sleep -Milliseconds 300

Get-Process rustdesk -ErrorAction SilentlyContinue | Sort-Object StartTime -Descending | Select-Object -First 1 | ForEach-Object {
    if ($_.MainWindowHandle -ne 0) {
        [WinApi]::SetForegroundWindow($_.MainWindowHandle) | Out-Null
        Start-Sleep -Milliseconds 200
        [WinApi]::ShowWindowAsync($_.MainWindowHandle, 3) | Out-Null
    }
}