# pi-caffeinate

A [pi](https://github.com/badlogic/pi) extension that prevents macOS idle sleep while the agent is actively working.

## Why

When macOS idle-sleeps, the network stack goes down. This kills WireGuard/Netbird VPN tunnels, SSH connections, and anything else that depends on persistent network connectivity. If you're running pi over a VPN and walk away while it works, the tunnel can drop mid-task.

## How

The extension spawns `caffeinate -i` when the agent starts processing and kills it when the agent finishes. The `-i` flag creates a `PreventUserIdleSystemSleep` power assertion — the minimum needed to keep the network alive.

- **Display sleep** is unaffected — your screen still dims and sleeps normally.
- **Lid-close sleep** is unaffected — closing the lid still sleeps the machine.
- **Only idle sleep** is suppressed, and only while the agent is actively running (not while waiting for your input).

A `☕ awake` indicator appears in the footer while the assertion is active.

## Install

Symlink into your pi extensions directory:

```bash
ln -s /path/to/pi-caffeinate ~/.pi/agent/extensions/pi-caffeinate
```

Then restart pi or run `/reload`.

## Platform

macOS only. The extension is a no-op on other platforms.
