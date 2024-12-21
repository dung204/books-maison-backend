import { ParseFilePipeBuilder, UploadedFile } from '@nestjs/common';

import { CustomFileValidator } from '@/modules/media/validators/custom-file.validator';

export const CustomUploadedFile = () =>
  UploadedFile(
    new ParseFilePipeBuilder().addValidator(new CustomFileValidator()).build({
      fileIsRequired: true,
    }),
  );
