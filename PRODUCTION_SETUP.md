# Production Setup Guide

## Environment Variables Required

You need to set these environment variables in your production environment:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase OAuth Configuration

### 1. Go to your Supabase Dashboard
- Navigate to Authentication > Providers
- Enable Google provider

### 2. Configure OAuth Redirect URLs
In your Supabase project settings, add these redirect URLs:

**For Development:**
```
http://localhost:9002/auth/callback
```

**For Production (Vercel):**
```
https://tech-navigation.vercel.app/auth/callback
```

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Set Application type to "Web application"
6. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
7. Copy the Client ID and Client Secret to Supabase

## Common Production Issues

### Issue 1: "Supabase configuration is missing"
**Solution:** Ensure environment variables are set in production

### Issue 2: "Access denied" or OAuth errors
**Solution:** Check redirect URLs in both Google Console and Supabase

### Issue 3: Session not created after OAuth
**Solution:** Verify the callback URL matches exactly in all configurations

### Issue 4: 307 Temporary Redirect on Vercel
**Solution:** This is usually caused by:
- Vercel's automatic HTTPS redirect (normal behavior)
- Missing environment variables causing redirect loops
- OAuth redirect URL mismatches

**Fix:** Ensure all environment variables are set in Vercel dashboard

## Testing Production Setup

1. Check browser console for any error messages
2. Verify environment variables are loaded (check Network tab)
3. Test OAuth flow step by step
4. Check Supabase logs for any errors

## Firebase App Hosting Configuration

If using Firebase App Hosting, set environment variables in:
- Firebase Console > App Hosting > Your App > Environment Variables

## Debugging Steps

1. **Check Environment Variables:**
   ```javascript
   console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
   console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
   ```

2. **Check OAuth Redirect:**
   - The redirect URL should be: `https://your-domain.com/auth/callback`
   - Must match exactly in Google Console and Supabase

3. **Check Network Tab:**
   - Look for failed requests to Supabase
   - Check for CORS errors
   - Verify OAuth flow completion

4. **Check Supabase Logs:**
   - Go to Supabase Dashboard > Logs
   - Look for authentication errors
