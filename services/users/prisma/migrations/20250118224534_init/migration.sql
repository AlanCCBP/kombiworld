-- Create Enum for Status
CREATE TYPE status AS ENUM ('ADMIN', 'USER', 'BANNED');
CREATE TYPE doc_type AS ENUM ('DNI', 'LC', 'LE', 'CUIT', 'CUIL', 'OTHER');

-- Create Table: Role
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create Table: User
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    doc_type doc_type NOT NULL DEFAULT 'DNI',
    doc_number TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    alt_phone TEXT,
    birthdate TIMESTAMP(3),
    address TEXT,
    password TEXT NOT NULL,
    status status NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP(3)
);

-- Create pivot table: user_role
CREATE TABLE user_role (
    role_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    CONSTRAINT user_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT user_role_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT user_role_pkey PRIMARY KEY (role_id, user_id)
);

-- Create index for user_id to speed up queries
CREATE INDEX user_role_user_id_index ON user_role(user_id);
