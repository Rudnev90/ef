import * as React from 'react';

import { ApiResource } from '@bcs/sdk/lib/sdk-core/monads/api-resource';
import { initial, RemoteData } from '@devexperts/remote-data-ts';
import { Icon, StyleRulesCallback, Tooltip, Typography, withStyles, WithStyles } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';
import { differenceInCalendarDays, format } from 'date-fns';
import locale from 'date-fns/locale/ru';
import { constant } from 'fp-ts/lib/function';
import { equals, path } from 'ramda';
import { Translate } from 'react-localize-redux';
import { Redirect } from 'react-router';
import { compose } from 'recompose';

import {
  ActivityStateType,
  ActivityTag,
  ActivityType,
  AppointmentType,
  DirectionType,
  IDetailObjectActivity,
  IShortViewActivity,
} from '../../data/api/activities';
import { HttpError } from '../../utils/errors';
import BCSChip from '../BCSChip';
import BCSIcon from '../BCSIcon';

import ActivityTabSkeleton from './ActivityTabSkeleton';

const styles: StyleRulesCallback = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing.unit * 4,
    backgroundColor: theme.palette.secondary.contrastText,
  },
  left: {},
  icon: {
    color: blueGrey['400'],
    borderRadius: '50%',
  },
  center: {
    flexGrow: 1,
    paddingRight: theme.spacing.unit * 4,
    paddingLeft: theme.spacing.unit * 4,
  },
  centerTop: {
    paddingBottom: theme.spacing.unit,
  },
  centerBottom: {
    display: 'flex',
    alignItems: 'center',
  },
  right: {},
  title: theme.typography.h3,
  timeIcon: {
    marginRight: theme.spacing.unit,
    fontSize: 16,
    color: blueGrey['400'],
  },
  notificationMessage: {
    marginRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit / 2,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit / 2,
    paddingLeft: theme.spacing.unit,
    color: theme.palette.secondary.contrastText,
    backgroundColor: red['500'],
    borderRadius: 2,
  },
  notificationMessageText: {
    color: theme.palette.secondary.contrastText,
  },
});

const FORMAT_DATE = (): string => 'MM/DD/YYYY';
const APPOINTMENT_INNER = 'appointment_inner';
const APPOINTMENT_OUTER = 'appointment_outer';

type PossibleDeclanationKeys = -1 | 0 | 1 | 2 | 3;
const declanationMap: Record<PossibleDeclanationKeys, string> = Object.freeze({
  '-1': 'Просрочено',
  '0': 'Осталось 0 дней',
  '1': 'Остался 1 день',
  '2': 'Осталось 2 дня',
  '3': 'Осталось 3 дня',
});

type PossibleExecptionKeys = ActivityStateType.Canceled | ActivityStateType.Completed;
export const exceptionMap: Record<PossibleExecptionKeys, string> = Object.freeze({
  [ActivityStateType.Canceled]: 'Canceled',
  [ActivityStateType.Completed]: 'Completed',
});

type PossibleExecptionTagKeys = ActivityTag.KVP | ActivityTag.Alert;
const execptionTagMap: Record<PossibleExecptionTagKeys, string> = Object.freeze({
  [ActivityTag.KVP]: 'KVP',
  [ActivityTag.Alert]: 'Alert',
});

type TooltipKeys =
  ActivityType.Email |
  ActivityType.PayoutTask |
  ActivityType.Sms |
  ActivityType.ServiceMessage |
  ActivityType.WebportalNews |
  'appointment_inner' |
  'appointment_outer' |
  'phoneCall_incoming' |
  'phoneCall_outgoing';

export const TooltipMap: Record<TooltipKeys, string> = {
  [ActivityType.Email]: 'email',
  [ActivityType.PayoutTask]: 'payoutTask',
  [ActivityType.Sms]: 'sms',
  [ActivityType.ServiceMessage]: 'serviceMessage',
  [ActivityType.WebportalNews]: 'webportalNews',
  appointment_inner: 'appointment_inner',
  appointment_outer: 'appointment_outer',
  phoneCall_incoming: 'phoneCall_incoming',
  phoneCall_outgoing: 'phoneCall_outgoing',
};

const getDifferenceInCalendarDays = (date: Date) =>
  differenceInCalendarDays(
    format(new Date(date), `${FORMAT_DATE()}`),
    format(new Date(Date.now()), `${FORMAT_DATE()}`));

const getSignByCalendarDays = (date: Date) =>
  Math.sign(getDifferenceInCalendarDays(date)) === -1 ?
    -1 : getDifferenceInCalendarDays(date);

const getDeclination = (
  map: Record<PossibleDeclanationKeys, string>,
  plannedStartDate: Date,
  activityTag: ActivityTag,
): string | undefined =>
  execptionTagMap[activityTag] &&
  map[
  getSignByCalendarDays(plannedStartDate)
  ];

const tooltipId = 'App.BCSActivityCard.tooltip.';

export type IBCSActivityCardModel = IShortViewActivity & IDetailObjectActivity;

export const ActivityTypeMap = {
  [ActivityType.PhoneCall]: 'phone',
  [ActivityType.Appointment]: 'people',
  [ActivityType.Email]: 'mail_outline',
  [ActivityType.Sms]: 'sms_outlined',
  [ActivityType.ServiceMessage]: 'info_outlined',
  [ActivityType.PayoutTask]: 'payment',
  [ActivityType.WebportalNews]: 'receipt',
};

export type PhoneOrAppointment = ActivityType.PhoneCall | ActivityType.Appointment;
export const PhoneOrAppointmentMap: Record<PhoneOrAppointment, string> = {
  [ActivityType.PhoneCall]: 'phoneCall',
  [ActivityType.Appointment]: 'appointment',
};

export enum NotifiedMap {
  Notified = 'notified',
  NotNotified = 'notNotified',
}

export const ActivityPhoneCallSubType: Record<DirectionType, string> = {
  incoming: 'call_received',
  outgoing: 'call_made',
};

export const ActivityAppointmentSubType = {
  [AppointmentType.InternalAppointment]: 'call_received',
  [AppointmentType.ExternalAppointment]: 'call_made',
};

export interface IBCSActivityCardProps {
  model: RemoteData<HttpError, ApiResource<IBCSActivityCardModel>>;
  onClick?: (id: string) => void;
}

export type BCSActivityCardProps = IBCSActivityCardProps & WithStyles<typeof styles, true>;
export type BCSActivityCardOuterProps = IBCSActivityCardProps & Partial<WithStyles<typeof styles, true>>;

export class BCSActivityCard extends React.Component<BCSActivityCardProps> {

  private initialRender = constant(<ActivityTabSkeleton />);

  private errorRender = constant(<div>Error</div>);

  shouldComponentUpdate(prevProps: IBCSActivityCardProps) {
    return !equals(prevProps, this.props);
  }

  private handleClick = (id: string) => () => {
    const { onClick } = this.props;
    return onClick && onClick(id);
  }

  private getPhoneDirection = (model: IBCSActivityCardModel): string | null =>
    model.phoneCallDirection || path(['additionalData', 'phoneCall', 'direction'], model)

  private getAppointmentType = (model: IBCSActivityCardModel): string | null =>
    model.appointmentType || path(['additionalData', 'appointment', 'appointmentType'], model)

  private getDirectionFieldByPhoneCall = (model: IBCSActivityCardModel): string | null =>
    ActivityPhoneCallSubType[this.getPhoneDirection(model)] || null

  private getDirectionFieldByAppointment = (model: IBCSActivityCardModel): string | null =>
    ActivityAppointmentSubType[this.getAppointmentType(model)] || null

  private getServiceMessageIsNotified = (model: IBCSActivityCardModel): boolean =>
    !!(
      path(['additionalData', 'serviceMessage', 'isInformedCallcenter'], model) ||
      path(['additionalData', 'serviceMessage', 'isInformedMSOSKO'], model)
    )

  private getIconSubType = (model: IBCSActivityCardModel): string | null => {
    const { activityType } = model;

    switch (true) {
      case activityType === ActivityType.PhoneCall:
        return this.getDirectionFieldByPhoneCall(model);
      case activityType === ActivityType.Appointment:
        return this.getDirectionFieldByAppointment(model);
      default:
        return null;
    }
  }

  private getDeclinationIcon = (model: IBCSActivityCardModel) => {
    const { plannedStartDate, createDate, activityTag, activityType } = model;

    return getDeclination(
      declanationMap,
      (plannedStartDate || createDate),
      activityTag || path(['additionalData', activityType, 'activityTag'], model),
    );
  }

  private getTooltip = (model: IBCSActivityCardModel) => {
    const { activityType } = model;
    switch (activityType) {
      case ActivityType.PhoneCall: {
        const tooltipType = `${activityType}_${this.getPhoneDirection(model)}`;
        return <Translate id={tooltipId + TooltipMap[tooltipType]} />;
      }
      case ActivityType.Appointment: {
        const tooltipType =
          this.getAppointmentType(model) === AppointmentType.ExternalAppointment ?
            APPOINTMENT_OUTER :
            APPOINTMENT_INNER;
        return <Translate id={tooltipId + TooltipMap[tooltipType]} />;
      }
      default:
        return <Translate id={tooltipId + TooltipMap[activityType]} />;
    }
  }

  getChipLabel = (model: IBCSActivityCardModel) => {
    const { activityType, additionalData } = model;
    const activityTag = model.activityTag || path(['additionalData', activityType, 'activityTag'], model);

    switch (true) {
      case !!(PhoneOrAppointmentMap[model.activityType] && exceptionMap[model.state]):
        return <Translate id={'enum.ActivityStateType.' + model.state} />;
      case !!(!exceptionMap[model.state] && execptionTagMap[activityTag]):
        return <Translate id={'enum.ActivityTag.' + activityTag} />;
      case !!(exceptionMap[model.state] && model.status):
        return model.status;
      case ActivityType.ServiceMessage === activityType && !!additionalData:
        return this.getServiceMessageIsNotified(model) ?
          <Translate id={'App.BCSActivityCard.' + NotifiedMap.Notified} /> :
          <Translate id={'App.BCSActivityCard.' + NotifiedMap.NotNotified} />;
      default:
        return null;
    }
  }

  getChipType = (model: IBCSActivityCardModel) => {
    const { activityType, additionalData } = model;
    const activityTag = model.activityTag || path(['additionalData', activityType, 'activityTag'], model);
    switch (true) {
      case !!(!exceptionMap[model.state] && execptionTagMap[activityTag]):
        return activityTag;
      case !!exceptionMap[model.state]:
        return model.state;
      case ActivityType.ServiceMessage === activityType && !!additionalData:
        return this.getServiceMessageIsNotified(model) ? NotifiedMap.Notified : NotifiedMap.NotNotified;
      default:
        return null;
    }
  }

  private renderDate = (date: Date) => format(date, 'DD MMMM YYYY в HH:mm', { locale });

  private successRender = (classes: Record<string, string>) => (resource: ApiResource<IBCSActivityCardModel>) => {
    const wrapperClasses = {
      main: classes.root,
      left: classes.left,
      center: classes.center,
      centerTop: classes.centerTop,
      centerBottom: classes.centerBottom,
      right: classes.right,
    };
    const titleClasses = {
      root: classes.title,
    };
    const timeIconClasses = {
      root: classes.timeIcon,
    };
    const notificationMessageClasses = {
      root: classes.notificationMessage,
    };
    const notificationMessageTextClasses = {
      root: classes.notificationMessageText,
    };

    return resource.foldL(
      (url) => <Redirect to={url} />,
      (model: IBCSActivityCardModel) => {
        const { plannedStartDate, actualEndDate } = model;
        return (
          <section
            className={wrapperClasses.main}
            onClick={this.handleClick(model.activityId)}
            title='Нажмите, чтобы посмотреть детальную информацию'
          >
            <div className={wrapperClasses.left}>
              <Tooltip title={this.getTooltip(model)}>
                <div>
                  <BCSIcon
                    type={ActivityTypeMap[model.activityType]}
                    subType={this.getIconSubType(model)}
                    size='medium'
                  />
                </div>
              </Tooltip>
            </div>
            <div className={wrapperClasses.center}>
              <div className={wrapperClasses.centerTop}>
                <Typography classes={titleClasses} variant='h3'>
                  {model.subject || <Translate id={'enum.ActivityType.' + model.activityType} />}
                </Typography>
              </div>
              <div className={wrapperClasses.centerBottom}>
                {!!(this.getDeclinationIcon(model) && !exceptionMap[model.state]) && (
                  <div className={notificationMessageClasses.root}>
                    <Typography
                      variant='caption'
                      className={notificationMessageTextClasses.root}
                    >
                      {this.getDeclinationIcon(model)}
                    </Typography>
                  </div>
                )}
                <Icon classes={timeIconClasses} >access_time</ Icon>
                <Typography variant='subtitle1' >
                  {this.renderDate(
                    exceptionMap[model.state] ?
                      actualEndDate :
                      plannedStartDate,
                  )}
                </Typography>
              </div>
            </div>
            <div className={wrapperClasses.right}>
              <BCSChip
                type={this.getChipType(model)}
                label={this.getChipLabel(model)}
              />
            </div>
          </section>
        );
      },
    );
  }

  render() {
    const { classes, model = initial } = this.props;

    return (
      model.foldL(
        this.initialRender,
        this.initialRender,
        this.errorRender,
        this.successRender(classes),
      )
    );
  }
}

export default compose<BCSActivityCardProps, BCSActivityCardOuterProps>(
  withStyles(styles),
)(BCSActivityCard);
