-- AlterTable
ALTER TABLE "form_data" ADD CONSTRAINT "form_data_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "query" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "form_data_id" UUID NOT NULL,

    CONSTRAINT "query_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "query_form_data_id_key" ON "query"("form_data_id");

-- CreateIndex
CREATE INDEX "query_form_data_id_idx" ON "query"("form_data_id");

-- AddForeignKey
ALTER TABLE "query" ADD CONSTRAINT "query_form_data_id_fkey" FOREIGN KEY ("form_data_id") REFERENCES "form_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
