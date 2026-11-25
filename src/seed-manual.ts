import { prisma } from './db.js';

async function main() {
  const marta = await prisma.user.upsert({
    where: { email: 'marta@academia.dev' },
    update: {},
    create: {
      email: 'marta@academia.dev',
      name: 'Marta',
      password: '123',
      role: 'INSTRUCTOR',
    },
  });
  console.log('instructora →', marta.id, marta.name);

  for (const name of ['Backend', 'Bases de datos']) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('categorías: ', await prisma.category.count());

  await prisma.course.deleteMany({ where: { instructorId: marta.id } });

  const count = await prisma.course.createMany({
    data: [
      {
        title: 'TypeScript desde cero',
        description: 'Fundamentos de TypeScript para backend',
        price: 49.99,
        level: 'BEGINNER',
        published: true,
        instructorId: marta.id,
      },
      {
        title: 'Prisma avanzado',
        description: 'Relaciones, transacciones y rendimiento con Prisma',
        price: 89.99,
        level: 'ADVANCED',
        published: false,
        instructorId: marta.id,
      },
    ],
  });
  console.log('cursos creados: ', count);

  const published = await prisma.course.findMany({
    where: { published: true },
    include: { instructor: { select: { name: true } } },
  });
  console.log(
    'publicados →',
    published.map((c) => `${c.title} (${c.instructor.name})`),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
