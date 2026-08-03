-- tambah total sementara dengan default
ALTER TABLE "Order"
ADD COLUMN "total" INTEGER NOT NULL DEFAULT 0;
-- isi productId yang masih null
UPDATE "Order"
SET "productId" = (
    SELECT id
    FROM "Product"
    LIMIT 1
  )
WHERE "productId" IS NULL;
-- ubah productId jadi wajib
ALTER TABLE "Order"
ALTER COLUMN "productId"
SET NOT NULL;