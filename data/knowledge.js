// Separate knowledge file to keep openai.js clean
// All extra knowledge is imported from here

const ZEN_KNOWLEDGE = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔫 GUN RECOIL VALUES — WARZONE / BO6
━━━━━━━━━━━━━━━━━━━━━━━━━━━
These are STARTING values — fine tune up/down by 2-3 based on attachments and personal feel.
Test ALWAYS in firing range first. Lower = less compensation, Higher = more.

WARZONE 4 / URZIKSTAN — ASSAULT RIFLES:
- MTZ-556: Vertical 18, Horizontal 4, Delay 45
- MCW: Vertical 16, Horizontal 3, Delay 45
- SVA 545: Vertical 14, Horizontal 5, Delay 40
- RAM-7: Vertical 20, Horizontal 5, Delay 45
- DG-58: Vertical 17, Horizontal 4, Delay 42
- FR 5.56: Vertical 15, Horizontal 6, Delay 40
- Holger 556: Vertical 19, Horizontal 4, Delay 45
- M4: Vertical 16, Horizontal 3, Delay 42

WARZONE 4 — SMGs:
- Rival-9: Vertical 12, Horizontal 3, Delay 35
- HRM-9: Vertical 13, Horizontal 3, Delay 35
- WSP Swarm: Vertical 11, Horizontal 4, Delay 32
- AMR9: Vertical 14, Horizontal 3, Delay 38
- Striker: Vertical 13, Horizontal 3, Delay 36
- Lachmann Sub: Vertical 12, Horizontal 2, Delay 35
- Fennec 45: Vertical 10, Horizontal 4, Delay 30
- Vaznev-9K: Vertical 13, Horizontal 3, Delay 36

WARZONE 4 — LMGs:
- TAQ Eradicator: Vertical 22, Horizontal 5, Delay 50
- Pulemyot 762: Vertical 25, Horizontal 6, Delay 50
- Bruen MK9: Vertical 20, Horizontal 4, Delay 48
- Raal MG: Vertical 24, Horizontal 5, Delay 50

BO6 — ASSAULT RIFLES:
- XM4: Vertical 17, Horizontal 4, Delay 42
- AMES 85: Vertical 16, Horizontal 4, Delay 42
- Model L: Vertical 18, Horizontal 3, Delay 43
- GPR 91: Vertical 19, Horizontal 4, Delay 44
- AS VAL: Vertical 15, Horizontal 5, Delay 40
- AK-74: Vertical 20, Horizontal 5, Delay 45
- Goblin MK2: Vertical 16, Horizontal 3, Delay 41

BO6 — SMGs:
- C9: Vertical 12, Horizontal 3, Delay 34
- KSV: Vertical 13, Horizontal 3, Delay 35
- Jackal PDW: Vertical 11, Horizontal 4, Delay 32
- PP-919: Vertical 12, Horizontal 3, Delay 33
- Tanto .22: Vertical 10, Horizontal 3, Delay 30
- Marine SP: Vertical 13, Horizontal 4, Delay 35

BO6 — LMGs:
- PU-21: Vertical 23, Horizontal 5, Delay 50
- XMG: Vertical 22, Horizontal 4, Delay 48

R6 SIEGE — NO RECOIL VALUES (per operator/gun):
Note: R6 recoil is very different per gun — these are base values, adjust per gun profile in OLED
- AR general: Vertical 22, Horizontal 6, Delay 50
- SMG general: Vertical 18, Horizontal 5, Delay 45
- LMG general: Vertical 26, Horizontal 7, Delay 55
- Shotgun: No anti-recoil needed
- Pistol: Vertical 10, Horizontal 2, Delay 30
- High recoil ARs (Ash R4-C, Sledge L85): Vertical 28, Horizontal 8, Delay 52
- Low recoil ARs (Iana ARX): Vertical 16, Horizontal 4, Delay 45
- Jäger ADS: Vertical 20, Horizontal 5, Delay 48

APEX LEGENDS — RECOIL (DEX RECOIL values):
- R-301: Vertical 14, Horizontal 3, Delay 38
- Flatline: Vertical 20, Horizontal 6, Delay 45
- Hemlok (auto): Vertical 16, Horizontal 4, Delay 40
- Spitfire: Vertical 22, Horizontal 5, Delay 50
- Devotion: Vertical 18, Horizontal 4, Delay 42
- R-99: Vertical 11, Horizontal 3, Delay 32
- Volt: Vertical 12, Horizontal 3, Delay 33
- Alternator: Vertical 13, Horizontal 4, Delay 35
- Prowler (auto): Vertical 14, Horizontal 3, Delay 36
- CAR: Vertical 11, Horizontal 3, Delay 32
- Nemesis: Vertical 17, Horizontal 4, Delay 42

RECOIL TUNING GUIDE:
- Bullets going DOWN too much = over-compensating → lower vertical by 3-5
- Bullets still going UP = under-compensating → raise vertical by 3-5
- Bullets drifting LEFT/RIGHT = adjust horizontal (keep under 8)
- Different barrel attachments change recoil — retune when changing loadout
- Suppressors usually reduce recoil slightly — may need to lower values 2-3
- Extended mags increase recoil at end of mag — test full mag not just first few shots

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📟 OLED MENU — FULL WALKTHROUGH
━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCESSING OLED:
- Press the small side button on the Cronus Zen device once
- Screen lights up showing current slot and active script name
- Navigate with: D-pad UP/DOWN to scroll, RIGHT to enter, LEFT to go back
- Some scripts use the left stick to navigate instead of D-pad
- Press side button again to exit and save changes

OLED MENU STRUCTURE (most D3TX scripts):
Main Menu
├── MOD SELECT — toggle individual mods on/off
│   ├── Anti-Recoil → ON/OFF + strength value
│   ├── Aim Assist → ON/OFF + type (Sticky/Polar/Head)
│   ├── Rapid Fire → ON/OFF + speed value
│   ├── Drop Shot → ON/OFF + sensitivity
│   ├── Auto Slide → ON/OFF
│   ├── Jump Shot → ON/OFF
│   └── [other mods depending on script]
├── WEAPON PROFILE — select current weapon for optimized settings
│   ├── Profile 1-8 (each stores different recoil values)
│   └── Custom Profile — enter manual values
├── SETTINGS
│   ├── Controller Type (PS/Xbox/MNK)
│   ├── Button Layout (Default/Tactical/Bumper Jumper etc)
│   ├── Deadzone (0-20, default 5)
│   └── Vibration ON/OFF
└── INFO — script version, D3TX branding

SAVING CHANGES:
- Changes auto-save when you exit menu
- To reset to defaults: hold side button for 3 seconds
- Slot-specific: each slot saves its own OLED settings independently

COMMON OLED ISSUES:
- Screen blank/off: firmware needs update OR script not loaded properly
- Can't navigate: try D-pad AND left stick, varies per script
- Settings reset after unplug: hold settings properly before unplugging
- Values not applying: make sure you exit menu fully before testing in game
- OLED showing wrong slot: press slot button to cycle to correct slot first

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CRONUS ZEN ERROR CODES & FIXES
━━━━━━━━━━━━━━━━━━━━━━━━━━━
LED COLOR MEANINGS:
- Solid GREEN: Script active and working normally
- Solid BLUE: Device connected, no script loaded / in Bluetooth mode
- Solid RED: Authentication error / controller not recognized
- Flashing GREEN: Waiting for controller input / authentication
- Flashing RED: Critical error — needs restart
- Flashing YELLOW/ORANGE: Firmware update mode OR USB issue
- PURPLE: MNK/adapter mode active
- OFF: No power / not connected

ZEN STUDIO ERROR MESSAGES:

"Device Not Found":
1. Try different USB cable — must be DATA cable not charge-only
2. Try all USB ports on your PC one by one
3. Uninstall Zen Studio completely → reinstall from zendesign.com
4. Check Windows Device Manager → look for unknown devices with yellow !
5. If yellow ! present: right click → Update Driver → Search automatically
6. Disable antivirus temporarily — sometimes blocks driver
7. Try different PC if possible to isolate issue

"Authentication Failed" (solid RED LED):
1. Unplug controller from Zen → wait 5 sec → replug
2. Hold PS/Xbox button on controller for 5-8 seconds
3. PS5 specific: Settings > Accessories > USB Communication Speed > Full Speed
4. Try a different controller
5. Use a different USB cable between controller and Zen
6. If PS5: make sure controller is set as primary/authenticated first without Zen

"Script Write Failed":
1. Check USB connection between Zen and PC
2. Try clicking Write to Zen again
3. Check for syntax errors in script (red underlines in editor)
4. Free up a script slot — all 8 may be full
5. Restart Zen Studio and try again
6. If still failing: Factory Reset in Zen Studio > Device > Factory Reset (will wipe all slots)

"Firmware Update Failed":
1. Use a different USB cable
2. Make sure PC doesn't go to sleep during update
3. Disable antivirus
4. If Zen gets stuck in update mode (flashing yellow): hold side button + slot button together for 10 sec to force restart

"Controller Not Supported":
1. Some newer controllers need latest firmware
2. Update firmware: Zen Studio > Device > Firmware Update
3. Try a different/older controller temporarily
4. Check zendesign.com for controller compatibility list

INPUT LAG ERROR (not a code but common issue):
- Cause: Bluetooth, wrong USB mode, or long cable
- Fix: Switch to USB → PS5 set USB to Full-Speed → cable under 3ft → front USB port

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️ ZEN STUDIO — COMPLETE GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERFACE OVERVIEW:
- Top bar: Connect/Disconnect, Device status, Firmware version
- Left panel: Script slots 1-8 (click to select active slot)
- Main area: Script editor (GPC code) OR GamePack view
- Bottom: Output console (shows errors and write confirmations)
- Tabs: Script Editor | GamePack Library | Remapper | Device Settings

SCRIPT SLOTS:
- Zen holds 8 slots simultaneously
- Each slot is independent — different script, different settings
- Click a slot number in left panel to select it
- Click Write to Zen button to save current editor content to selected slot
- Slot button on physical Zen device cycles through loaded slots
- To clear a slot: select it → delete all code → Write to Zen

GAMEPACK LIBRARY:
- Click GamePack Library tab
- Search game name in search box
- Click a pack → Install → wait for download
- Double-click installed pack to open it
- Configure settings on right panel (sliders, checkboxes)
- Click Write to Zen to save to current slot
- GamePacks auto-update — check Library for updates regularly

REMAPPER TAB:
- Remap any button to any other button
- Useful for: swapping jump/crouch, Bumper Jumper layout, Tactical layout
- Changes stack ON TOP of scripts
- Can set per-slot remaps
- Reset: click Clear All Remaps

DEVICE SETTINGS:
- Output Protocol: Auto (leave this), or manually set PS4/PS5/Xbox
- BT Mode: Enable Bluetooth pairing from here
- Factory Reset: wipes ALL slots and settings (last resort)
- Serial Number: shown here for warranty/support

GPC SCRIPT EDITOR:
- Language is C-like, similar to Arduino
- main() runs constantly in a loop
- init() runs once at startup
- Key functions:
  - get_val(button) — reads input 0-100
  - set_val(button, value) — sets output
  - combo_run(combo_name) — triggers a combo
  - wait(ms) — pauses execution
- Button constants: PS4_CROSS, PS4_R2, XB1_A, XB1_RT etc
- Always click Compile first before Write to Zen
- Errors show in bottom console with line numbers

ZEN STUDIO SETTINGS (File > Preferences):
- Theme: Light/Dark
- Auto-connect: connects Zen when plugged in automatically
- Auto-backup: saves script backups locally
- Font size: increase for easier reading
- Default slot: which slot opens on connect

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 PS5 vs XBOX — SPECIFIC DIFFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━
PS5 SPECIFIC:
- MUST set USB Communication Speed to Full-Speed (Settings > Accessories)
- Use front USB-A port (not back, not USB-C)
- PS5 requires DualShock 4 or DualSense connected to Zen
- DualSense works wired only with Zen (no wireless)
- If PS5 goes to rest mode: Zen loses auth — have to re-authenticate
- PS5 4.0+ update: sometimes resets USB speed setting — recheck after updates
- Some PS5 games (like Warzone) use different aim assist than PS4 version
- Button names: Cross/Circle/Square/Triangle/L2/R2/L3/R3/Options/Share/Touchpad

XBOX SERIES X/S SPECIFIC:
- Xbox is generally more plug-and-play than PS5
- Use wired Xbox One controller for best compatibility (Series controller works too)
- No special USB speed settings needed
- Xbox has slightly different aim assist behavior than PS — values may need adjusting
- Some scripts have separate PS/Xbox modes — make sure correct mode selected in OLED
- Button names: A/B/X/Y/LT/RT/LB/RB/LS/RS/Menu/View

PS4 vs PS5 SCRIPT DIFFERENCES:
- Most D3TX scripts work on both but set Output Protocol correctly in Zen Studio
- PS5 aim assist is generally stronger — you may need lower AA values
- PS4 scripts on PS5: set Output Protocol to PS4 mode in Zen Studio

CONTROLLER DEADZONE DIFFERENCES:
- PS5 DualSense has lower natural deadzone than Xbox
- If script feels over-sensitive on PS5: raise deadzone in OLED by 2-3
- If script feels sluggish on Xbox: lower deadzone in OLED by 2-3

GENERAL TIPS PS vs XBOX:
- PS5 gets more controller interference → use USB not Bluetooth
- Xbox handles multiple USB devices better
- PS5 is stricter about authentication — if Zen disconnects need full re-auth
- Xbox re-auths faster after disconnect

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 SCRIPT SLOTS — LOADING & SWITCHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW SLOTS WORK:
- Zen has 8 slots (1-8)
- Each slot can hold a completely different script/GamePack
- Slots are independent — settings and scripts don't affect each other
- All 8 slots are active simultaneously — you just switch between them

LOADING A SCRIPT TO A SLOT:
1. Open Zen Studio
2. Click the slot number (1-8) in left panel
3. Either: paste GPC code in editor OR load a GamePack
4. Click Write to Zen
5. Confirmation shows in bottom console: "Write successful"
6. Repeat for other slots if needed

SWITCHING SLOTS IN GAME:
- Press the physical slot button on Zen device
- One press = advance to next loaded slot
- Cycles 1→2→3...8→1
- OLED shows current slot number
- Slot LED changes color per slot (green=1, blue=2, red=3 etc on some firmware)
- No need to pause game — switch is instant

RECOMMENDED SLOT SETUP FOR D3TX:
Slot 1: Warzone/main game script
Slot 2: BO6 script
Slot 3: R6 script
Slot 4: Fortnite script
Slot 5: Apex script
Slot 6: MNK layout (if using)
Slot 7: Backup/test script
Slot 8: Empty/spare

CLEARING A SLOT:
- Select slot in Zen Studio
- Delete all code in editor
- Click Write to Zen (writes empty script)
- Slot is now empty

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ ANTI-CHEAT INFO — WHAT ZEN CAN/CAN'T DO
━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW CRONUS ZEN WORKS (why it's hard to detect):
- Zen operates at hardware level — emulates a standard controller
- To the console/PC it looks like a normal wired controller
- No software is installed on the console/PC — nothing to scan
- Works purely through USB HID protocol (same as any controller)

GAME-SPECIFIC ANTI-CHEAT STATUS:

WARZONE / BO6 (Ricochet anti-cheat):
- Ricochet runs on PC and monitors kernel-level input patterns
- Console: Very low detection risk — Ricochet less aggressive on console
- PC via Zen: Moderate risk if using extreme values (rapid fire too fast, recoil too perfect)
- Recommended: keep anti-recoil subtle, don't use max rapid fire speed
- Bans from Warzone are usually for stat anomalies, not Zen detection directly
- D3TX scripts are built to stay within detection thresholds

FORTNITE:
- EasyAntiCheat on PC — does NOT scan controller hardware
- Console: essentially no detection risk
- PC: Safe to use Zen, EAC doesn't flag controller input patterns
- Extreme rapid fire on PC could flag stat-based detection but rare

APEX LEGENDS:
- EasyAntiCheat — same as Fortnite, hardware level safe
- Console: No detection risk
- D3TX Apex script built specifically to avoid pattern detection

R6 SIEGE (BattlEye):
- BattlEye scans PC software/memory — not controller hardware
- Console: No detection risk
- PC via Zen: Safe — BattlEye doesn't flag controller emulation
- However: Ubisoft uses manual review for stat anomalies

NBA 2K:
- No significant anti-cheat — minimal risk
- Online ranked: score anomalies can trigger manual review

WHAT COULD CAUSE A BAN (NOT Zen itself):
- Using extreme values that create impossible human stats
- Rapid fire faster than humanly possible on semi-auto
- Perfect zero-recoil on every single shot consistently
- Scripted behavior that's statistically impossible (e.g. 100% accuracy every game)

HOW D3TX SCRIPTS ARE BUILT TO AVOID THIS:
- Values tuned to stay within human performance range
- Slight randomization built into some mods
- Recoil compensation is subtle, not perfect
- Scripts updated after game patches to maintain safety

IMPORTANT DISCLAIMER TO SHARE WITH USERS:
No script is 100% guaranteed ban-proof forever. Game anti-cheats update constantly.
D3TX updates scripts to keep them safe, but always use reasonable values and don't go extreme.
`;

// ── APPENDED FROM PDF AUDIT ──────────────────────────

const ZEN_ADVANCED_KNOWLEDGE = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔌 CRONUS ZEN PORTS — PROG vs CONSOLE/PC
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Zen has TWO different USB connections — people mix these up constantly:

PROG port (labeled PROG):
- Used ONLY to connect Zen to your PC/Zen Studio
- Used for: programming scripts, loading GamePacks, updating firmware, configuring settings
- This port does NOT carry controller signal to console
- Keep this unplugged when gaming — it's only for setup

CONSOLE/PC port (labeled CONSOLE or PC):
- Used to connect Zen to your PS5/Xbox/PC for actual gaming
- This is the live signal path — controller → Zen → Console
- Also used for entering Zen Bootloader mode during firmware updates
- This is the port you use every gaming session

COMMON MISTAKE: User plugs Zen into PC via CONSOLE port and wonders why Zen Studio doesn't detect it.
FIX: Use the PROG port to connect to Zen Studio. Use CONSOLE port when plugged into your console.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 FIRMWARE UPDATE — FULL PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
NORMAL UPDATE (via Zen Studio):
1. Connect Zen to PC via PROG port
2. Open Zen Studio
3. Go to Device > Firmware Update > Online Firmware Update
4. Follow prompts — DO NOT unplug during update
5. Zen restarts automatically when done

MANUAL BOOTLOADER METHOD (if Zen Studio can't find device):
1. Connect Zen to PC via CONSOLE/PC port (not PROG)
2. Hold the blue reset button on the Zen until OLED displays "Zen Bootloader"
3. Now open Zen Studio → Device > Firmware Update
4. Or use the official web updater at cronusmax.com (works in Chrome/Edge only)
5. DO NOT unplug during update

FIRMWARE 0.0.0 ERROR (after interrupted/failed update):
This means the firmware got corrupted during update.
Fix:
1. Enter Zen Bootloader mode (hold blue reset button + CONSOLE/PC port to PC)
2. Use Zen Studio Online Firmware Update to reflash
3. If Zen Studio doesn't see it: use the official web update tool in Chrome
4. Zen will recover — this is not permanent damage

CURRENT VERSIONS (as of latest docs):
- Zen Studio: v1.6.1 Build 82
- Zen Firmware: v2.2.14
Always keep both updated to latest versions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 PLATFORM SETUP — MISSING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
PS4 PRO SPECIFIC:
- Front USB ports on PS4 Pro may NOT supply enough power for Zen
- Always use the REAR USB port on PS4 Pro
- If Zen randomly disconnects on PS4 Pro: switch to rear port immediately

NINTENDO SWITCH SETUP:
1. Go to Switch System Settings > Controllers and Sensors
2. Enable "Pro Controller Wired Communication" — this is REQUIRED
3. Connect Zen to Switch dock via USB
4. Docked mode: may require the 15V power supply for reliable operation
5. Handheld mode: requires a USB-C OTG adapter (sold separately)
6. Switch Lite: needs USB-C OTG adapter always

NINTENDO SWITCH SETUP:
1. Go to Switch System Settings > Controllers and Sensors
2. Enable "Pro Controller Wired Communication" — this is REQUIRED or Zen won't work
3. Connect Zen to Switch dock via USB
4. Docked mode: may need the 15V power supply for stable operation
5. Handheld mode: requires a USB-C OTG adapter (sold separately)
6. Switch Lite: always needs USB-C OTG adapter

SWITCH CONTROLLER PAIRING:
- Switch controllers pair via Bluetooth to the Zen
- Go to Zen Studio > Device > Bluetooth to pair

PS5 SYSTEM UPDATE WARNING:
A PS5 system update in early 2024 temporarily blocked Cronus Zen connectivity.
If Zen stops working after a PS5 update: check zendesign.com for a firmware patch.
D3TX will announce workarounds in Discord when this happens.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖱️ MAX MAPPER — CONTROLLER SHAPING TOOL
━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAX Mapper is a GUI tool inside Zen Studio for shaping analog inputs WITHOUT writing code.
Access: Zen Studio > MAX Mapper tab

ADJUSTABLE PARAMETERS:
Left Stick / Right Stick (each has):
- Size: shapes the outer radial boundary — affects diagonal reach
- X Sensitivity / Y Sensitivity: how fast the stick responds (higher = faster/more aggressive)
- X Deadzone / Y Deadzone: inner dead zone size — higher = more center "dead" area
- X Midpoint / Y Midpoint: splits stick into two sensitivity zones (low/high)
  - Below midpoint = first sensitivity zone
  - Above midpoint = second zone (higher multiplier kicks in)
  - Default midpoint: 50%

Triggers:
- Sensitivity: how quickly trigger reaches max output (higher = activates faster with less pull)

WHEN TO USE MAX MAPPER:
- Stick feels jittery at center → increase Deadzone by 2-5
- Stick feels sluggish/unresponsive → lower Deadzone
- Want faster initial movement but fine aim at low stick → adjust Midpoint
- Diagonals feel inconsistent → adjust Size
- Trigger feels too sensitive or not sensitive enough → adjust Trigger Sensitivity

SENSITIVITY MULTIPLIER VALUES:
- 100 = 1.0x (normal, no change)
- 80 = 0.8x (slower, more precise)
- 120 = 1.2x (faster, more aggressive)
- 140 = 1.4x (very aggressive)

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 GPC ADVANCED FUNCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTROLLER VALUE RANGES (critical for understanding scripts):
- Buttons: 0 (not pressed) or 100 (pressed) — no in-between
- Triggers: 0 to 100 (gradual, 0=not pressed, 100=fully pressed)
- Stick axes: -100 to +100 (negative = left/down, positive = right/up)
This is why stick scripts look different from button scripts — they work with signed values.

SENSITIVITY FUNCTION:
sensitivity(axis_id, midpoint, multiplier)
- midpoint: percentage that splits low/high sensitivity zones (default 50)
- multiplier: percentage multiplier (100=1x, 140=1.4x, 80=0.8x)
- Example: sensitivity(XB1_RX, 50, 120) → normal center feel, 20% faster at edge

DEADZONE FUNCTION:
deadzone(x_axis, y_axis, inner_dz, ...)
- Removes stick jitter in center dead zone
- Console default deadzone is approximately 20%
- Supports square or circular deadzone shape
- Example: deadzone(XB1_RX, XB1_RY, 10, 10) → 10% inner deadzone on right stick

STICKIZE FUNCTION:
stickize(x_axis, y_axis, radius)
- Outer deadzone / radial shaping
- Shapes diagonal reach to prevent over-extension
- Radius recommendations vary by console — PS ~65, Xbox ~70

EVENT DETECTION:
event_press(button) — returns TRUE only on the single frame the button is first pressed
event_release(button) — returns TRUE only on the single frame the button is released
Use these instead of get_val() when you only want to trigger something ONCE per press, not hold.
Example: toggle a mod on/off with one press instead of it firing every frame

GET_PTIME FUNCTION:
get_ptime(button) — returns milliseconds since the button's state last changed
Use for "hold for X ms" logic:
Example: if(get_ptime(PS4_R2) > 500) → trigger something after holding R2 for 500ms

GPC SCRIPT STRUCTURE (up to 9 sections in order):
1. define — constants (define MY_VAL = 15)
2. data — arrays
3. const — constant arrays
4. remap — button remapping (applied AFTER main executes)
5. int/bool — variable declarations (must be before init/main)
6. init { } — runs ONCE at startup
7. main { } — runs in a LOOP continuously (REQUIRED)
8. combo name { } — timed sequences using wait(ms)
9. function name() { } — reusable functions

IMPORTANT: remap section applies AFTER main finishes. Write script logic against original button IDs.

KEYBOARD SHORTCUTS IN ZEN STUDIO:
- F7 = Compile only (check for errors without running)
- F5 = Build and Run (compile + load to device RAM for immediate testing)
- Use F5 + Device Monitor for fast iteration when tweaking scripts

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DEVICE MONITOR — PERFORMANCE GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Access: Zen Studio > Device Monitor tab

WHAT IT SHOWS:
- Input values: real-time reading of every button/stick/trigger input from your controller
- Output values: what the Zen is sending to the console after script processing
- CPU Load: how hard the Zen VM is working (KEEP BELOW 80%)
- VM Speed: how fast the main loop runs (default 10ms, range 1ms-40ms)
- Trace fields: variable values you can log from your script for debugging

CPU LOAD RULES:
- Below 60%: great, plenty of headroom
- 60-80%: acceptable, monitor it
- Above 80%: DANGER — causes output lag, script behaves inconsistently
- If CPU load is high: simplify script, reduce combo complexity, increase VM speed

VM SPEED:
- Default: 10ms (main loop runs every 10ms = 100 times per second)
- Lower = faster loop = more responsive but more CPU load
- Higher = slower loop = less CPU load but less responsive
- For most D3TX scripts: keep at default 10ms
- If experiencing lag: try increasing to 15-20ms

TRACE FIELDS:
In your GPC script: set_val(TRACE_1, my_variable) — shows value in Device Monitor
Useful for: checking if a mod is triggering, seeing actual input values, debugging logic

━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 PERSISTENT VARIABLES (PVAR/SPVAR)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
These save settings to EEPROM so they survive power off:

PVAR (global persistent variables):
- 16 available total
- Shared ACROSS all slots
- Use for settings that should apply everywhere

SPVAR (slot private persistent variables):
- 64 available per slot
- Private to each individual slot
- Use for per-script settings (e.g. recoil value for this specific script)

ACCESS FUNCTIONS:
get_pvar(SPVAR_1, min, max, default) — read saved value with bounds
set_pvar(SPVAR_1, value) — write value to storage

IMPORTANT: Never call set_pvar() every main loop — it wears out EEPROM.
Always gate writes behind event_press() or a state change.
Reads in init{} are safe — init runs only once.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ MOUSE & KEYBOARD EXTRA NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━
MOUSE DPI WARNING:
- PMW3360 sensor (common in gaming mice) has smoothing applied above ~2000 DPI
- This smoothing can interfere with Zen's input processing
- Recommended DPI range: 800-1600 DPI for most D3TX MNK layouts
- If mouse feels laggy or floaty at high DPI: lower DPI to 1600 and test

BIOS MODE FOR KEYBOARDS:
- Some keyboards need to be switched to "BIOS mode" to be detected by Zen
- BIOS mode = standard USB HID mode without extra software features
- How to enable: usually hold Fn + F1 or Fn + Esc on startup (varies by keyboard brand)
- Check D3TX Discord for specific keyboard compatibility

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 ANTI-CHEAT — UPDATED DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
RICOCHET (COD) — BEHAVIOR-BASED DETECTION:
RICOCHET officially states Cronus Zen "is not permitted" in Call of Duty.
Detection is BEHAVIOR-BASED not device-signature-based — this means:
- It looks for input PATTERNS that are statistically impossible for humans
- Perfect recoil control every shot → flagged
- Inhuman rapid fire speed → flagged
- Machine-consistent timing on every input → flagged
- Detection: input timing, consistency, response patterns
Implication: extreme values are more dangerous than subtle ones.
D3TX scripts are tuned to stay within human-plausible ranges.

FORTNITE — RESTRICTED HARDWARE WARNING:
Epic Games officially lists "Cronus Zen" and "Cronus Max" as "restricted hardware."
Users may see a "Restricted Hardware Warning" popup in Fortnite.
Attempting to bypass this restriction "may result in a permanent ban" per Epic.
D3TX Fortnite scripts are built to minimize detection risk but cannot guarantee bypass.

PS5 PLATFORM LEVEL BLOCKING:
A January 2024 PS5 system update blocked Cronus Zen connectivity.
Cronus released a firmware patch shortly after.
This shows platform-level detection can happen at any time.
Always watch D3TX Discord announcements after PS5 system updates.

NINTENDO SWITCH SETUP:
1. Go to Switch System Settings > Controllers and Sensors
2. Enable "Pro Controller Wired Communication" — REQUIRED or Zen won't work
3. Connect Zen to Switch dock via USB
4. Docked mode: may need 15V power supply for stable operation
5. Handheld mode: requires USB-C OTG adapter (sold separately)
6. Switch Lite: always needs USB-C OTG adapter
`;

module.exports = ZEN_KNOWLEDGE + ZEN_ADVANCED_KNOWLEDGE;
