-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('STOCK', 'US_STOCK', 'MUTUAL_FUND', 'CRYPTO', 'FIXED_DEPOSIT', 'RECURRING_DEPOSIT', 'REAL_ESTATE', 'GOLD', 'SILVER', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'SELL', 'DIVIDEND', 'INTEREST', 'BONUS', 'SPLIT', 'MERGER', 'TRANSFER_IN', 'TRANSFER_OUT', 'SWP', 'STP', 'SIP', 'LUMPSUM', 'REDEMPTION', 'MATURITY', 'PREMATURE_WITHDRAWAL', 'RENTAL_INCOME', 'MAINTENANCE_FEE', 'PROPERTY_TAX', 'AIRDROP', 'STAKING_REWARD', 'FORK', 'ADJUSTMENT', 'FEE', 'TAX', 'REBALANCE');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('SAVINGS', 'CURRENT', 'DEMAT', 'NRE', 'NRO', 'FIXED_DEPOSIT', 'RECURRING_DEPOSIT', 'CREDIT_CARD', 'LOAN', 'WALLET', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('EQUITY', 'DEBT', 'HYBRID', 'INDEX', 'ETF', 'GOLD', 'REAL_ESTATE', 'CRYPTO', 'OTHER');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'FORTNIGHTLY', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'MATURITY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "MetalType" AS ENUM ('GOLD', 'SILVER', 'PLATINUM', 'OTHER');

-- CreateEnum
CREATE TYPE "MetalForm" AS ENUM ('COIN', 'BAR', 'JEWELRY', 'ETF', 'SOVEREIGN_GOLD_BOND', 'DIGITAL_GOLD', 'OTHER');

-- CreateEnum
CREATE TYPE "RealEstateType" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'PLOT', 'AGRICULTURAL', 'INDUSTRIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "RealEstatePurpose" AS ENUM ('SELF_OCCUPIED', 'RENTAL', 'INVESTMENT', 'VACATION_HOME', 'INHERITED', 'OTHER');

-- CreateEnum
CREATE TYPE "CompoundingFrequency" AS ENUM ('SIMPLE', 'QUARTERLY', 'MONTHLY', 'HALF_YEARLY', 'YEARLY', 'MATURITY');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "hashedPassword" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "timezone" TEXT DEFAULT 'Asia/Kolkata',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "locale" TEXT DEFAULT 'en-IN',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_members" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "baseCurrency" TEXT NOT NULL DEFAULT 'INR',
    "usdToInr" DOUBLE PRECISION NOT NULL DEFAULT 83.0,
    "monthStart" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allocation_targets" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "instrumentName" TEXT NOT NULL,
    "idealPct" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "allocation_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "month_aggregates" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "invested" DECIMAL(20,2) NOT NULL,
    "current" DECIMAL(20,2) NOT NULL,
    "pnl" DECIMAL(20,2) NOT NULL,
    "pnlPct" DOUBLE PRECISION NOT NULL,
    "growthMoM" DECIMAL(20,2) NOT NULL,
    "growthMoMPct" DOUBLE PRECISION NOT NULL,
    "investedMoM" DECIMAL(20,2) NOT NULL,
    "investedMoMPct" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "month_aggregates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_holdings" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "symbol" TEXT,
    "marketCap" TEXT,
    "industry" TEXT,
    "avgBuyPrice" DECIMAL(20,2) NOT NULL,
    "qty" INTEGER NOT NULL,
    "cmp" DECIMAL(20,2) NOT NULL,
    "invested" DECIMAL(20,2) NOT NULL,
    "currentValue" DECIMAL(20,2) NOT NULL,
    "pnl" DECIMAL(20,2) NOT NULL,
    "pnlPct" DOUBLE PRECISION NOT NULL,
    "isLongTerm" BOOLEAN NOT NULL DEFAULT false,
    "performance" JSONB,
    "sellDate" TIMESTAMP(3),
    "reviewDate" TIMESTAMP(3),
    "buyReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "us_stock_holdings" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avgBuyPriceUsd" DECIMAL(20,2) NOT NULL,
    "qty" DECIMAL(10,4) NOT NULL,
    "investedUsd" DECIMAL(20,2) NOT NULL,
    "currentUsd" DECIMAL(20,2) NOT NULL,
    "pnlUsd" DECIMAL(20,2) NOT NULL,
    "pnlPctUsd" DOUBLE PRECISION NOT NULL,
    "avgBuyPriceInr" DECIMAL(20,2) NOT NULL,
    "investedInr" DECIMAL(20,2) NOT NULL,
    "currentInr" DECIMAL(20,2) NOT NULL,
    "pnlInr" DECIMAL(20,2) NOT NULL,
    "pnlPctInr" DOUBLE PRECISION NOT NULL,
    "symbol" TEXT,
    "exchange" TEXT DEFAULT 'NYSE',
    "sector" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "us_stock_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mutual_fund_holdings" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "fundName" TEXT NOT NULL,
    "fundType" TEXT,
    "amcName" TEXT,
    "folioNumber" TEXT,
    "invested" DECIMAL(20,2) NOT NULL,
    "current" DECIMAL(20,2) NOT NULL,
    "returns" DECIMAL(20,2) NOT NULL,
    "returnsPct" DOUBLE PRECISION NOT NULL,
    "units" DECIMAL(12,4) NOT NULL,
    "nav" DECIMAL(12,4) NOT NULL,
    "navDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mutual_fund_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sip_plans" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "fundName" TEXT NOT NULL,
    "type" TEXT,
    "sipAmount" DECIMAL(12,2) NOT NULL,
    "sipDayOfMonth" INTEGER NOT NULL DEFAULT 1,
    "stepUpEnabled" BOOLEAN NOT NULL DEFAULT false,
    "stepUpAmount" DECIMAL(12,2),
    "stepUpFrequency" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "totalInvested" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "currentValue" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "returns" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "returnsPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sip_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crypto_holdings" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "qty" DECIMAL(24,8) NOT NULL,
    "avgPrice" DECIMAL(20,2) NOT NULL,
    "invested" DECIMAL(20,2) NOT NULL,
    "currentPrice" DECIMAL(20,2) NOT NULL,
    "currentValue" DECIMAL(20,2) NOT NULL,
    "returns" DECIMAL(20,2) NOT NULL,
    "returnsPct" DOUBLE PRECISION NOT NULL,
    "walletAddress" TEXT,
    "exchange" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crypto_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ipo_applications" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "rate" DECIMAL(10,2) NOT NULL,
    "qty" INTEGER NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "allotedQty" INTEGER NOT NULL DEFAULT 0,
    "allotedAmount" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "listingPrice" DECIMAL(10,2),
    "listingGain" DECIMAL(20,2),
    "listingGainPct" DOUBLE PRECISION,
    "holdLongTerm" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ipo_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metal_transactions" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "metal" "MetalType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "MetalForm" NOT NULL,
    "qty" DECIMAL(12,4) NOT NULL,
    "rate" DECIMAL(12,2) NOT NULL,
    "purchasePrice" DECIMAL(20,2) NOT NULL,
    "currentRate" DECIMAL(12,2) NOT NULL,
    "currentValue" DECIMAL(20,2) NOT NULL,
    "returns" DECIMAL(20,2) NOT NULL,
    "returnsPct" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metal_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "real_estates" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RealEstateType" NOT NULL,
    "address" TEXT NOT NULL,
    "mapUrl" TEXT,
    "buyDate" TIMESTAMP(3) NOT NULL,
    "buyPrice" DECIMAL(20,2) NOT NULL,
    "currentPrice" DECIMAL(20,2) NOT NULL,
    "currentValue" DECIMAL(20,2) NOT NULL,
    "xirr" DOUBLE PRECISION,
    "area" DECIMAL(10,2),
    "unitNumber" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'India',
    "pinCode" TEXT,
    "purpose" "RealEstatePurpose" NOT NULL,
    "isLongTerm" BOOLEAN NOT NULL DEFAULT false,
    "docsUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "real_estates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "real_estate_cashflows" (
    "id" TEXT NOT NULL,
    "realEstateId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "real_estate_cashflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixed_deposits" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "principal" DECIMAL(20,2) NOT NULL,
    "interestRatePct" DECIMAL(5,2) NOT NULL,
    "compounding" "CompoundingFrequency" NOT NULL DEFAULT 'QUARTERLY',
    "maturityDate" TIMESTAMP(3) NOT NULL,
    "maturityAmount" DECIMAL(20,2) NOT NULL,
    "currentValue" DECIMAL(20,2) NOT NULL,
    "interestEarned" DECIMAL(20,2) NOT NULL,
    "purpose" TEXT,
    "isTaxSaving" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fixed_deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurring_deposits" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "monthlyAmount" DECIMAL(20,2) NOT NULL,
    "interestRatePct" DECIMAL(5,2) NOT NULL,
    "totalMonths" INTEGER NOT NULL,
    "maturityDate" TIMESTAMP(3) NOT NULL,
    "maturityAmount" DECIMAL(20,2) NOT NULL,
    "currentValue" DECIMAL(20,2) NOT NULL,
    "interestEarned" DECIMAL(20,2) NOT NULL,
    "monthsCompleted" INTEGER NOT NULL,
    "purpose" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring_deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chits" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "totalAmount" DECIMAL(20,2) NOT NULL,
    "monthlyAmount" DECIMAL(20,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "xirr" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chit_transactions" (
    "id" TEXT NOT NULL,
    "chitId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "isBid" BOOLEAN NOT NULL DEFAULT false,
    "isDividend" BOOLEAN NOT NULL DEFAULT false,
    "dividendEarned" DECIMAL(20,2),
    "paidCumulative" DECIMAL(20,2),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fx_transfers" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mxn" DECIMAL(20,2) NOT NULL,
    "cryptoName" TEXT NOT NULL,
    "cryptoRateMxn" DECIMAL(20,2) NOT NULL,
    "qty" DECIMAL(24,8) NOT NULL,
    "cryptoInInr" DECIMAL(20,2) NOT NULL,
    "inrConversionValue" DECIMAL(20,2) NOT NULL,
    "finalInrInBank" DECIMAL(20,2) NOT NULL,
    "cryptoCommissionInr" DECIMAL(20,2) NOT NULL,
    "cryptoCommissionRate" DECIMAL(5,2) NOT NULL,
    "altCryptoRate" DECIMAL(20,2),
    "paysendCommissionInr" DECIMAL(20,2),
    "paysendRate" DECIMAL(20,2),
    "paysendFinalInr" DECIMAL(20,2),
    "differenceInr" DECIMAL(20,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fx_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fx_price_references" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "crypto" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "buyPriceMxn" DECIMAL(20,2) NOT NULL,
    "sellPriceInr" DECIMAL(20,2) NOT NULL,
    "commissionPct" DECIMAL(5,2) NOT NULL,
    "conversionRateNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fx_price_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savings_ledger" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "details" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "typeAF" TEXT,
    "category" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "savings_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_key" ON "verification_tokens"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_members_workspaceId_userId_key" ON "workspace_members"("workspaceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "settings_workspaceId_key" ON "settings"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "allocation_targets_workspaceId_instrumentName_key" ON "allocation_targets"("workspaceId", "instrumentName");

-- CreateIndex
CREATE UNIQUE INDEX "month_aggregates_workspaceId_month_key" ON "month_aggregates"("workspaceId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "stock_holdings_workspaceId_name_symbol_key" ON "stock_holdings"("workspaceId", "name", "symbol");

-- CreateIndex
CREATE UNIQUE INDEX "us_stock_holdings_workspaceId_name_symbol_key" ON "us_stock_holdings"("workspaceId", "name", "symbol");

-- CreateIndex
CREATE UNIQUE INDEX "mutual_fund_holdings_workspaceId_fundName_folioNumber_key" ON "mutual_fund_holdings"("workspaceId", "fundName", "folioNumber");

-- CreateIndex
CREATE UNIQUE INDEX "crypto_holdings_workspaceId_name_symbol_walletAddress_key" ON "crypto_holdings"("workspaceId", "name", "symbol", "walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "fx_price_references_workspaceId_crypto_date_key" ON "fx_price_references"("workspaceId", "crypto", "date");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX "activity_logs_workspaceId_idx" ON "activity_logs"("workspaceId");

-- CreateIndex
CREATE INDEX "activity_logs_entityType_entityId_idx" ON "activity_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allocation_targets" ADD CONSTRAINT "allocation_targets_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "month_aggregates" ADD CONSTRAINT "month_aggregates_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_holdings" ADD CONSTRAINT "stock_holdings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "us_stock_holdings" ADD CONSTRAINT "us_stock_holdings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutual_fund_holdings" ADD CONSTRAINT "mutual_fund_holdings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sip_plans" ADD CONSTRAINT "sip_plans_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crypto_holdings" ADD CONSTRAINT "crypto_holdings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ipo_applications" ADD CONSTRAINT "ipo_applications_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metal_transactions" ADD CONSTRAINT "metal_transactions_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "real_estates" ADD CONSTRAINT "real_estates_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "real_estate_cashflows" ADD CONSTRAINT "real_estate_cashflows_realEstateId_fkey" FOREIGN KEY ("realEstateId") REFERENCES "real_estates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_deposits" ADD CONSTRAINT "fixed_deposits_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_deposits" ADD CONSTRAINT "recurring_deposits_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chits" ADD CONSTRAINT "chits_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chit_transactions" ADD CONSTRAINT "chit_transactions_chitId_fkey" FOREIGN KEY ("chitId") REFERENCES "chits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fx_transfers" ADD CONSTRAINT "fx_transfers_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fx_price_references" ADD CONSTRAINT "fx_price_references_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_ledger" ADD CONSTRAINT "savings_ledger_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
