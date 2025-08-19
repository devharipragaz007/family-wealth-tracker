-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'SELL', 'DIVIDEND', 'INTEREST', 'BONUS', 'SPLIT', 'MERGER', 'TRANSFER_IN', 'TRANSFER_OUT', 'SWP', 'STP', 'SIP', 'LUMPSUM', 'REDEMPTION', 'MATURITY', 'PREMATURE_WITHDRAWAL', 'RENTAL_INCOME', 'MAINTENANCE_FEE', 'PROPERTY_TAX', 'AIRDROPS', 'STAKING_REWARDS', 'FORKS', 'ADJUSTMENTS', 'FEES', 'TAXES', 'REBALANCE');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'FORTNIGHTLY', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'MATURITY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CompoundingFrequency" AS ENUM ('SIMPLE', 'QUARTERLY', 'MONTHLY', 'HALF_YEARLY', 'YEARLY', 'MATURITY');

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspaceId" UUID NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "holdingId" UUID,
    "assetType" "AssetType",
    "quantity" DECIMAL(36,18),
    "price" DECIMAL(36,18),
    "exchangeRate" DECIMAL(19,6),
    "fromAccountId" UUID,
    "toAccountId" UUID,
    "tax" DECIMAL(19,4),
    "fee" DECIMAL(19,4),
    "reference" TEXT,
    "notes" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "frequency" "Frequency",
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transactions_workspaceId_date_idx" ON "transactions"("workspaceId", "date");

-- CreateIndex
CREATE INDEX "transactions_holdingId_idx" ON "transactions"("holdingId");

-- CreateIndex
CREATE INDEX "transactions_fromAccountId_idx" ON "transactions"("fromAccountId");

-- CreateIndex
CREATE INDEX "transactions_toAccountId_idx" ON "transactions"("toAccountId");

-- CreateIndex
CREATE INDEX "transactions_assetType_idx" ON "transactions"("assetType");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_holdingId_fkey" FOREIGN KEY ("holdingId") REFERENCES "holdings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
