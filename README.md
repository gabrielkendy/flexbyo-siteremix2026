# FlexByo Academy

Pilates e Hot Yoga Premium em Curitiba.

## Stack

- HTML5 / CSS3 / JavaScript (vanilla)
- Site estatico — sem build step
- Deploy via Vercel

## Sobre

Site institucional da FlexByo Academy, studio de Pilates e Hot Yoga com sala aquecida a 40C com infravermelho e cromoterapia, localizado em Mossungue, Curitiba/PR.

## Estrutura

```
index.html              — Homepage
assets/css/shared.css   — Design tokens, reset, nav, footer, utilities
assets/css/components.css — Section components reutilizaveis
assets/css/home.css     — Estilos exclusivos da home
assets/js/shared.js     — JS compartilhado (reveals, nav, cursor)
assets/js/home.js       — JS exclusivo da home (parallax, slider, form)
project/assets/         — Imagens e CSS original do design
DESIGN-SYSTEM.md        — Referencia do design system
```

## Dev

Abra com Live Server (VS Code) ou qualquer servidor HTTP local:

```bash
npx serve .
```

## Deploy

Push pra `main` dispara deploy automatico na Vercel.
URL: https://flexbyo-siteremix2026.vercel.app
