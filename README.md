# FlexByo Academy® — Site Institucional

Site oficial premium da FlexByo Academy, academia de Pilates e Hot Yoga
em Curitiba, dentro do ParkShoppingBarigui. Produzido pela Agencia BASE.

**Producao:** https://flexbyo-siteremix2026.vercel.app
**Repo:** https://github.com/gabrielkendy/flexbyo-siteremix2026

## Stack

- HTML5 + CSS3 + JavaScript vanilla (sem build step, sem framework)
- Google Fonts: Fraunces, Inter, JetBrains Mono
- Hospedagem: Vercel (deploy estatico auto via GitHub main)

## Paginas

- `/` — Home
- `/sobre` — Sobre nos
- `/modalidades` — 7 modalidades com sidebar sticky
- `/planos` — Planos + calculadora + FAQ
- `/contato` — Formulario + mapa + FAQ operacional
- `/privacidade` — Politica LGPD

## Rodar localmente

```bash
python -m http.server 8000
```
Acessa http://localhost:8000

## Deploy

Push na branch `main` → Vercel auto-deploya em ~90 segundos.

## Documentacao de design

Ver [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) — tokens, componentes e padroes.

## Estrutura

```
sites-remix/
├── index.html + sobre.html + modalidades.html + planos.html + contato.html + privacidade.html
├── robots.txt + sitemap.xml
├── DESIGN-SYSTEM.md + vercel.json + .gitignore
├── api/contato.js (Vercel Function — email via Resend)
└── assets/
    ├── css/ (shared, components, consent, home, sobre, modalidades, planos, contato)
    ├── js/ (analytics, tracking, shared, home, sobre, modalidades, planos, contato)
    ├── images/og/ (5 OG images 1200x630)
    ├── images/favicons/ (SVG + PNGs + ICO)
    └── fonts/
```

## TODOs de producao (backlog)

- [x] Criar pagina /modalidades.html — v1.1.0
- [x] Google Analytics 4 — v1.0.0
- [x] Cookie consent banner LGPD — v1.0.0
- [x] Sitemap.xml + robots.txt — v1.0.0
- [x] Schema.org LocalBusiness — v1.0.0
- [x] Politica de Privacidade — v1.0.0
- [x] OG images 1200x630 por pagina — v1.0.0
- [x] Favicon set completo — v1.0.0
- [x] Formulario de contato via Resend — v1.0.0
- [ ] Substituir placeholders .ph por fotos reais do estudio
- [ ] Configurar Meta Pixel (quando iniciar campanhas)
- [ ] Configurar Sentry error tracking
- [ ] Dominio proprio: flexbyo.com.br
- [ ] GA_ID e Search Console verification reais (trocar placeholders)
