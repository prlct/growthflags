import { AppKoaContext, Next } from 'types';
import { applicationService } from 'resources/application';

const jsSdkPublicAuth = async (ctx: AppKoaContext, next: Next) => {
  if (!ctx.state.sdkAccessToken) {
    ctx.status = 401;
    ctx.body = {};
    return null;
  }

  const application = await applicationService.findOne({ publicApiKey: ctx.state.sdkAccessToken });

  if (application) {
    ctx.state.application = application;
    return next();
  }

  ctx.status = 403;
  ctx.body = {};
  return null;
};

export default jsSdkPublicAuth;
