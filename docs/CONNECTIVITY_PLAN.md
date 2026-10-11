# Nova Tutor: Connectivity Plan

## Goal
Develop Nova Tutor from a browser-based/cloud workspace, use GitHub as the source of truth, use Cline as the coding agent, use one model API for tutor responses, and use Kaggle TPU only for compatible experiments.

## Architecture
- GitHub: source code, reviewed changes, version history, training scripts.
- Cloud development workspace: terminal and editor; suitable for browser access from Android.
- Cline: coding agent running in a supported editor/environment, with its own model-provider configuration and Git authentication.
- Tutor backend API: server-side model calls; never expose provider keys in browser code.
- Kaggle notebook: separate training/evaluation environment; not a permanent inference server.
- Artifact storage: checkpoints and large outputs kept out of Git history.

## Phase 0 — Safety (started)
- Add ignore rules for environment files, Kaggle credentials, caches, and model artifacts.
- Keep real API keys and Kaggle tokens out of GitHub.
- If a secret was ever committed, rotate/revoke it; adding .gitignore does not remove it from Git history.

## Phase 1 — Workspace
1. Open the Nova-tutor repository in a supported cloud development workspace (for example, GitHub Codespaces).
2. Verify Node.js 18+ and run `npm install`, then `npm run dev`.
3. Confirm the app is reachable via the forwarded port.
4. Install/configure Cline only if its extension or CLI is supported in that environment.
5. Authenticate Git with least-privilege permissions.

## Phase 2 — API integration
1. Configure Cline's coding-model provider separately from Nova Tutor's application provider.
2. Store app credentials as workspace/hosting secrets or in a local ignored `.env`.
3. Test `/api/chat` with one provider.
4. Add request limits, rate limiting, error handling, and origin/CORS controls before public launch.
5. Never expose a provider API key to browser JavaScript.

## Phase 3 — Kaggle TPU
1. Create a Kaggle notebook and select an available TPU.
2. Run a minimal framework/device smoke test before training.
3. Load versioned training scripts from GitHub.
4. Train/evaluate only a model and framework compatible with the selected accelerator.
5. Save metrics and checkpoints as artifacts; avoid committing large files.
6. Treat Kaggle as an ephemeral training worker, not as a permanent online API.

## Phase 4 — Controlled automation
1. Add tests and a reproducible training configuration.
2. Start notebook runs manually.
3. Only later automate supported Kaggle CLI/API actions.
4. Review results and metrics before promoting a model.
5. Deploy inference separately if a trained model must serve Nova Tutor.

## Completion checks
- No secrets in tracked files.
- App starts in the workspace.
- A test request succeeds through the backend.
- TPU device smoke test passes.
- Training artifacts and evaluation metrics can be retrieved.
- Public deployment has rate limits, restricted CORS, and server-side secrets.
