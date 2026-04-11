Run the devops agent to deploy the project. Pipeline:
1. Run `npm run lint` — stop on failure
2. Run `npm run build` — stop on failure
3. Run `npm test --if-present` — stop on failure
4. Push any pending Supabase migrations with `npx supabase db push`
5. Deploy to Vercel with `npx vercel --prod`
6. Report status at each step with commit hash and deploy URL
