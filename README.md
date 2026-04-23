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
- `/sobre` — Sobre nos (historia, metodo, espaco, equipe, valores)
- `/planos` — Restart, Creditos, Flex 8 + calculadora + FAQ
- `/contato` — 3 canais, formulario, mapa, FAQ operacional
- `/privacidade` — Politica de privacidade LGPD

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
├── index.html + sobre.html + planos.html + contato.html + privacidade.html
├── robots.txt + sitemap.xml
├── DESIGN-SYSTEM.md + vercel.json + .gitignore
└── assets/
    ├── css/ (shared, components, consent, home, sobre, planos, contato)
    ├── js/ (analytics, tracking, shared, home, sobre, planos, contato)
    ├── fonts/
    └── images/
```

## TODOs de producao

- [x] Google Analytics 4 (PROMPT 07)
- [x] Cookie consent banner LGPD (PROMPT 07)
- [x] Sitemap.xml + robots.txt (PROMPT 07)
- [x] Schema.org LocalBusiness (PROMPT 07)
- [x] Politica de Privacidade (PROMPT 07)
- [ ] Criar OG images reais (1200x630) por pagina
- [ ] Configurar favicon set completo
- [ ] Conectar formulario de contato com Resend/n8n
- [ ] Substituir placeholders .ph por fotos reais do estudio
- [ ] Configurar Meta Pixel (quando iniciar campanhas)
- [ ] Dominio proprio: flexbyo.com.br
- [ ] Criar pagina /modalidades.html (PROMPT 03 pendente)
