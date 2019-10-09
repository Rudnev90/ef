
import * as React from 'react';

import { ApiResource, resource } from '@bcs/sdk/lib/sdk-core/monads/api-resource';
import { failure, initial, pending, RemoteData, success } from '@devexperts/remote-data-ts';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import { ActivityStateType, ActivityType, AppointmentType, DirectionType } from '../../data/api/activities';
import { HttpError } from '../../utils/errors';

import { BCSActivityCard, BCSActivityCardProps, IBCSActivityCardModel } from '.';

const DATE_MOCK = new Date('2018-01-01T00:00:00.000Z');

const modelRemoteList: Array<RemoteData<HttpError, ApiResource<IBCSActivityCardModel>>> = [
  undefined,
  initial,
  pending,
  failure(new HttpError('Error', 400)),
  success(resource({
    plannedStartDate: DATE_MOCK,
    actualEndDate: DATE_MOCK,
    activityType: ActivityType.Email,
    activityId: 'activityId',
    state: ActivityStateType.Open,
  })),
];

const modelsData = [
  {
    phoneCall: {
      direction: DirectionType.Incoming,
    },
  },
  {
    phoneCall: {
      direction: DirectionType.Outgoing,
    },
  },
  {
    appointment: {},
  },
  {
    appointment: {
      appointmentType: AppointmentType.ExternalAppointment,
    },
  },
  {
    appointment: {
      appointmentType: AppointmentType.InternalAppointment,
    },
  },
  {
    serviceMessage: {
      isInformedCallcenter: true,
      isInformedMSOSKO: true,
    },
  },
];

const chipsData = [
  {
    activityType: ActivityType.PhoneCall,
    state: ActivityStateType.Open,
  },
  {
    activityType: ActivityType.PhoneCall,
    state: ActivityStateType.Completed,
  },
  {
    activityType: ActivityType.ServiceMessage,
    additionalData: {
      [ActivityType.ServiceMessage]: {},
    },
  },
  {
    activityType: ActivityType.ServiceMessage,
    additionalData: {
      [ActivityType.ServiceMessage]: {
        isInformedCallcenter: true,
      },
    },
  },
  {
    activityType: ActivityType.WebportalNews,
    state: ActivityStateType.Completed,
  },
  {
    activityType: ActivityType.WebportalNews,
    state: ActivityStateType.Completed,
    status: 'Some status',
  },
  {
    activityType: ActivityType.WebportalNews,
    state: ActivityStateType.Open,
    status: 'Some status',
    additionalData: {
      [ActivityType.WebportalNews]: {
        activityTag: 'Alert',
      },
    },
  },
];

describe('BCSActivityCard', () => {
  it.concurrent('should render according to the snapshot', async () => {
    modelRemoteList.forEach((model) => {
      const output = renderer.create(
        <BCSActivityCard
          model={model}
          classes={{}}
          theme={null}
        />,
      ).toJSON();
      expect(output).toMatchSnapshot();
    });
  });

  it.concurrent('should render according to the snapshot different activity type', async () => {
    modelsData.forEach((model) => {
      const type = Object.keys(model)[0] as ActivityType;
      const output = renderer.create(
        <BCSActivityCard
          model={success(resource({
            activityId: 'activityId',
            activityType: type,
            additionalData: model,
          }))}
          classes={{}}
          theme={null}
        />,
      ).toJSON();
      expect(output).toMatchSnapshot();
    });
  });

  it.concurrent('should render according to the snapshot different chips', async () => {
    chipsData.forEach((chip) => {
      const output = renderer.create(
        <BCSActivityCard
          model={success(resource({
            activityId: 'activityId',
            activityType: chip.activityType,
            state: chip.state,
            status: chip.status,
            additionalData: chip.additionalData || {},
          }))}
          classes={{}}
          theme={null}
        />,
      ).toJSON();
      expect(output).toMatchSnapshot();
    });
  });

  it.concurrent('should handle click on wrapper', async () => {
    const classes = { root: 'someclass' };
    const onClickSpy = jest.fn();
    const wrapper = shallow(
      <BCSActivityCard
        model={success(resource({
          activityId: 'activityId',
        }))}
        classes={classes}
        theme={null}
        onClick={onClickSpy}
      />,
    );
    wrapper.find(`.${classes.root}`).simulate('click');
    expect(onClickSpy).toHaveBeenCalled();
  });

  it.concurrent('should shouldComponentUpdate have been called', async () => {
    const props: BCSActivityCardProps = {
      model: initial,
      classes: {},
      theme: null,
      onClick: jest.fn(),
    };
    const shouldComponentUpdateSpy = jest.spyOn(BCSActivityCard.prototype, 'shouldComponentUpdate');
    const wrapper = shallow(
      <BCSActivityCard
        {...props}
      />,
    );
    wrapper.setProps(props as Required<BCSActivityCardProps>);
    expect(shouldComponentUpdateSpy).toHaveBeenCalled();
  });
});
