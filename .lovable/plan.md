

## Plan: Add 2GIS Widget Below USP Tags in Hero Section

**What**: Insert the 2GIS review/rating widget (`iframe`) directly below the three USP tags ("Бесплатная консультация", "Оформление от 5 000 ₽", "Расчёт платежей за один день") in the Hero component on the home page.

**How**: In `src/components/Hero.tsx`, add an `iframe` element right after the USP tags `div` (after line 150), wrapped in a small container with matching animation delay. The iframe will use the provided 2GIS widget URL with `width="150px"` and `height="50px"`, styled to blend with the dark hero overlay (no border, slight margin-top).

**File**: `src/components/Hero.tsx`
- After the closing `</div>` of the USP tags block (line 150), insert:
```tsx
<div className="mt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
  <iframe
    frameBorder="0"
    width="150"
    height="50"
    src="https://widget.2gis.ru/api/widget?org_id=70000001105785878&branch_id=70000001105785879&size=medium&theme=light"
    title="2GIS Rating"
    className="rounded-lg"
  />
</div>
```

This places the widget naturally in the visual flow — under the USP badges, before the stats row, aligned left on desktop and centered on mobile (inheriting the parent's text alignment classes).

