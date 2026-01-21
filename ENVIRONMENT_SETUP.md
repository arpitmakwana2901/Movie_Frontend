# Environment Configuration Guide

## Clerk Authentication

### Development Keys (Current Setup)
You are currently using Clerk development keys:
- **Key**: `pk_test_...` (development/test key)
- **Warning**: "Development instances have strict usage limits"

### What This Means:
- ✅ **For Development**: This is perfectly fine for local development and testing
- ⚠️ **Usage Limits**: Development keys have rate limits and feature restrictions
- ❌ **For Production**: You MUST switch to production keys before deploying

### How to Fix for Production:

1. **Go to Clerk Dashboard**: https://dashboard.clerk.com
2. **Select Your Application**
3. **Navigate to**: API Keys → Production
4. **Copy Production Keys**:
   - `VITE_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_...`)
   - `CLERK_SECRET_KEY` (if needed on backend)

5. **Update `.env` file**:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key_here
   ```

### Suppressing the Warning (Development Only):
If you want to suppress the warning during development, you can add this to your console configuration, but it's recommended to keep it visible as a reminder.

---

## Current Environment Variables

### Client (.env)
```
VITE_CURRENCY = '₹'
VITE_CLERK_PUBLISHABLE_KEY=pk_test_bWF0dXJlLWxhcmstNDEuY2xlcmsuYWNjb3VudHMuZGV2JA
```

### Server (.env)
```
SECRET_KEY = "arpit"
PORT = "3690"
MONGODB_URL = "mongodb+srv://arpit:arpit0129@clustertest.c6slymd.mongodb.net/movie-project?retryWrites=true&w=majority"
```

---

## Security Recommendations:

1. **Never commit `.env` files** to version control (already in `.gitignore`)
2. **Use strong SECRET_KEY** for JWT signing in production
3. **Rotate credentials** regularly
4. **Use environment-specific keys** (dev vs production)
