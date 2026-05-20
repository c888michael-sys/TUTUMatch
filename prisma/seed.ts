// Seed: two demo schools + the canonical NSW HSC subject list.
// Run: pnpm seed  (after pnpm prisma:migrate)

import { PrismaClient } from "@prisma/client";
import { SCHOOLS } from "../src/lib/schools";

const prisma = new PrismaClient();

async function main() {
  for (const s of SCHOOLS) {
    await prisma.school.upsert({
      where: { slug: s.id },
      update: {
        name: s.name,
        shortName: s.short,
        tagline: s.tagline,
        primaryColor: s.brand,
        brandDeep: s.brandDeep,
        brandSoft: s.brandSoft,
        active: s.active,
      },
      create: {
        slug: s.id,
        name: s.name,
        shortName: s.short,
        tagline: s.tagline,
        primaryColor: s.brand,
        brandDeep: s.brandDeep,
        brandSoft: s.brandSoft,
        active: s.active,
      },
    });
    console.log(`seeded school: ${s.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
