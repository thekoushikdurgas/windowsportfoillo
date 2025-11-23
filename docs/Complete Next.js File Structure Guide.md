<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Complete Next.js File Structure Guide

**A comprehensive Next.js project structure** enables you to leverage all framework features including App Router, API routes, server actions, middleware, static assets, and more. Here's the **complete file organization** to maximize Next.js capabilities:

## Root-Level Structure

```
my-nextjs-project/
├── app/                      # App Router (Next.js 13+)
├── public/                   # Static assets
├── src/                      # Optional source directory
├── components/               # Reusable components
├── lib/                      # Utility functions & helpers
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript type definitions
├── styles/                   # Global styles
├── context/                  # React Context providers
├── middleware.ts             # Edge middleware
├── next.config.js           # Next.js configuration
├── .env.local               # Environment variables
├── tsconfig.json            # TypeScript config
├── package.json             # Dependencies
└── .eslintrc.json          # Linting rules
```

## App Directory (App Router)

The **app directory** is the core of Next.js routing and supports all modern features:[^1][^2]

```
app/
├── layout.tsx               # Root layout (required)
├── page.tsx                 # Homepage
├── loading.tsx              # Loading UI
├── error.tsx                # Error handling
├── not-found.tsx            # 404 page
├── global.css               # Global styles
├── favicon.ico              # Favicon
│
├── (auth)/                  # Route group (no URL segment)
│   ├── login/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   └── register/
│       └── page.tsx
│
├── dashboard/
│   ├── layout.tsx           # Nested layout
│   ├── page.tsx
│   ├── loading.tsx
│   ├── _components/         # Private folder (not routed)
│   ├── _actions/            # Server actions
│   ├── _data/               # Data fetching logic
│   ├── settings/
│   │   └── page.tsx
│   └── analytics/
│       └── page.tsx
│
├── blog/
│   ├── page.tsx             # Blog index
│   ├── [slug]/              # Dynamic route
│   │   ├── page.tsx
│   │   └── opengraph-image.tsx
│   └── [...catchAll]/       # Catch-all route
│       └── page.tsx
│
├── api/                     # API routes
│   ├── auth/
│   │   └── route.ts
│   ├── users/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   └── webhook/
│       └── route.ts
│
└── sitemap.ts               # Dynamic sitemap
```

## Components Directory

Organize **reusable components** by feature and type:[^3][^4]

```
components/
├── ui/                      # Generic UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── modal.tsx
│   ├── input.tsx
│   └── index.ts            # Barrel export
│
├── layout/                  # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── sidebar.tsx
│   └── navbar.tsx
│
├── features/                # Feature-specific components
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   ├── blog/
│   │   ├── post-card.tsx
│   │   └── post-list.tsx
│   └── dashboard/
│       ├── stats-widget.tsx
│       └── chart.tsx
│
└── common/                  # Shared components
    ├── loading-spinner.tsx
    └── error-boundary.tsx
```

## Lib Directory

Store **utilities, helpers, and configurations**:[^1][^3]

```
lib/
├── utils/
│   ├── format.ts           # Formatting utilities
│   ├── validation.ts       # Validation helpers
│   └── cn.ts               # Class name merger
│
├── api/
│   ├── client.ts           # API client setup
│   └── endpoints.ts        # API endpoints
│
├── db/
│   ├── prisma.ts           # Database client
│   └── queries.ts          # Database queries
│
├── auth/
│   ├── config.ts           # Auth configuration
│   └── session.ts          # Session management
│
└── constants.ts            # App-wide constants
```

## Hooks Directory

Custom **React hooks** for reusable logic:[^1]

```
hooks/
├── useAuth.ts
├── useDebounce.ts
├── useLocalStorage.ts
├── useMediaQuery.ts
└── index.ts                # Barrel export
```

## Types Directory

**TypeScript type definitions** and interfaces:[^1]

```
types/
├── models/
│   ├── user.ts
│   ├── post.ts
│   └── comment.ts
│
├── api/
│   ├── request.ts
│   └── response.ts
│
└── index.ts
```

## Styles Directory

**Global stylesheets** and theme configuration:[^1]

```
styles/
├── globals.css
├── variables.css
├── themes/
│   ├── light.css
│   └── dark.css
└── utilities.css
```

## Public Directory

**Static assets** served at root URL:[^2]

```
public/
├── images/
│   ├── logo.svg
│   └── hero.png
├── fonts/
│   └── custom-font.woff2
├── icons/
└── robots.txt
```

## Advanced Features

### Route Groups

Use **parentheses** to organize routes without affecting URLs:[^5][^6]

```
app/
├── (marketing)/
│   ├── about/
│   └── contact/
└── (shop)/
    ├── products/
    └── cart/
```

### Private Folders

Prefix with **underscore** to exclude from routing:[^7][^2]

```
app/dashboard/
├── _components/            # Not accessible via URL
├── _actions/
├── _helpers/
└── page.tsx
```

### Parallel Routes

Enable **simultaneous rendering**:[^2]

```
app/dashboard/
├── @analytics/
│   └── page.tsx
├── @team/
│   └── page.tsx
└── layout.tsx
```

### Intercepting Routes

**Intercept** routes for modal patterns:[^2]

```
app/
├── feed/
│   └── page.tsx
└── (..)photo/
    └── [id]/
        └── page.tsx
```

## Configuration Files

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```

### middleware.ts

Edge **middleware** for authentication and redirects:[^2]

```typescript
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

## Best Practices

- **Keep routes flat**: Avoid deep nesting in the app directory[^3]
- **Use route groups**: Organize related routes without URL impact[^5]
- **Co-locate files**: Keep related components near their routes[^8][^3]
- **Private folders**: Use underscore prefix for non-routable folders[^7]
- **Barrel exports**: Create index files for cleaner imports[^3]
- **Feature-based organization**: Group by feature for large projects[^9]

This structure provides **maximum flexibility** while maintaining clear separation of concerns, enabling you to leverage all Next.js features including server components, streaming, server actions, and incremental static regeneration.[^6][^3][^1]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18]</span>

<div align="center">⁂</div>

[^1]: https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji

[^2]: https://nextjs.org/docs/app/getting-started/project-structure

[^3]: https://www.wisp.blog/blog/the-ultimate-guide-to-organizing-your-nextjs-15-project-structure

[^4]: https://stackoverflow.com/questions/76214501/nextjs-13-folder-structure-best-practice

[^5]: https://www.geeksforgeeks.org/reactjs/nextjs-route-groups-and-project-organization/

[^6]: https://www.contentful.com/blog/next-js-app-directory-guide-tutorial/

[^7]: https://www.reddit.com/r/nextjs/comments/1ig4qw8/what_is_the_best_way_of_organizing_the_file/

[^8]: https://sentry.io/answers/next-js-directory-organisation-best-practices/

[^9]: https://www.groovyweb.co/blog/how-to-structure-full-stack-next-js-project/

[^10]: https://online-journals.org/index.php/i-jet/article/download/2916/2882

[^11]: https://arxiv.org/pdf/2210.07311.pdf

[^12]: http://arxiv.org/pdf/2411.19472.pdf

[^13]: https://www.mdpi.com/2306-5729/5/2/43/pdf

[^14]: https://arxiv.org/pdf/2501.18225.pdf

[^15]: https://arxiv.org/html/2504.01907v1

[^16]: https://arxiv.org/pdf/2308.12545.pdf

[^17]: https://arxiv.org/pdf/1703.01690.pdf

[^18]: https://www.youtube.com/watch?v=5HAKUIvYo-Q
