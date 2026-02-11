/**
 * pi-caffeinate — Prevent macOS idle sleep while the agent is working.
 *
 * Spawns `caffeinate -i` on agent_start and kills it on agent_end
 * (and session_shutdown as a safety net). The -i flag creates a
 * "prevent user idle system sleep" assertion, which keeps the CPU
 * and network stack alive. This is the minimum needed to stop
 * WireGuard-based VPNs (e.g. Netbird) from dropping their
 * tunnel when the machine would otherwise idle-sleep.
 *
 * Display sleep and lid-close sleep are left alone — only the
 * idle-sleep timer is suppressed while the agent is active.
 *
 * macOS only — the extension is a no-op on other platforms.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { spawn, type ChildProcess } from "node:child_process";
import { platform } from "node:os";

export default function (pi: ExtensionAPI) {
	if (platform() !== "darwin") return;

	let proc: ChildProcess | null = null;

	function engage(ctx: { ui: { setStatus: (id: string, text: string | undefined) => void; theme: any } }) {
		if (proc) return; // already running
		proc = spawn("caffeinate", ["-i"], {
			stdio: "ignore",
			detached: false,
		});
		proc.unref(); // don't block pi's exit
		proc.on("exit", () => {
			proc = null;
		});
		const theme = ctx.ui.theme;
		ctx.ui.setStatus("caffeinate", theme.fg("dim", "☕ awake"));
	}

	function disengage(ctx: { ui: { setStatus: (id: string, text: string | undefined) => void } }) {
		if (proc) {
			proc.kill("SIGTERM");
			proc = null;
		}
		ctx.ui.setStatus("caffeinate", undefined);
	}

	pi.on("agent_start", async (_event, ctx) => {
		engage(ctx);
	});

	pi.on("agent_end", async (_event, ctx) => {
		disengage(ctx);
	});

	pi.on("session_shutdown", async (_event, ctx) => {
		disengage(ctx);
	});
}
