# Context Menu Enhancements

## Customization

- Manage custom items per context in `ContextMenuSettings` (`src/components/shared/ContextMenuSettings.tsx`).
- Persisted via Zustand store `useContextMenuStore` (key: `durgasos-context-menu`).

## Themes

- Presets in `src/theme/menuTheme.ts` with optional custom theme.
- Theme selection and export/import in settings.

## AI and Analytics

- AI suggestions: POST `/menu/ai/suggestions`.
- Analytics events: POST `/menu/analytics/event` (plus `/insights`, `/perf`).

## Automation and Plugins

- Automation: POST `/menu/automation/optimize`, `/menu/automation/apply`.
- Plugins: GET/POST `/menu/plugins`, enable/disable endpoints.

## Testing

- Unit and a11y tests in `src/__tests__/components/*ContextMenu*.test.tsx`.
