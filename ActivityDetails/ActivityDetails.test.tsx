import * as React from 'react';

import { identity } from 'fp-ts/lib/function';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import {
  ActivityStateType,
  ActivityType,
  AssetType,
  DirectionType,
  IAdditionalActivityData,
  IAppointment,
  IDetailObjectActivity,
  IPayoutTask,
  PayoutStatus,
  PayoutType,
} from '../../data/api/activities';
import getComponentWithHocks from '../../utils/tests/getComponentWithHocks';

import { ActivityDetails } from '.';

jest.mock('../../utils/formatMoney', () => ({
  formatMoney() {
    return '2 150 000 ₽';
  },
}));

const DATE_MOCK = new Date('2018-01-01T00:00:00.000Z');

const payoutTaskSecurity: IPayoutTask = {
  payoutType: PayoutType.ExternalPayout,
  orderDate: DATE_MOCK,
  payoutStatus: PayoutStatus.Completed,
  agreementNumber: '21992038',
  payoutReason: 'Нужны деньги на новый бизнес',
  payoutReasonDetail: 'Правда нужны',
  assetType: AssetType.Security,
  securityAmount: 300,
  securityName: 'Название ценной бумаги 1, Название ценной бумаги 2, Название ценной бумаги 3',
  payoutSum: 100,
};

const payoutTaskMoney: IPayoutTask = {
  payoutType: PayoutType.ExternalPayout,
  orderDate: DATE_MOCK,
  payoutStatus: PayoutStatus.Completed,
  agreementNumber: '21992038',
  payoutReason: 'Нужны деньги на новый бизнес',
  payoutReasonDetail: 'Правда нужны',
  assetType: AssetType.Security,
  securityAmount: 300,
  securityName: 'Название ценной бумаги 1, Название ценной бумаги 2, Название ценной бумаги 3',
  payoutSum: 100,
};

const appointment: IAppointment = {
  address: 'Улица Пушкина, дом 1',
  isClientHasCome: true,
  contactResult: 'Связался с клиентом',
};

const payoutTaskVariants: Array<Partial<IPayoutTask>> = [
  { payoutReason: undefined },
  { payoutReason: undefined, payoutReasonDetail: undefined },
  { payoutType: undefined, orderDate: undefined },
  { payoutType: undefined, payoutStatus: undefined },
];

const ADDITIONAL_DATA_MOCKS: IAdditionalActivityData[] = [
  {
    phoneCall: {
      direction: DirectionType.Incoming,
      phoneNumber: '9194557007',
    },
  },
  { appointment },
  { appointment: { ...appointment, isClientHasCome: false } },
  { serviceMessage: {} },
  { payoutTask: payoutTaskSecurity },
  { payoutTask: payoutTaskMoney },
  {
    email: {
      messageText: '<p>Hello!</p>',
    },
  },
  {
    sms: {
      messageText: 'SMS full text',
    },
  },
  {
    webportalNews: {
      messageText: '<p>Web news!</p>',
    },
  },
];

const ACTIVITY_MOCK: IDetailObjectActivity = {
  // tslint:disable-next-line:max-line-length
  subject: 'Клиент подал поручение на вывод активов. Свяжитесь с клиентом, выясните причину и укажите ее при обработке текущей задачи.',
  ownerFullName: 'Егоров Василий Васильевич',
  createdByFullName: 'Егоров Василий Васильевич',
  createDate: DATE_MOCK,
  plannedStartDate: DATE_MOCK,
  actualEndDate: DATE_MOCK,
  state: ActivityStateType.Completed,
  clientFullName: 'Василий',
};

const getOutput = (mock: IDetailObjectActivity) => {
  return renderer.create(
    getComponentWithHocks(
      <ActivityDetails
        activity={mock}
        classes={{}}
        theme={null}
      />,
    ),
    { createNodeMock: identity }, // YB: See https://github.com/facebook/react/issues/7740#issuecomment-247335106
  ).toJSON();
};

describe('ActivityDetails', () => {
  it.concurrent('Should render according completed activities to the snapshot', async () => {
    ADDITIONAL_DATA_MOCKS.forEach((ad) => {
      const type = Object.keys(ad)[0] as ActivityType;
      const mock = {
        ...ACTIVITY_MOCK,
        activityType: type,
        additionalData: ad,
      };

      const output: ReactTestRendererJSON = getOutput(mock);
      expect(output).toMatchSnapshot();
    });
  });

  it.concurrent('Should render according opened activities to the snapshot', async () => {
    ADDITIONAL_DATA_MOCKS.forEach((ad) => {
      const type = Object.keys(ad)[0] as ActivityType;

      const mock = {
        ...ACTIVITY_MOCK,
        additionalData: ad,
        activityType: type,
        state: ActivityStateType.Open,
      };

      const output: ReactTestRendererJSON = getOutput(mock);
      expect(output).toMatchSnapshot();
    });
  });

  it.concurrent('Should render different payoutTask variants', async () => {
    payoutTaskVariants.forEach((variant) => {
      const mock = {
        ...ACTIVITY_MOCK,
        additionalData: {
          payoutTask: {
            ...payoutTaskSecurity,
            ...variant,
          },
        },
        activityType: ActivityType.PayoutTask,
        state: ActivityStateType.Completed,
        description: 'Описание',
      };

      const output: ReactTestRendererJSON = getOutput(mock);
      expect(output).toMatchSnapshot();
    });
  });
});
