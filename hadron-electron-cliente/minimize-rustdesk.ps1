Add-Type @"
using System;
using System.Runtime.InteropServices;

public class WinApi {
  [DllImport("user32.dll")]
  public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);

  [DllImport("user32.dll")]
  public static extern int GetWindowLong(IntPtr hWnd, int nIndex);

  [DllImport("user32.dll")]
  public static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);
}
"@

$GWL_EXSTYLE = -20
$WS_EX_TOOLWINDOW = 0x00000080
$SW_HIDE = 0

# espera a janela principal nascer
Start-Sleep -Milliseconds 300

Get-Process rustdesk -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.MainWindowHandle -ne 0) {
        try {
            $style = [WinApi]::GetWindowLong($_.MainWindowHandle, $GWL_EXSTYLE)
            [WinApi]::SetWindowLong($_.MainWindowHandle, $GWL_EXSTYLE, ($style -bor $WS_EX_TOOLWINDOW)) | Out-Null
            [WinApi]::ShowWindowAsync($_.MainWindowHandle, $SW_HIDE) | Out-Null
        } catch {}
    }
}