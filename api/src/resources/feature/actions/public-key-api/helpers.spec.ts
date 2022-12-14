import _ from 'lodash';
import { generateId } from '@paralect/node-mongo';

import * as helpers from './helpers';
import type { UserData } from './types';
import type { FlatFeature } from '../../feature.types';
import { TargetingRuleOperator } from '../../feature.types';
import { Env } from 'resources/application';

const USER_TEST_EMAIL = 'test@email.com';

const featureDisabledForEveryone: FlatFeature =  {
  _id: '1',
  name: 'test1',
  description: 'test',
  applicationId: '1',
  createdOn: new Date('2022-09-13T09:58:19.863Z'),
  updatedOn: new Date('2022-09-14T10:39:01.469Z'),
  enabled: false,
  enabledForEveryone: false,
  usersPercentage: 0,
  usersViewedCount: 0,
  tests: [],
  visibilityChangedOn: new Date('2022-09-14T10:39:01.455Z'),
  env: Env.DEVELOPMENT,
  remoteConfig: '{ "featureDisabledForEveryoneConfig": 1 } ',
};
const featureEnabledForEveryone: FlatFeature =  {
  _id: '2',
  name: 'test2',
  description: 'test',
  applicationId: '1',
  createdOn: new Date('2022-08-31T13:37:50.890Z'),
  updatedOn: new Date('2022-09-14T10:41:19.706Z'),
  enabled: true,
  enabledForEveryone: true,
  usersPercentage: 0,
  tests: [],
  usersViewedCount: 1,
  visibilityChangedOn: new Date('2022-09-14T10:41:02.746Z'),
  env: Env.DEVELOPMENT,
  remoteConfig: '{ "featureEnabledForEveryone": 2 } ',
};
const featureEnabledForEmail: FlatFeature = {
  _id: '3',
  name: 'test3',
  description: 'test',
  applicationId: '1',
  createdOn: new Date('2022-08-31T13:37:50.890Z'),
  updatedOn: new Date('2022-09-14T10:41:19.706Z'),
  enabled: true,
  enabledForEveryone: false,
  usersPercentage: 0,
  tests: [],
  usersViewedCount: 1,
  visibilityChangedOn: new Date('2022-09-14T10:41:02.746Z'),
  env: Env.DEVELOPMENT,
  remoteConfig: '{ "featureEnabledForEmail": 3 } ',
};
const featureEnabledForPercentOfUsers: FlatFeature = {
  _id: '4',
  name: 'test4',
  description: 'test',
  applicationId: '1',
  createdOn: new Date('2022-08-31T13:37:50.890Z'),
  updatedOn: new Date('2022-09-14T10:41:19.706Z'),
  enabled: true,
  enabledForEveryone: false,
  usersPercentage: 20,
  tests: [],
  usersViewedCount: 10,
  targetingRules: [
    { 
      attribute: 'test1',
      operator: TargetingRuleOperator.EQUALS,
      value: 'test', 
    },
    { 
      attribute: 'test2',
      operator: TargetingRuleOperator.INCLUDES,
      value: ['1', '2'], 
    },
  ],
  visibilityChangedOn: new Date('2022-09-14T10:41:02.746Z'),
  env: Env.DEVELOPMENT,
  remoteConfig: '{ "featureEnabledForPercentOfUsers": 4 }',
};

const makeUserByEmail = (email?: string) => {
  if (!email) return null;

  return {
    _id: 'test',
    email,
  } as UserData;
};

const makeUser = () => {
  return {
    _id: 'test',
    externalId: '1',
  } as UserData;
};

describe('calculateFlagsForUser', () => {
  describe('for empty features array', () => {
    const values: Array<{ features: FlatFeature[], email?: string }> = [
      { features: [] },
      { features: [], email: USER_TEST_EMAIL },
    ];

    test.each(values)('should return empty object', async ({ features, email }) => {
      await expect(helpers.calculateFlagsForUser(features, makeUserByEmail(email))).resolves.toEqual({});
    });
  });

  describe('when user is not passed', () => {
    test('should return true only for features enabled for everyone', async () => {
      const initialFeatures : FlatFeature[] = [
        featureDisabledForEveryone,
        featureEnabledForEveryone,
        featureEnabledForPercentOfUsers,
      ];
      const expectedResult = {
        [featureDisabledForEveryone.name]: false,
        [featureEnabledForEveryone.name]: true,
        [featureEnabledForPercentOfUsers.name]: false,
      };
      await expect(helpers.calculateFlagsForUser(initialFeatures, null)).resolves.toEqual(expectedResult);
    });
  });

  describe('for features enabled for everyone', () => {
    const initialFeatures : FlatFeature[] = [
      featureEnabledForEveryone,
    ];

    const expectedResult = {
      [featureEnabledForEveryone.name]: true,
    };

    test('should return true for features enabled for everyone', async () => {
      await expect(helpers.calculateFlagsForUser(initialFeatures, makeUserByEmail(USER_TEST_EMAIL)))
        .resolves.toEqual(expectedResult);
    });
  });

  describe('for features disabled for everyone', () => {
    const initialFeatures : FlatFeature[] = [
      featureDisabledForEveryone,
    ];

    const expectedResult = {
      [featureDisabledForEveryone.name]: false,
    };

    test('should return false for features disabled for everyone', async () => {
      await expect(helpers.calculateFlagsForUser(initialFeatures, makeUserByEmail(USER_TEST_EMAIL)))
        .resolves.toEqual(expectedResult);
    });
  });

  describe('for features enabled for the users by targeting rules', () => {
    const initialFeatures : FlatFeature[] = [
      featureEnabledForPercentOfUsers,
    ];

    test('should return true for features enabled by targeting rules', async () => {
      const expectedResult = {
        [featureEnabledForPercentOfUsers.name]: true,
      };
      const user1 = {
        ...makeUserByEmail(USER_TEST_EMAIL),
        data: {
          test1: 'test',
        }, 
      } as UserData;
      await expect(helpers.calculateFlagsForUser(initialFeatures, user1))
        .resolves.toEqual(expectedResult);

      const user2 = {
        ...makeUserByEmail(USER_TEST_EMAIL),
        data: {
          test2: '1',
        }, 
      } as UserData;  
      await expect(helpers.calculateFlagsForUser(initialFeatures, user2))
        .resolves.toEqual(expectedResult);
    });

    test('should return false for features enabled by targeting rules', async () => {
      const expectedResult = {
        [featureEnabledForPercentOfUsers.name]: false,
      };
      const user1 = {
        ...makeUserByEmail(USER_TEST_EMAIL),
        data: {
          test1: 'testtest',
        }, 
      } as UserData;
      await expect(helpers.calculateFlagsForUser(initialFeatures, user1))
        .resolves.toEqual(expectedResult);
    });
  });


  describe('for features enabled for selected percent of users', () => {
    beforeAll(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      helpers.calculateRemainderByUserData = jest.fn();
    });
    const PERCENT = 20;
    const initialFeatures: Array<FlatFeature> = [
      { 
        ...featureEnabledForPercentOfUsers,
        usersPercentage: PERCENT,
      },
    ];

    test.each([0, PERCENT - 1])(`should return true if remainder (%i) < selected percent ${PERCENT}`, async (value) => {
      const expectedResult = {
        [featureEnabledForPercentOfUsers.name]: true,
      };
  
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      helpers.calculateRemainderByUserData.mockReturnValue(value);

      await expect(helpers.calculateFlagsForUser(initialFeatures, makeUserByEmail(USER_TEST_EMAIL)))
        .resolves.toEqual(expectedResult);
      
      await expect(helpers.calculateFlagsForUser(initialFeatures, makeUser()))
        .resolves.toEqual(expectedResult);
    });

    test.each([PERCENT, PERCENT + 1])(
      `should return false if remainder (%i) >= selected percent ${PERCENT}`, 
      async (value) => {
        const expectedResult = {
          [featureEnabledForPercentOfUsers.name]: false,
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        helpers.calculateRemainderByUserData.mockReturnValue(value);

        await expect(helpers.calculateFlagsForUser(initialFeatures, makeUserByEmail(USER_TEST_EMAIL)))
          .resolves.toEqual(expectedResult);

        await expect(helpers.calculateFlagsForUser(initialFeatures, makeUser()))
          .resolves.toEqual(expectedResult);
      },
    );
  });

  describe('Utilities to calculate a/b bucket from number', () => {
    test('id as integers from 1 to 100 with 2 buckets and for numbers from 1 to 100 should be 50/50', () => {
      const users = new Array(100).fill(null).map((u, i) => i + 1);
      const buckets = users.map(u => helpers.numberToBucketIndex(2, u));

      const variantACount = _.filter(buckets, n => n == 0).length;
      const variantBCount = _.filter(buckets, n => n == 1).length;

      expect(variantACount).toEqual(variantBCount);
    });

    test('id as integers from 1 to 100 with 3 buckets and for numbers from 1 to 100 should be 33/33/33', () => {
      const users = new Array(100).fill(null).map((u, i) => i + 1);
      const buckets = users.map(u => helpers.numberToBucketIndex(3, u));

      const variantACount = _.filter(buckets, n => n == 0).length;
      const variantBCount = _.filter(buckets, n => n == 1).length;
      const variantCCount = _.filter(buckets, n => n == 2).length;

      expect(variantACount).toEqual(variantBCount);
      expect(variantACount).toEqual(variantCCount);
    });

    test('id as integers from 1 to 100 with 4 buckets and for numbers from 1 to 100 should be 25/25/25/25', () => {
      const users = new Array(100).fill(null).map((u, i) => i + 1);
      const buckets = users.map(u => helpers.numberToBucketIndex(3, u));

      const variantACount = _.filter(buckets, n => n == 0).length;
      const variantBCount = _.filter(buckets, n => n == 1).length;
      const variantCCount = _.filter(buckets, n => n == 2).length;

      expect(variantACount).toEqual(variantBCount);
      expect(variantACount).toEqual(variantCCount);
    });

    test('100000 user ids should split almost evenly 50/50', () => {
      const totalIDs = 100000;
      const userIds = new Array(totalIDs).fill(null).map(() => generateId());
      const tests = [{ name: 'Basic', remoteConfig: '' }, { name: 'Variant B', remoteConfig: '' }];

      const buckets = userIds.map(u => helpers.calculateABTestForUser(tests, u));

      const variantACount = _.filter(buckets, v => v.name === 'Basic').length;
      const variantBCount = buckets.length - variantACount;

      const variantAPercentage = 100 / (totalIDs / variantBCount);
      const variantBPercentage = 100 / (totalIDs / variantACount);

      expect(variantAPercentage).toBeCloseTo(variantBPercentage, 0);
    });

    test('100000 user ids should split almost evenly 25/25/25/25', () => {
      const totalIDs = 100000;
      const userIds = new Array(totalIDs).fill(null).map(() => generateId());
      const tests = [
        { name: 'varA', remoteConfig: '' },
        { name: 'varB', remoteConfig: '' },
        { name: 'varC', remoteConfig: '' },
        { name: 'varD', remoteConfig: '' },
      ];

      const buckets = userIds.map(u => helpers.calculateABTestForUser(tests, u));

      const counts = _.countBy(buckets, variant => variant.name);
      const percentageCounts = _.mapValues(counts, (count) => 100 / (totalIDs / count));


      expect(percentageCounts.varA).toBeCloseTo(percentageCounts.varB, 0);
      expect(percentageCounts.varA).toBeCloseTo(percentageCounts.varC, 0);
      expect(percentageCounts.varA).toBeCloseTo(percentageCounts.varD, 0);
    });
  });
});
