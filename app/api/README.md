# API Routes Documentation

Esta aplicación usa **API Routes de Next.js** para separar completamente el frontend del backend. Las rutas de API llaman directamente a los repositorios (sin use cases intermedios).

## Estructura de las APIs

```
app/api/
├── projects/
│   ├── route.ts                    # GET (all/filter), POST
│   └── [id]/
│       ├── route.ts                # GET, PUT, DELETE
│       ├── approve/route.ts        # POST
│       ├── reject/route.ts         # POST
│       └── activate/route.ts       # POST
├── campaigns/
│   ├── route.ts                    # GET (all), POST
│   └── [id]/
│       ├── route.ts                # GET, PUT, DELETE
│       ├── activate/route.ts       # POST
│       ├── cancel/route.ts         # POST
│       └── add-funds/route.ts      # POST
├── donations/
│   ├── route.ts                    # GET (all/filter), POST
│   ├── link-project/route.ts       # POST
│   └── [id]/
│       ├── route.ts                # GET
│       ├── complete/route.ts       # POST
│       ├── fail/route.ts           # POST
│       └── refund/route.ts         # POST
├── users/
│   ├── route.ts                    # GET (all/by wallet), POST
│   └── [id]/
│       └── route.ts                # GET, PUT, DELETE
└── beneficiaries/
    ├── route.ts                    # GET (all), POST
    └── [id]/
        └── route.ts                # GET, PUT, DELETE
```

## Uso desde el Frontend

### Importar los servicios

```typescript
import { projectsApi, campaignsApi, donationsApi, usersApi, beneficiariesApi } from '@/lib/services/api';
```

### Ejemplos de uso

#### Projects

```typescript
// Obtener todas las campañas
const { data, success } = await projectsApi.getAll();

// Filtrar por creador
const { data } = await projectsApi.getByCreator('user-id');

// Filtrar por estado
const { data } = await projectsApi.getByStatus('ACTIVE');

// Crear campaña
const { data, success } = await projectsApi.create({
  title: 'Mi Campaña',
  description: 'Descripción',
  goalAmount: 1000,
  vaultAddress: '0x...',
  creatorId: 'user-id'
});

// Aprobar campaña
await projectsApi.approve('project-id');
```

#### Campaigns

```typescript
// Obtener todas las campañas
const { data } = await campaignsApi.getAll();

// Crear campaña
const { data } = await campaignsApi.create({
  title: 'Mi Campaña',
  description: 'Descripción',
  goalAmount: 5000,
  imageUrl: 'https://...'
});

// Activar campaña
await campaignsApi.activate('campaign-id');

// Agregar fondos
await campaignsApi.addFunds('campaign-id', 100);
```

#### Donations

```typescript
// Crear donación
const { data } = await donationsApi.create({
  userId: 'user-id',
  campaignId: 'campaign-id',
  amountWei: '1000000000000000000',
  paymentId: 'payment-id'
});

// Marcar como completada
await donationsApi.markAsCompleted('donation-id', '0x...');

// Vincular con campaña
await donationsApi.linkToProject('donation-id', 'project-id');
```

#### Users

```typescript
// Crear usuario
const { data } = await usersApi.create({
  wallet: '0x...',
  username: 'usuario123'
});

// Buscar por wallet
const { data } = await usersApi.getByWallet('0x...');

// Actualizar
await usersApi.update('user-id', { username: 'nuevo-nombre' });
```

#### Beneficiaries

```typescript
// Obtener todos
const { data } = await beneficiariesApi.getAll();

// Crear beneficiario
const { data } = await beneficiariesApi.create({
  name: 'Beneficiario 1',
  wallet: '0x...'
});
```

## Respuestas de la API

### Respuesta exitosa

```json
{
  "success": true,
  "data": { ... }
}
```

### Respuesta con error

```json
{
  "success": false,
  "error": "Mensaje de error",
  "code": "VALIDATION_ERROR"
}
```

## Códigos de Estado HTTP

- `200` - OK (GET, PUT exitoso)
- `201` - Created (POST exitoso)
- `400` - Bad Request (error de validación)
- `404` - Not Found (recurso no encontrado)
- `409` - Conflict (conflicto, ej: usuario duplicado)
- `500` - Internal Server Error (error inesperado)

## Arquitectura

```
Frontend (React Components)
    ↓
Services (lib/services/api/*.ts)
    ↓
API Routes (app/api/**/route.ts)
    ↓
Repositories (lib/infrastructure/repositories/PostgreSQL/*.ts)
    ↓
ORM/Database (Sequelize → PostgreSQL)
```

**Sin server actions, sin use cases** - Arquitectura simplificada y desacoplada.

