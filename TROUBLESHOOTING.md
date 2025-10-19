# Troubleshooting Guide

## Fast Refresh Issues

### Problem: "Fast Refresh had to perform full reload"

**Causes:**
- Components with anonymous functions
- Components with camelCase names instead of PascalCase
- Files with multiple exports alongside React components
- Improper component export patterns

**Solutions Applied:**
1. ✅ Ensured all components use named function exports
2. ✅ Verified PascalCase naming for all components
3. ✅ Separated non-component exports to dedicated files
4. ✅ Updated Next.js configuration with proper webpack settings

## 404 Errors for Static Assets

### Problem: GET /static/css/main.css 404, GET /static/js/bundle.js 404

**Causes:**
- Missing static asset files
- Incorrect webpack configuration
- Next.js not properly serving static assets

**Solutions Applied:**
1. ✅ Created placeholder static files in public/static/
2. ✅ Updated Next.js config with proper rewrites
3. ✅ Fixed webpack configuration for asset handling
4. ✅ Added proper asset prefix configuration

## CSS Linter Warnings

### Problem: Unknown at rule @tailwind, @apply warnings

**Causes:**
- CSS linter not recognizing Tailwind directives
- Missing PostCSS configuration
- IDE not configured for Tailwind CSS

**Solutions Applied:**
1. ✅ Created .vscode/settings.json to ignore CSS validation
2. ✅ Added proper PostCSS configuration
3. ✅ Created stylelint configuration for Tailwind
4. ✅ Added CSS linting scripts to package.json

## Development Server Issues

### Problem: Slow compilation, webpack hot reload issues

**Causes:**
- Inefficient webpack configuration
- Missing dependencies
- Poor file watching setup

**Solutions Applied:**
1. ✅ Optimized webpack configuration
2. ✅ Added missing @svgr/webpack dependency
3. ✅ Improved file watching with proper polling
4. ✅ Added package import optimization

## Quick Fix Commands

```bash
# Clean and reinstall dependencies
npm run clean
npm install

# Start development server with clean build
npm run dev:clean

# Run linting
npm run lint
npm run lint:css

# Type checking
npm run type-check
```

## Verification Steps

1. **Check Fast Refresh**: Edit any component and verify it updates without full reload
2. **Check Static Assets**: Verify no 404 errors in browser console
3. **Check CSS**: Verify Tailwind styles are applied correctly
4. **Check Performance**: Verify fast compilation times

## Common Issues and Solutions

### Issue: Components not updating
**Solution**: Ensure components are properly exported and named

### Issue: Styles not applying
**Solution**: Check Tailwind configuration and CSS imports

### Issue: Build errors
**Solution**: Run `npm run type-check` and fix TypeScript errors

### Issue: Slow development
**Solution**: Use `npm run dev:clean` for fresh start
