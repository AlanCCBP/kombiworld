# Sistema de Autenticación KombiWorld

Sistema completo de autenticación con JWT, refresh tokens, y recuperación de contraseña.

## 🎯 Características Implementadas

### Backend (User Service)

✅ **Registro de usuarios** (`POST /auth/register`)
- Validación de email único
- Hash de contraseñas con bcrypt
- Asignación automática de rol USER
- Generación de access y refresh tokens
- Almacenamiento de refresh token en BD

✅ **Login** (`POST /auth/login`)
- Validación de credenciales
- Verificación de estado del usuario (no eliminado, no baneado)
- Generación de tokens JWT
- Refresh token almacenado en cookie httpOnly

✅ **Logout** (`POST /auth/logout`)
- Revocación de refresh tokens específicos o todos
- Incremento de tokenVersion para invalidar tokens existentes
- Limpieza de cookies

✅ **Refresh Token** (`POST /auth/refresh`)
- Renovación automática de access tokens
- Validación de refresh token en BD
- Verificación de expiración y revocación

✅ **Recuperación de Contraseña**
- Solicitud de reset (`POST /auth/forgot-password`)
- Reset de contraseña (`POST /auth/reset-password`)
- Tokens de un solo uso con expiración de 1 hora
- Invalidación de todos los tokens al cambiar contraseña

✅ **Usuario Actual** (`GET /auth/me`)
- Obtener datos del usuario autenticado
- Protegido por middleware de autenticación

### Frontend (Next.js)

✅ **Páginas de Autenticación**
- `/login` - Inicio de sesión
- `/register` - Registro de nuevos usuarios
- `/forgot-password` - Solicitud de recuperación
- `/reset-password` - Reset con token

✅ **Contexto de Autenticación**
- `AuthContext` para estado global del usuario
- Refresh automático de tokens cada 14 minutos
- Manejo de logout automático si falla el refresh

✅ **Navbar Dinámico**
- Muestra opciones diferentes para usuarios autenticados
- Botón de logout
- Información del usuario

## 📁 Estructura de Archivos

### Backend (`services/users/`)

```
services/users/src/
├── controllers/
│   ├── authController.ts      # Controladores de autenticación
│   └── userController.ts      # Controladores de usuarios
├── services/
│   ├── authService.ts         # Lógica de negocio de auth
│   └── userService.ts         # Lógica de negocio de users
├── middlewares/
│   └── authMiddleware.ts      # Verificación de JWT y roles
├── routes/
│   ├── authRoutes.ts          # Rutas de /auth
│   └── userRoutes.ts          # Rutas de /users
├── utils/
│   ├── jwt.ts                 # Utilidades JWT
│   └── email.ts               # Envío de emails (por implementar)
└── types/
    └── user.types.ts          # Tipos TypeScript
```

### Frontend (`apps/web/`)

```
apps/web/app/
├── context/
│   └── AuthContext.tsx        # Contexto global de autenticación
├── components/
│   └── NavbarPublic.tsx       # Navbar con estado de auth
├── login/
│   └── page.tsx               # Página de login
├── register/
│   └── page.tsx               # Página de registro
├── forgot-password/
│   └── page.tsx               # Solicitud de recuperación
└── reset-password/
    └── page.tsx               # Reset de contraseña
```

## 🔐 Seguridad Implementada

### Tokens

1. **Access Token**
   - Expiración: 15 minutos
   - Almacenado en localStorage
   - Usado en header `Authorization: Bearer <token>`

2. **Refresh Token**
   - Expiración: 7 días
   - Almacenado en cookie httpOnly
   - No accesible desde JavaScript
   - Flags: `secure` (solo HTTPS en producción), `sameSite: strict`

3. **Token Version**
   - Campo en usuario para invalidar todos los tokens
   - Se incrementa en logout y cambio de contraseña

### Base de Datos

```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  userId    String   
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  revokedAt DateTime?
  
  user      User     @relation(...)
}

model PasswordReset {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())
  
  user      User     @relation(...)
}
```

## 🚀 Uso

### Configuración

1. **Variables de entorno** (`services/users/.env.dev`):
```env
DATABASE_URL_USERS=postgresql://...
JWT_ACCESS_SECRET=tu_secreto_aqui
JWT_REFRESH_SECRET=otro_secreto_aqui
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=4001
```

2. **Frontend** (`apps/web/.env.development`):
```env
NEXT_PUBLIC_USERS_SERVICE_URL=http://localhost/users
```

### Migrar la Base de Datos

```bash
cd services/users
npm run db:push
# o
npm run db:migrate
```

### Iniciar Servicios

```bash
# Desde la raíz del proyecto
cd infra
docker compose -f docker-compose.dev.yml up --build
```

### Endpoints Disponibles

#### Públicos (sin autenticación)

```bash
# Registrar usuario
POST /auth/register
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "docType": "DNI",
  "docNumber": "12345678",
  "email": "juan@example.com",
  "phone": "+54 9 11 1234-5678",
  "birthdate": "1990-01-01",
  "address": "Calle 123",
  "password": "password123"
}

# Login
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}

# Solicitar reset de contraseña
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "juan@example.com"
}

# Resetear contraseña
POST /auth/reset-password
Content-Type: application/json

{
  "token": "abc123...",
  "newPassword": "newpassword123"
}

# Refresh token
POST /auth/refresh
# (cookie con refreshToken se envía automáticamente)
```

#### Protegidos (requieren autenticación)

```bash
# Logout
POST /auth/logout
Authorization: Bearer <access_token>

# Obtener usuario actual
GET /auth/me
Authorization: Bearer <access_token>
```

## 🎨 Uso en el Frontend

### Usar el contexto de autenticación

```tsx
import { useAuth } from "@/app/context/AuthContext";

function MiComponente() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>No estás autenticado</div>;
  }

  return (
    <div>
      <p>Hola, {user.firstName}!</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

### Hacer requests autenticados

```tsx
const accessToken = localStorage.getItem("accessToken");

const response = await fetch(`${API_URL}/endpoint`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
  },
  credentials: "include", // Importante para cookies
});
```

## 📧 Próximos Pasos

### Por Implementar

1. **Envío Real de Emails**
   - Integrar Nodemailer, SendGrid, o AWS SES
   - Templates HTML para emails
   - Ver `/services/users/src/utils/email.ts`

2. **Verificación de Email**
   - Enviar email de confirmación al registrarse
   - Tabla `EmailVerification` en BD
   - Endpoint `/auth/verify-email`

3. **Two-Factor Authentication (2FA)**
   - TOTP con Google Authenticator
   - SMS 2FA

4. **Rate Limiting**
   - Limitar intentos de login
   - Limitar requests de reset password

5. **Logs de Seguridad**
   - Registrar logins exitosos y fallidos
   - IP, user-agent, timestamp
   - Dashboard de actividad sospechosa

6. **OAuth / Social Login**
   - Login con Google
   - Login con Facebook
   - Usar NextAuth.js o similar

## 🐛 Debugging

### Ver tokens en cookies

En Chrome DevTools:
1. Application > Cookies
2. Buscar `refreshToken`

### Ver logs del backend

```bash
docker logs kombi_users -f
```

### Testear endpoints

```bash
# Login
curl -X POST http://localhost/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}' \
  -c cookies.txt

# Usar refresh token
curl -X POST http://localhost/users/auth/refresh \
  -b cookies.txt

# Logout
curl -X POST http://localhost/users/auth/logout \
  -H "Authorization: Bearer <access_token>" \
  -b cookies.txt
```

## 🔒 Mejores Prácticas Implementadas

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Refresh tokens en cookies httpOnly
- ✅ Access tokens de corta duración (15 min)
- ✅ Tokens de reset de un solo uso
- ✅ Validación de email único
- ✅ Soft delete de usuarios (no se eliminan, se marca deletedAt)
- ✅ Token versioning para invalidación masiva
- ✅ Roles de usuario
- ✅ Middleware de autenticación y autorización

## 📚 Referencias

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
