import { SuccessResponse } from '@/base/common/responses';
import { LoginSuccessPayload } from '@/modules/auth/responses';

export class RefreshSuccessPayload extends LoginSuccessPayload {}

export type RefreshSuccessResponse = SuccessResponse<RefreshSuccessPayload>;
