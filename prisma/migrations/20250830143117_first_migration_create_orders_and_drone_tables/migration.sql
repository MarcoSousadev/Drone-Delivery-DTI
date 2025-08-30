-- CreateTable
CREATE TABLE "public"."Drone" (
    "id" TEXT NOT NULL,
    "baseLongitude" DECIMAL(65,30) NOT NULL,
    "baseLatitude" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Drone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "packageWeight" DECIMAL(65,30) NOT NULL,
    "priority" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
