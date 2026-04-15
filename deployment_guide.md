# Eterd Deployment Guide (Vercel)

This guide provides instructions for deploying the Eterd system to Vercel and configuring the necessary integrations.

## 1. Vercel Dashboard Configuration

1. **Import Project**: Link your GitHub repository to Vercel.
2. **Environment Variables**: Navigate to **Settings > Environment Variables** and add the following:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://ikiyszigxhbyklhkwodm.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Supabase Anon/Public Key)
   - `NEXT_PUBLIC_BASE_URL`: `https://eterd.vercel.app`
3. **Build Command**: Ensure the build command is `npm run build`. Vercel should detect this automatically.

## 2. Supabase Dashboard Configuration

To ensure authentication redirects work correctly, you must update the Redirect URLs in your Supabase project.

1. Go to **Authentication > Configuration > URL Configuration**.
2. **Site URL**: Set this to `https://eterd.vercel.app`.
3. **Redirect URLs**: Add the following:
   - `https://eterd.vercel.app/**`
   - `http://localhost:3000/**` (for local development)

## 3. Deployment Check

The system has been optimized for Next.js 16:
- **Proxy**: `middleware.ts` has been migrated to `proxy.ts`.
- **Wallpaper Logic**: Wallpapers now load incrementally. The background will start displaying as soon as the first image is ready, even while the opening animation is playing.
- **Performance**: React Compiler is enabled in `next.config.ts`.

## 4. Local Verification

Run the following command to ensure the project builds correctly before pushing:
```bash
npm run build
```

Verify that the build output shows `ƒ Proxy` instead of `ƒ Middleware`.
