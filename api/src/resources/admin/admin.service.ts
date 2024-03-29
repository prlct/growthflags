import _ from 'lodash';

import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './admin.schema';
import { Admin } from './admin.types';
import { companyService } from 'resources/company';

const service = db.createService<Admin>(DATABASE_DOCUMENTS.ADMINS, { schema });

const attachStripeCustomerId = async (data: any) => {
  const admin = await service.atomic.findOneAndUpdate(
    {
      email: data.email,
    },
    {
      $set: {
        stripeId: data.id,
      },
    },
  );

  companyService.atomic.updateOne(
    {
      ownerId: admin?.value?._id,
    },
    {
      $set: {
        stripeId: data.id,
      },
    },
  );
};

const updateLastRequest = (_id: string) => service.atomic.updateOne(
  { _id },
  {
    $set: {
      lastRequestOn: new Date(),
      updatedOn: new Date(),
    },
  },
);

const updateLastLogin = (_id: string, timestamp: number) => service.atomic.updateOne(
  { _id },
  {
    $set: {
      lastRequestOn: new Date(),
      lastLoginOn: new Date(timestamp),
      updatedOn: new Date(),
    },
  },
);

// TODO: pick public
const privateFields = [
  'passwordHash',
  'signupToken',
  'resetPasswordToken',
  'issuer',
];

const getPublic = (admin: Admin | null) => _.omit(admin, privateFields);

export default Object.assign(service, {
  attachStripeCustomerId,
  updateLastRequest,
  updateLastLogin,
  getPublic,
});
