import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.therapist.createMany({
    data: [
      { name: "Dr. Ayesha Khan", address: "23 Clifton Block 5, Karachi", email: "ayesha.khan@example.com" },
      { name: "Dr. Hamza Malik", address: "12 F-6 Markaz, Islamabad", email: "hamza.malik@example.com" },
      { name: "Dr. Sana Tariq", address: "101 Gulberg III, Lahore", email: "sana.tariq@example.com" },
      { name: "Dr. Usman Raza", address: "45 DHA Phase 6, Karachi", email: "usman.raza@example.com" },
      { name: "Dr. Rabia Ahmed", address: "67 Bahria Town Phase 4, Islamabad", email: "rabia.ahmed@example.com" },
      { name: "Dr. Bilal Qureshi", address: "89 Johar Town, Lahore", email: "bilal.qureshi@example.com" },
      { name: "Dr. Hira Zafar", address: "150 North Nazimabad Block H, Karachi", email: "hira.zafar@example.com" },
      { name: "Dr. Farhan Siddiqui", address: "33 G-10/2, Islamabad", email: "farhan.siddiqui@example.com" },
      { name: "Dr. Niaz Ahmad", address: "78 DHA Phase 5, Lahore", email: "niaz.ahmad@example.com" },
      { name: "Dr. Zohaib Ali", address: "92 PECHS Block 2, Karachi", email: "zohaib.ali@example.com" },
      { name: "Dr. Nida Hassan", address: "18 E-11/3, Islamabad", email: "nida.hassan@example.com" },
      { name: "Dr. Taimoor Shah", address: "36 Model Town, Lahore", email: "taimoor.shah@example.com" },
      { name: "Dr. Mahnoor Javed", address: "29 Gulshan-e-Iqbal Block 13D, Karachi", email: "mahnoor.javed@example.com" },
      { name: "Dr. Danish Irfan", address: "65 G-9/4, Islamabad", email: "danish.irfan@example.com" },
      { name: "Dr. Sumbul Riaz", address: "53 Wapda Town, Lahore", email: "sumbul.riaz@example.com" },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());