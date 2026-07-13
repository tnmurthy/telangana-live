# Common Mistakes — telangana-live

## Backend

### ❌ Direct LLM Instantiation in Agents
**Wrong:**
```python
import anthropic
client = anthropic.Anthropic(api_key=CONFIG['api_key'])
message = client.messages.create(...)
```
**Right:**
```python
from core.llm_provider import llm
result = llm.generate(prompt, provider=CONFIG['llm_provider'], model=CONFIG['model'])
text = result['text']
tokens = result['tokens']
```
All retry logic, provider switching, and key management lives in `core/llm_provider.py`.

### ❌ Using `import openai` or Assuming a Provider
There is no OpenAI client in this project. `LLM_PROVIDER` defaults to `anthropic`.
Supported: `anthropic`, `gemini`, `ollama`, `zai`.

### ❌ Missing `or old_content` Fallback After `llm.generate()`
`llm.generate()` returns `{"text": None, ...}` on failure. Always guard:
```python
updated = result.get('text') or original_content
```

### ❌ Using `CONFIG['api_key']` for Anthropic
The canonical key name is `anthropic_api_key` (or env `ANTHROPIC_API_KEY`).
`api_key` is a legacy alias kept for backwards compat — don't use it in new code.

### ❌ Forgetting to Run Graphify After Code Changes
After modifying Python/JS/TS files in a session, rebuild the graph:
```bash
python -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
```

## Frontend

### ❌ Committing `dist/` Changes
The `dist/` folder is gitignored for the repo root but **not** for `frontend/dist/`. Run `npm run build` locally, never commit build artifacts.

### ❌ Hardcoding District/Data Values
All static civic data lives under `frontend/src/data/`. Update the data files, not the components.
