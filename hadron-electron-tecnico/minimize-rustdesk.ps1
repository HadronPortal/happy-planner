Add-Type @"
using System;
using System.Runtime.InteropServices;
public class WinApi {
    [DllImport("user32.dll")]
    public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);
}
"@

$processes = Get-Process rustdesk -ErrorAction SilentlyContinue

foreach ($p in $processes) {
    if ($p.MainWindowHandle -ne 0) {
        [WinApi]::ShowWindowAsync($p.MainWindowHandle, 2) | Out-Null
    }
}