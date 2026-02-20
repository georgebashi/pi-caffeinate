# pi-caffeinate

A [pi](https://github.com/badlogic/pi) extension that keeps the machine awake while the agent is actively working.

## Why

If you walk away while pi is working, the machine can idle-sleep mid-task. This extension keeps it awake until the agent finishes.

## How

The extension keeps the machine awake when the agent starts processing and lets it sleep again when the agent finishes.

- **Display sleep** is unaffected — your screen still dims and sleeps normally.
- **Lid-close sleep** is unaffected — closing the lid still sleeps the machine.
- **Only idle sleep** is affected, and only while the agent is actively running (not while waiting for your input).

### Platform details

| Platform | Mechanism | Requires |
|----------|-----------|----------|
| **macOS** | Spawns `caffeinate -i` — creates a keep-awake assertion via IOKit | Built-in, nothing extra needed |
| **Linux** | Spawns `systemd-inhibit --what=idle ... sleep infinity` — takes an idle inhibitor lock via logind | `systemd-inhibit` (present on all systemd-based distros). Silently no-ops if unavailable. |
| **Windows** | Spawns a PowerShell process that calls `SetThreadExecutionState(ES_CONTINUOUS \| ES_SYSTEM_REQUIRED)` via kernel32.dll | PowerShell (included in all modern Windows). |

## Install

```bash
pi install npm:pi-caffeinate
```

Then restart pi or run `/reload`.
