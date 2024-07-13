import { SuccessResponse } from '@/base/common/responses/success.response';
import { LoginSuccessPayload } from '@/modules/auth/responses/login-success.response';

export class RefreshSuccessPayload extends LoginSuccessPayload {}

export type RefreshSuccessResponse = SuccessResponse<RefreshSuccessPayload>;
