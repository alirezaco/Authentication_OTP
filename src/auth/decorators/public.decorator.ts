import { GlobalConstantKey } from '@/src/config/constant';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(GlobalConstantKey.IS_PUBLIC_KEY, true);
