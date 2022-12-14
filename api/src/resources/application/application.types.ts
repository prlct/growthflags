export enum Env {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  DEMO = 'demo',
  PRODUCTION = 'production',
}

type EnvData = {
  totalUsersCount: number
};

export type Application = {
  _id: string;
  companyId: string;
  publicApiKey: string;
  privateApiKey: string;
  featureIds: string[];
  trackEnabled: boolean;
  sdkInstalled?: boolean;
  gmailCredentials?: {
    [key in string]: {
      accessToken: string,
      refreshToken: string,
    }
  },
  events?: {
    label: string,
    value: string,
  }[],
  envs: {
    [Env.DEVELOPMENT]: EnvData,
    [Env.STAGING]: EnvData,
    [Env.DEMO]: EnvData,
    [Env.PRODUCTION]: EnvData,
  };
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date | null;
};
