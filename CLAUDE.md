# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking and Svelte validation
npm run check

# Watch mode for type checking
npm run check:watch
```

## Architecture Overview

This is a SvelteKit personal portfolio website with blog functionality, built with:
- **SvelteKit** with TypeScript support
- **Supabase** for database and authentication
- **TailwindCSS** + shadcn-svelte for UI
- **Superforms + Zod** for form handling and validation
- **Use 

## Development Workflow
Always try to use tailwind when possible. Number one, we implement feature, whatever the user requests. Number two, we verify that if that feature was implemented correctly by using Playwright MCP, we go to navigate to the local host, and then we check if that thing they wanted is correct. If you think it's correct, then ask a user if it was implemented correctly or not. If the user gives you a green light, you then snapshot it using Git and you use commitLint and don't mention claude code. You do not mention Anthropic in your commit messages. Number four, you write test cases, end-to-end test cases and playwrights to make sure that it does not break in the future. And then once you're done implementing any future, you run E2E test cases again, to make sure that everything is correct. If everything is correct, you either tell the user that it's done or you go to the next step in the plan document if it's provided. 
### Key Architectural Patterns

**Authentication Flow:**
- Protected routes use `+page.server.ts` load functions with redirect logic
- Admin access via `/admin` route that redirects to `/blog/create` on success

**Component Organization:**
- `/src/lib/components/ui/` - shadcn-svelte base components
- `/src/lib/components/blog/` - Modular blog creation components (AI Assistant, Auto-save, SEO Analyzer, etc.)
- `/src/lib/components/routes/` - Page-specific components
- Route components follow SvelteKit file-based routing

**Data Management:**
- Server state via SvelteKit load functions and form actions
- Client state with Svelte stores and reactive statements
- Form validation using Superforms with Zod schemas
- Auto-save functionality uses localStorage with 30-second intervals


### File Structure Conventions

- Schemas co-located with routes (e.g., `/blog/create/schema.ts`)
- Server-side logic in `+page.server.ts` files
- Form components separated from page components
- Alias `@/*` maps to `src/lib/*`

### Form Handling Pattern

All forms use Superforms with Zod validation:
1. Define schema in `schema.ts`
2. Import and use in `+page.server.ts` for server actions
3. Form component imports schema for client-side validation
4. Use `enhance` for progressive enhancement

### Blog System Architecture

The blog creation system is modular:
- **MarkdownEditor** - Main editor with live preview
- **AutoSave** - Saves drafts to localStorage every 30 seconds
- **AIAssistant** - Content generation via Groq API
- **SEOAnalyzer** - Real-time SEO feedback
- **ImageUploader** - Handles image uploads and search
- **BlogTemplates** - Pre-built content templates

### API Integration Patterns

- Internal APIs use SvelteKit `+server.ts` endpoints
- GitHub API integration with manual 5-minute caching (`/src/lib/blogCache.ts`)
- External services: Google Calendar, Lorem Picsum for placeholder images
- Error handling with graceful fallbacks and user feedback