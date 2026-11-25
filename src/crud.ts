// src/crud.ts · Ejecutar: npx tsx src/crud.ts
// Esqueleto: escribe tú cada línea marcada ✍️ (el código completo está en las slides y justo debajo).
import { prisma } from './db.js';

async function main() {
  // Create ✍️ const user = await prisma.user.create({ data: { … } });
  //   email `ana+${Date.now()}@academia.dev` (único en cada ejecución), name 'Ana',
  //   password 'hashed-password-placeholder' (sesión 4: Argon2id), role 'INSTRUCTOR'

  const user = await prisma.user.create({
    data: {
      email: `emcarrio${Date.now()}@dev.es`,
      name: 'emilio',
      password: '123',
    },
  });

  console.log('create →', user);

  // Read ✍️ const found = … findUnique por email (user.email)
  //      ✍️ const instructors = … findMany con where role 'INSTRUCTOR'

  const found = await prisma.user.findFirst({
    where: { email: 'emcarrio@dev.es' },
  });
  const instructors = await prisma.user.findMany({
    where: { role: 'INSTRUCTOR' },
  });

  console.log(
    'findUnique →',
    found?.name,
    '| instructores:',
    instructors.length,
  );

  // Si no existe → null (no excepción) ✍️ const maybeUser = … findUnique con id 999_999
  const maybeUser = await prisma.user.findFirst({
    where: { id: 999999 },
  });

  console.log('id inexistente →', maybeUser?.name);

  // Update ✍️ const updated = … update por user.id, name 'Ana García'

  const updated = await prisma.user.update({
    where: { id: 1 },
    data: {
      name: 'Emilio 2',
    },
  });

  console.log('update →', updated?.name);

  // Count
  console.log('total usuarios →', await prisma.user.count());

  // Delete ✍️ … delete por user.id

  await prisma.user.delete({
    where: { id: user.id },
  });

  console.log('delete → ok');
}

main().finally(() => prisma.$disconnect());
