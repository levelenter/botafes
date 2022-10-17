import { PrismaClient, Prisma, Position } from "@prisma/client";
const prisma = new PrismaClient();

// モデル投入用のデータ定義
const positionData: { id: number; lat: string; lng: string; title: string }[] =
  [
    {
      id: 1,
      lat: "34.6745469127447",
      lng: "135.49032039571802",
      title: "堀江小学校",
    },
    {
      id: 2,
      lat: "34.67553087191428",
      lng: "135.4933715822677",
      title: "西大橋駅",
    },
  ];

const transfer = async () => {
  return await prisma.$transaction(
    positionData.map((value) => {
      return prisma.position.upsert({
        where: { id: value.id },
        update: {
          lat: value.lat,
          lng: value.lng,
          title: value.title,
        },
        create: {
          lat: value.lat,
          lng: value.lng,
          title: value.title,
        },
      });
    })
  );
};

// 定義されたデータを実際のモデルへ登録する処理
const main = async () => {
  console.log(`Start seeding ...`);

  await transfer();

  console.log(`Seeding finished.`);
};

// 処理開始
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
