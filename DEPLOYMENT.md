# Railway Deployment Guide

This guide will help you deploy the NDA Redline application to Railway as a single service.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **OpenAI API Key**: For AI redlining functionality

## Deployment Steps

### 1. Connect to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect the `Dockerfile`

### 2. Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. Note the connection details (Railway will set `DATABASE_URL` automatically)

### 3. Set Environment Variables

In your Railway project settings, add these environment variables:

#### Required Variables:
```
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
OPENAI_API_KEY=your-openai-api-key-here
FLASK_ENV=production
NODE_ENV=production
```

#### Optional Variables:
```
CORS_ORIGIN=https://your-app.railway.app
NEXT_PUBLIC_API_BASE_URL=https://your-app.railway.app
```

**Note**: Railway will automatically set:
- `DATABASE_URL` (from the PostgreSQL service)
- `PORT` (for the application)
- `RAILWAY_PUBLIC_DOMAIN` (your app's domain)

### 4. Deploy

1. Railway will automatically build and deploy your application
2. The build process will:
   - Build the Next.js frontend
   - Set up the Python backend
   - Create a Docker container with both services
   - Start nginx to serve the frontend and proxy API requests

### 5. Run Database Migrations

After deployment, you'll need to run database migrations:

1. Go to your Railway project
2. Click on your service
3. Go to "Deployments" tab
4. Click on the latest deployment
5. Go to "Logs" tab
6. You can run commands in the "Shell" tab

Run these commands in the Railway shell:
```bash
cd /app
python -m alembic upgrade head
```

### 6. Create Admin User

After migrations, create an admin user:
```bash
cd /app
python -c "
from app import create_app, db
from app.models import define_models
from flask import current_app

app = create_app()
with app.app_context():
    User, Document, ProcessingRule, ProcessingJob, UserRole, DocumentStatus = define_models(db)
    
    # Create admin user
    admin = User(
        email='admin@example.com',
        role='ADMIN',
        is_active=True
    )
    admin.set_password('admin123')
    
    db.session.add(admin)
    db.session.commit()
    print('Admin user created: admin@example.com / admin123')
"
```

## Architecture

The deployed application uses:

- **Frontend**: Next.js static export served by nginx
- **Backend**: Flask API running on port 5001
- **Database**: PostgreSQL (Railway managed)
- **Reverse Proxy**: nginx serves frontend and proxies API requests
- **Container**: Single Docker container with both services

## Monitoring

- **Logs**: Available in Railway dashboard
- **Metrics**: Railway provides basic metrics
- **Health Checks**: Configured in `railway.toml`

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check Dockerfile and dependencies
2. **Database Connection**: Verify `DATABASE_URL` is set
3. **API Not Working**: Check nginx configuration and Flask logs
4. **Frontend Not Loading**: Check Next.js build and nginx serving

### Useful Commands:

```bash
# Check logs
railway logs

# Connect to shell
railway shell

# Check environment variables
railway variables

# Restart service
railway redeploy
```

## Cost Optimization

- **Database**: Railway PostgreSQL has a free tier
- **Compute**: Railway charges based on usage
- **Storage**: File uploads are stored in the container (temporary)

For production, consider:
- Using Railway's persistent volumes for file storage
- Setting up proper backup strategies
- Monitoring usage and costs
