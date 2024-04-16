-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('SSR', 'SR', 'S', 'A', 'B');

-- CreateEnum
CREATE TYPE "Class" AS ENUM ('FIGHTHER', 'TANKER', 'SUPPORTER', 'ASSASSIN');

-- CreateEnum
CREATE TYPE "FormationSlot" AS ENUM ('x0_y0', 'x0_y1', 'x0_y2', 'x1_y0', 'x1_y1', 'x1_y2', 'x2_y0', 'x2_y1', 'x2_y2');

-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('WHITE0', 'GREEN0', 'GREEN1', 'BLUE0', 'BLUE1', 'BLUE2', 'DEATH0', 'DEATH1', 'DEATH2', 'DEATH3', 'GOLDEN0', 'GOLDEN1', 'GOLDEN2', 'GOLDEN3', 'GOLDEN4', 'BLOOD0', 'BLOOD1', 'BLOOD2', 'BLOOD3', 'BLOOD4', 'BLOOD5');

-- CreateEnum
CREATE TYPE "FormationUsageType" AS ENUM ('ATTACK', 'DEFENSE');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ninja" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" "Tier" NOT NULL,
    "class" "Class" NOT NULL,
    "attack" DOUBLE PRECISION NOT NULL,
    "defense" DOUBLE PRECISION NOT NULL,
    "healthPoint" DOUBLE PRECISION NOT NULL,
    "critDamage" DOUBLE PRECISION NOT NULL,
    "critRate" DOUBLE PRECISION NOT NULL,
    "critResist" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "dodge" DOUBLE PRECISION NOT NULL,
    "pierce" DOUBLE PRECISION NOT NULL,
    "toughness" DOUBLE PRECISION NOT NULL,
    "damageAmplification" DOUBLE PRECISION NOT NULL,
    "damageReduction" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "specialLevelUpBonusStats" JSONB NOT NULL,

    CONSTRAINT "Ninja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayersOwnNinjas" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "ninjaId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" INTEGER NOT NULL,
    "star" INTEGER NOT NULL,
    "grade" "Grade" NOT NULL,

    CONSTRAINT "PlayersOwnNinjas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "slot1" "FormationSlot" NOT NULL,
    "slot2" "FormationSlot" NOT NULL,
    "slot3" "FormationSlot" NOT NULL,
    "slot4" "FormationSlot" NOT NULL,
    "slot5" "FormationSlot" NOT NULL,
    "stats" JSONB NOT NULL,
    "levelUpBonusStats" JSONB NOT NULL,

    CONSTRAINT "Formation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayersOwnFormations" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "PlayersOwnFormations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsingFormation" (
    "id" TEXT NOT NULL,
    "refOwnedFormationId" TEXT NOT NULL,
    "type" "FormationUsageType" NOT NULL,

    CONSTRAINT "UsingFormation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NinjasInUsingFormations" (
    "id" TEXT NOT NULL,
    "refNinjaId" TEXT NOT NULL,
    "refUsingFormationId" TEXT NOT NULL,
    "slot" "FormationSlot" NOT NULL,

    CONSTRAINT "NinjasInUsingFormations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayersOwnNinjas" ADD CONSTRAINT "PlayersOwnNinjas_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayersOwnNinjas" ADD CONSTRAINT "PlayersOwnNinjas_ninjaId_fkey" FOREIGN KEY ("ninjaId") REFERENCES "Ninja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayersOwnFormations" ADD CONSTRAINT "PlayersOwnFormations_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayersOwnFormations" ADD CONSTRAINT "PlayersOwnFormations_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsingFormation" ADD CONSTRAINT "UsingFormation_refOwnedFormationId_fkey" FOREIGN KEY ("refOwnedFormationId") REFERENCES "PlayersOwnFormations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NinjasInUsingFormations" ADD CONSTRAINT "NinjasInUsingFormations_refNinjaId_fkey" FOREIGN KEY ("refNinjaId") REFERENCES "PlayersOwnNinjas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NinjasInUsingFormations" ADD CONSTRAINT "NinjasInUsingFormations_refUsingFormationId_fkey" FOREIGN KEY ("refUsingFormationId") REFERENCES "UsingFormation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
