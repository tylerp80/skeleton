-- CreateTable
CREATE TABLE "Gratitude" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gratitude_pkey" PRIMARY KEY ("id")
);
