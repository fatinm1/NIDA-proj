# NDA Redline - AI-Powered NDA Redlining

Minimal, trustworthy NDA redlining web app with AI assistance.

## Quickstart

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local dev)
- Python 3.11+ (for local dev)

### Setup
1. Clone and setup environment:
```bash
git clone <repo-url>
cd nda-project
cp api/.env.sample api/.env
cp web/.env.local.example web/.env.local
# Edit .env files with your values
```

2. Start services:
```bash
make up
```

3. Verify:
- Web: http://localhost:3000
- API: http://localhost:5001/healthz
- Database: localhost:5432

### Development
```bash
make up          # Start all services
make down        # Stop all services
make logs        # View logs
make reset-db    # Reset database
```

### Smoke Test
```bash
curl http://localhost:5001/healthz
# Should return: {"status":"ok"}
```

## Architecture
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Flask, SQLAlchemy, PostgreSQL
- **AI**: OpenAI GPT-4 integration (coming soon)
- **Hosting**: Railway (target)

## Security Notes
- JWT stored in httpOnly cookies
- CORS restricted to web origin
- Input validation on all endpoints
- File upload size limits enforced
