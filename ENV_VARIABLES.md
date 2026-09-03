# GLÚTEO PRIME — Documentação técnica

## Arquitetura atual
- **Frontend**: React 19 + React Router + TailwindCSS + shadcn/ui (tema escuro dourado/rosa). Design preservado.
- **Backend**: FastAPI (Python) — rotas sob `/api`.
- **Banco**: MongoDB (coleções: `users`, `transactions`).
- **Auth**: JWT (HS256, 30 dias) + senhas com hash `pbkdf2_sha256`. Contexto React (`AuthContext`) guarda o token no `localStorage`.
- **Pagamentos**: Mercado Pago Checkout Pro (cartão, Pix, boleto). Preço calculado no servidor.

## Variáveis de ambiente

### backend/.env (JÁ configuradas)
```
MONGO_URL=...              # NÃO alterar (ambiente)
DB_NAME=...                # NÃO alterar (ambiente)
JWT_SECRET=...             # segredo dos tokens JWT (gerado)
MP_ACCESS_TOKEN=...        # Mercado Pago (PRODUÇÃO) — chave privada
MP_PUBLIC_KEY=...          # Mercado Pago — chave pública
MP_WEBHOOK_SECRET=""       # (opcional) segredo do webhook p/ validar assinatura
```

### frontend/.env (JÁ configuradas)
```
REACT_APP_BACKEND_URL=...  # NÃO alterar (ambiente)
```

### Necessárias para FASES FUTURAS (ainda não configuradas)
```
# Storage de imagens de exercícios (ex.: AWS S3 / Cloudflare R2)
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
STORAGE_REGION=

# Push notifications (ex.: Firebase Cloud Messaging)
FCM_SERVER_KEY=

# Login social (opcional)
GOOGLE_CLIENT_ID=
APPLE_CLIENT_ID=

# Mercado Pago — assinatura recorrente (Preapproval) p/ cartão
MP_PREAPPROVAL_PLAN_ID=
```

## Endpoints já implementados
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/profile`
- `GET /api/payments/config`, `GET /api/payments/plans`, `POST /api/payments/checkout`,
  `GET /api/payments/status/{ref}`, `GET /api/payments/verify`, `POST /api/payments/webhook`

## Roadmap por fases (do PROMPT MESTRE)
- ✅ **Fase 0** — UI completa (landing + app START/2.0/3D) com todos os cliques funcionais
- ✅ **Fase 1** — Autenticação real (cadastro/login/JWT/perfil) + Pagamento real (Mercado Pago)
- ⬜ **Fase 2** — Onboarding + Perfil editável (idade, altura, peso, objetivo, nível) na UI, usando `/api/auth/profile`
- ⬜ **Fase 3** — Ativar Premium no backend após pagamento aprovado (webhook → `user.plan=premium`) e gating por plano
- ⬜ **Fase 4** — Biblioteca de exercícios no banco + upload de imagens (storage) + CRUD
- ⬜ **Fase 5** — Sessão de treino real: séries, carga, repetições, cronômetro de descanso, concluir treino → `workout_sessions`
- ⬜ **Fase 6** — Histórico + Progresso (gráficos com dados reais) + Metas + Favoritos
- ⬜ **Fase 7** — Painel administrativo (usuários, exercícios, treinos, planos, estatísticas reais)
- ⬜ **Fase 8** — Notificações push (FCM) + preferências
- ⬜ **Fase 9** — Empacotamento mobile (Capacitor/Expo) + In-App Purchase (Apple StoreKit / Google Play Billing) + checklists de publicação

## Dependente de configuração externa (rule 46)
- **Push notifications**: requer chaves FCM.
- **Upload/armazenamento de imagens**: requer credenciais de storage (S3/R2).
- **Assinatura recorrente por cartão**: requer criar plano de Preapproval no Mercado Pago.
- **Publicação nas lojas**: requer contas Apple Developer / Google Play + build mobile (Capacitor/Expo).
