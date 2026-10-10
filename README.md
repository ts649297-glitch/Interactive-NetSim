# Interactive NetSim

**Interactive NetSim** is a complete, working, browser-based network simulation and visualisation platform designed for students and researchers learning computer networking concepts.

Built with a pure, framework-free discrete-event simulation engine, students can **Design** custom topologies, **Configure** link capacities and traffic flows, **Simulate** live hop-by-hop packet animation with queue dynamics, and **Analyse** real-time performance telemetry without any command-line fight.

---

## Team & Roles
- **Tushar Sharma (24BCE2114)**: Frontend Architecture & Visualisation (React component hierarchy, visual topology builder, canvas drag-and-drop, real-time glowing packet animation loop).
- **Ayush Sharma (24BCE0961)**: Backend, Simulation Engine & Routing (Deterministic priority queue, Dijkstra and BFS routing algorithms, FIFO/Priority scheduling, dynamic link failure recovery, automated test suite).
- **Nitish Sharma (24BDS0330)**: UI/UX & Frontend Support (Modern dark theme glassmorphism interface, Chart.js live analytics dashboards, filterable event log, guided demo presentation mode).

---

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Chart.js (`react-chartjs-2`), Mermaid.js.
- **Backend**: Node.js, Express, Socket.IO.
- **Database / Persistence**: MongoDB with built-in zero-dependency JSON filesystem fallback.
- **Core Engine**: Pure framework-free, zero-I/O JavaScript module (`engine/`). Runs in Node.js server AND directly in browser runtime as an offline fallback.

---

## Folder Structure
```
netsim/
  client/                  React application (pages, components, context)
    src/
      components/          Header, Canvas, ConfigPanel, BottomTabs, Dashboard, EventLog, CompareView, GuidedDemo, FirstTimeOverlay
      pages/               SimulatorPage, ScenariosPage, ValidationPage, ReportPage, TeamPage
      context/             SimContext (state hub & telemetry synchronization)
  server/                  Express REST API & Socket.IO telemetry server
    src/
      routes/              simulation.js, topologies.js, scenarios.js, validation.js
      storage.js           Resilient persistence adapter (MongoDB + File JSON)
      server.js            Server entry point & socket event loop
  engine/                  Pure discrete-event simulation engine (zero I/O)
    network.js             Network topology, nodes, links, and graph operations
    link.js                DirectedLink & Link transmitter models
    packet.js              Packet data structure and state machine
    traffic.js             TrafficGenerator (manual, burst, seeded random)
    routing/               Dijkstra (delay cost) & BFS (hop count)
    simulator.js           Deterministic priority-queue discrete-event loop
    metrics.js             Metrics computation from event log (KPIs, CSV/JSON)
    prng.js                Mulberry32 seedable PRNG
    loader.js              Scenario JSON parser
    tests/                 Unit tests and 17-case validation matrix
  scenarios/               6 preset scenario JSON files (basic, multihop, congestion, diamond, failure, mesh_random)
  docs/                    Curriculum documentation (ARCHITECTURE_AND_DESIGN, TEST_CASES, RESULTS, PROGRESS_AND_CONTRIBUTION)
  package.json             Root workspace configuration
  start-dev.js             Single-command dual-server launcher
  README.md                Documentation & technical manual
```

## Quick Start (No Antigravity Needed!)

### Option A: One-Click Desktop Launcher (Windows)
Double-click either of the batch files in `C:\Users\DELL\.gemini\antigravity\scratch\netsim\`:
- **`start-netsim.bat`**: Launches both backend + frontend servers and automatically opens `http://localhost:3000` in your browser.
- **`start-production.bat`**: Runs the pre-compiled production build.

---

### Option B: Terminal / Command Prompt
You can run the project anytime directly from Command Prompt or PowerShell:

1. Open Command Prompt (`cmd`) or PowerShell.
2. Navigate to the project directory:
   ```cmd
   cd C:\Users\DELL\.gemini\antigravity\scratch\netsim
   ```
3. Run the launch command:
   ```cmd
   node start-dev.js
   ```
4. Open your browser to **http://localhost:3000/**.

---

## Installation & Setup (First Time)
- npm v9+

### 2. Install Dependencies
Run in the root directory:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Run Application (Single Command)
```bash
npm run dev
```
- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)

*(Alternatively, run backend via `npm run dev:server` and frontend via `npm run dev:client` in separate terminals).*

---

## Automated Validation & Unit Tests
Run the complete automated test suite covering all 17 acceptance cases from Section 10:
```bash
npm test
```
Result: **21/21 passing (100% pass rate)**.

---

## Key Features
1. **Visual Topology Designer**: Drag-and-drop palette (PC, Router, Switch, Server). Click-and-drag between node handles to create links. Undo/redo, zoom/pan, minimap, snap-to-grid, delete.
2. **Real-Time Packet Animation**: Glowing cubes travel hop-by-hop along links. Queue depth blocks appear at transmitting node interfaces and turn red near capacity.
3. **Dynamic Fault Injection**: Click any link to trigger **Fail / Restore**. The engine purges queued/propagating packets on the failed link (`link_down`), recomputes alternative routes, and alerts the user with live notifications.
4. **Routing Comparison**: Side-by-side execution of Dijkstra (delay optimization) vs BFS (hop count minimization) with comparison tables and bar charts.
5. **Live Chart.js Dashboards**: 9 computed KPI cards (Generated, Delivered, Lost, PDR %, Avg Delay, Median Delay, Throughput, Avg Hops, Max Queue) and 4 live charts.
6. **Guided Demo Mode**: Automated walkthrough loading the Diamond preset and stepping through topology, traffic, Dijkstra vs BFS, link failure rerouting, and metrics with on-screen presentation captions.
7. **17-Case In-App Validation Suite**: Test matrix executed in-browser against real simulation data with live status badges.
8. **Technical Project Report**: Interactive documentation rendering all 10 project evaluation points with Mermaid UML class, sequence, and architecture diagrams.

---

## API Summary

### REST Endpoints
- `POST /api/simulate`: Body `{ topology, traffic, config }` $\rightarrow$ `{ events, metrics }`
- `GET /api/presets`: Returns the 6 preset scenario definitions
- `GET /api/topologies` / `POST /api/topologies` / `DELETE /api/topologies/:id`: Topology management
- `GET /api/scenarios` / `POST /api/scenarios` / `DELETE /api/scenarios/:id`: Scenario management
- `POST /api/validate`: Executes the 17-case validation matrix and returns live test results
- `GET /api/report-data`: Generates real metric tables for curriculum defense reports
- `GET /api/health`: Health status probe

### Socket.IO Telemetry
- Client emits: `sim:start`, `sim:pause`, `sim:step`, `sim:reset`, `sim:speed`, `sim:fail_link`, `sim:restore_link`.
- Server emits: `sim:event`, `sim:metrics`, `sim:finished`, `sim:error`.

---

## Sensible Assumptions Made
1. **Units**: Time in milliseconds (ms), packet size in bytes, bandwidth in Mbps, delay in ms.
2. **Transmission Time Formula**: $t_{\text{tx}} = \frac{\text{size\_bytes} \times 8}{\text{bandwidth\_Mbps} \times 1000}\text{ ms}$.
3. **Buffer Sizing**: Directed link buffer count includes both packets in queue and the packet currently being transmitted. Packets arriving to a full buffer drop with reason `queue_overflow`.
4. **Deterministic Tie-Breaking**: Graph neighbors are sorted lexicographically by node ID (`A < B < C`), ensuring identical shortest-path results across all operating systems.
5. **Resilient Persistence**: MongoDB is supported via connection URI; in its absence, the server automatically persists data to `server/data/*.json` so the app is instantly usable with zero setup.
6. **Zero-Lag Offline Fallback**: If the Node server is offline or unreachable, the frontend seamlessly switches to executing the pure simulation engine locally in the browser with zero interruption.
