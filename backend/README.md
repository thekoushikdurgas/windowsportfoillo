# DurgasOS Backend

FastAPI backend for DurgasOS with modular architecture.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration.

4. Run the server:
```bash
uvicorn app.main:app --reload
```

## Docker

```bash
docker-compose up
```

