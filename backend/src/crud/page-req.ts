import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {PageRequestParser} from '@be/crud/page-request.parser';
import {PageRequest} from '@be/crud/page-request';

const pageRequestParser = new PageRequestParser();

export const PageReq = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): PageRequest => pageRequestParser.parse(ctx.switchToHttp().getRequest())
);
