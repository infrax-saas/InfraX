-- CreateTable
CREATE TABLE "AppUser" (
    "id" TEXT NOT NULL,
    "googleId" TEXT,
    "githubId" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image" TEXT,
    "passwordHash" TEXT,
    "saasId" TEXT NOT NULL,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_googleId_key" ON "AppUser"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_githubId_key" ON "AppUser"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_email_key" ON "AppUser"("email");
