

```text
Build a single-file HTML web app: "RUBIK'S 3D — Real-State Solver · Interactive Studio".
A photorealistic, interactive Rubik's cube (2×2 up to 7×7) in Three.js with a real 3×3 solver.

TECH
- One self-contained index.html. Tailwind via cdn.tailwindcss.com, Inter + JetBrains Mono from Google Fonts.
- Three.js r160 via an import map from cdn.jsdelivr.net (three + three/addons/): OrbitControls,
  RoomEnvironment, RoundedBoxGeometry.
- Kociemba solver: load cubejs@1.3.2 as classic scripts from cdn.jsdelivr.net/npm/cubejs@1.3.2/lib/cube.js
  and lib/solve.js (exposes window.Cube). Do NOT use esm.sh or other hosts — the page must run under a
  CSP that only allows jsdelivr/cdnjs/unpkg/tailwind. Call Cube.initSolver() after the first frame paints.

RENDERING (photoreal studio look)
- Background: CSS radial gradient (#111620 center → #05070b edge) with a faint blue glow behind the cube;
  renderer with alpha:true, ACESFilmic tone mapping (exposure ~1.14), sRGB output.
- Environment: PMREM of RoomEnvironment. Lights: ambient 0.24, white key light (6,10,8) casting
  PCF soft shadows (2048 map, radius ~5, small negative bias), cool rim light from behind-left, soft fill from below.
- Invisible shadow-catcher floor (ShadowMaterial, opacity ~0.42) under the cube plus a radial-gradient
  "contact shadow" blob plane just above it.
- Cubies: RoundedBoxGeometry 0.955 size, 0.088 radius (5 segments; 3 for N≥5), near-black
  MeshPhysicalMaterial (roughness .36, clearcoat .38). Stickers: extruded rounded squares (0.77, radius
  .095, small bevel), MeshPhysicalMaterial with clearcoat ~0.88, low roughness modulated by a procedural
  canvas "micro-scratch" roughnessMap. All meshes cast/receive shadows.
- WCA colors: U white #f4f6f9, D yellow #ffd500, F green #009b48, B blue #0046ad, R red #c8102e, L orange #ff5800.
- For N>3 build only the outer shell of cubies plus a black core sphere of radius ((N-2)/2)*0.98 so
  inner-slice turns never show see-through gaps. Scale the cube group by 3/N so every size looks the same size.
- OrbitControls with damping, no pan, distance 5.4–14.5.

AUTHORITATIVE STATE MODEL (must never desync from the 3D view)
- 6·N² facelet array in Kociemba face order U,R,F,D,L,B, row-major per face.
- Give every facelet an integer "doubled centered" position (2·index − (N−1)) and outward normal.
  Per face, with M=N−1 and A(v)=2v−M:
  U [A(c), M, A(r)], R [M, −A(r), −A(c)], F [A(c), −A(r), M], D [A(c), −M, −A(r)], L [−M, −A(r), A(c)], B [−A(c), −A(r), −M].
- Generate each layer's permutation by rotating positions+normals 90° about +axis with the same
  right-handed integer rotation Three.js uses (cache per axis+layer). perm[dst]=src.
- Move tokens: [depth]Face[''|'|2], e.g. R, U', F2, 2R (2nd layer from R), 4U' on 7×7; M/E/S on 3×3 only
  (M follows L, E follows D, S follows F). Clockwise = rotation sign −1 about +axis for U,R,F and +1 for D,L,B.
  Write parseToken(token) → {axis, layer 0..N−1, dir, turns} and its inverse moveTokenFor(axis, layer, dir, turns).
- isSolved(): every face a single color (works after whole-cube slice rotations).

3D MOVE ANIMATION
- Queue of tokens. For each move: attach the cubies whose integer grid index on that axis matches to a
  pivot group, animate the pivot with ease-in-out cubic (double turns take 1.28× longer), then re-attach
  them to the cube group and snap position and rotation-matrix entries to exact integers (no drift).
- Speed: Slow 420ms, Normal 240ms, Fast 115ms (default), Instant (apply the whole queue in one frame).
- Space pauses/resumes animation.

DIRECT FACE DRAGGING
- Pointerdown raycasts stickers and bodies. On a hit (and only when idle) disable OrbitControls, record the
  hit point and the world face normal snapped to the nearest axis.
- After 14px of drag: for the two axes tangent to the face, project hitPoint and hitPoint+tangent to
  screen, pick the tangent best aligned with the drag (with sign). Rotation axis = snap(normal × tangent);
  layer = the clicked cubie's grid index on that axis; dir = sign. Convert to a token and enqueue.
- Hover over the cube shows a pointer cursor; dragging the background orbits.

SOLVERS
- 3×3 "Real Solve" computes from the current sticker state only (never from move history):
  1) Kociemba via cubejs (Cube.fromString(facelets).solve(), ~20 moves). Normalize the facelet string by
     current center colors so M/E/S drags still work.
  2) Built-in pure-JS layer-by-layer fallback: D-cross → D-corners (sexy-move insertion) → middle edges →
     U-cross (F R U R' U' F') → OLL corners (Sune) → corner permutation (T-perm, headlights) → edge
     permutation (Ua-perm). Simplify the output (merge same-face turns, commute opposite faces).
  Verify every solution on a cloned state before playing it; fall back to LBL if Kociemba fails or doesn't verify.
  Also detect the Phase 1→2 boundary (first index where the cube enters G1: U/D faces hold only U/D colors and
  E-slice edges hold no U/D colors) for a live phase badge.
- Other sizes: "Rewind" — keep a history of every turn since the last solved state and play it back inverted.
- Solver dropdown: "Kociemba (~20m)" / "Layer-by-Layer"; greyed out when N≠3.

SCRAMBLES
- 3×3: WCA-style 25 moves, no repeated face, no A-B-A on the same axis.
- N≠3: random layer turns, never the same layer twice in a row on an axis; length 11 (2×2), else 20·(N−2).

UI (dark glassmorphism: rgba(13,17,26,.78), 18px backdrop blur, 1px white/8% border, big soft shadow)
- Top-left card: mini 3×3 color icon, title, subtitle, status pill (SOLVED green / SCRAMBLED amber /
  SCRAMBLING blue pulsing / SOLVING cyan pulsing), stats row MOVES · TIME (mm:ss.t, mono) · SOLVER status
  (Loading…/Building tables…/Kociemba Ready/LBL Ready/Rewind (N×N)/Solving…).
- Bottom-right card (hidden on mobile behind a "Net" toggle button), with segmented tabs:
  Net — live unfolded cross net (U above; L F R B; D below) rebuilt for N×N with shrinking cells;
  Moves — 12 face-turn buttons with color dots; Info — control hints.
- Bottom dock: Scramble, Real Solve (primary blue gradient), Pause/Resume, Reset (rose on hover),
  divider, SOLVER select, SIZE select (2×2…7×7, default 3×3), SPEED select. Disable buttons while busy.
- Above the dock: sequence bar showing the scramble or solution as move pills (done = green, active = blue
  glow and auto-scroll, pending = grey), title (WCA SCRAMBLE / N×N SCRAMBLE / KOCIEMBA SOLUTION /
  LAYER-BY-LAYER SOLUTION / REWIND SOLUTION), meta ("25 random moves" or "21 moves · solved in 3.2 ms"), and
  a phase badge (Phase 1: Orient & Slice (G0 → G1) / Phase 2: Permute (G1 → Solved) / Stage Progress % / Complete ✓).
- Small toast at top center for events ("Cube solved cleanly!", size changes, resets).
- Timer starts on the first manual turn after a scramble and stops when solved; solve playback times itself.
- Keyboard: U D F B R L (Shift = prime), Space = pause. Changing size resets to a solved cube of that size.

QUALITY BAR
- No state desync after thousands of moves; all solutions verified before playing; responsive on mobile;
  60fps on desktop at 3×3; no console errors.
```


