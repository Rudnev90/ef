import * as React from 'react';

import { resource } from '@bcs/sdk/lib/sdk-core/monads/api-resource';
import { success } from '@devexperts/remote-data-ts';
import {
  Divider,
  Grid,
  StyleRulesCallback,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import classNames from 'classnames';
import { format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import { Reader } from 'fp-ts/lib/Reader';
import { path } from 'ramda';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import {
  ActivityType,
  AssetType,
  IAdditionalActivityData,
  IAppointment,
  IDetailObjectActivity,
  IEmail,
  IPayoutTask,
  IPhoneCall,
  IServiceMessage,
  IShortViewActivity,
  ISms,
  IWebportalNews,
  PayoutType,
} from '../../data/api/activities';
import { ClientRouteMap } from '../../routes';
import { formatMoney } from '../../utils/formatMoney';
import { formatPhoneNumber } from '../../utils/formatPhone';
import BCSActivityCard, { exceptionMap } from '../BCSActivityCard';
import BCSChip from '../BCSChip';

import CustomMarkupView from './dependency/CustomMarkupView';
import Section from './Section';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    width: '64vw',
  },
  divider: {
    marginTop: 2 * theme.spacing.unit,
    marginBottom: 2 * theme.spacing.unit,
  },
  text: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  contactResultTitle: {
    marginBottom: theme.spacing.unit * 3,
  },
  payoutTaskStatus: {
    marginLeft: theme.spacing.unit * 2,
  },
  payoutType: {
    marginBottom: theme.spacing.unit * 2,
  },
  cleintInfoWrapper: {
    width: '60%',
  },
  clientTitle: {
    fontSize: 12,
    marginBottom: theme.spacing.unit,
  },
});

export type PayoutTypeMapType = PayoutType.ExternalPayout | PayoutType.InternalPayout;
export const PayoutTypeMap: Record<PayoutTypeMapType, string> = {
  [PayoutType.ExternalPayout]: 'externalPayout',
  [PayoutType.InternalPayout]: 'internalPayout',
};

interface IReaderEnvironment {
  [k: string]: unknown;
}

type ComponentMap<E extends IReaderEnvironment, T> = {
  [K in keyof T]-?: Reader<E, (data: T[K]) => JSX.Element>;
};

export interface IActivityDetailsProps {
  activity: IDetailObjectActivity & IShortViewActivity;
}

type ActivityDetailsProps =
  IActivityDetailsProps &
  WithStyles<typeof styles, true>;

type ActivityDetailsOutProps =
  IActivityDetailsProps &
  Partial<
    WithStyles<typeof styles>
  >;

const formatDateTime = (date: Date) => format(date, 'D MMMM YYYY в HH:mm', { locale: ruLocale });

interface IEnv extends IReaderEnvironment {
  key: number;
  classes: Record<string, string>;
}

const ComponentMap: ComponentMap<IEnv, IAdditionalActivityData> = {
  phoneCall: new Reader(({ key }: IEnv) => (_phoneCall: IPhoneCall) => (
    <React.Fragment key={key}>
      {null}
    </React.Fragment>
  )),
  appointment: new Reader(({ key }: IEnv) => (appointment: IAppointment) =>
    appointment.address && (
      <React.Fragment key={key}>
        <Section icon='place'>
          <Typography>{appointment.address}</Typography>
        </Section>
        <Divider />
      </React.Fragment>
    ),
  ),
  serviceMessage: new Reader(({ key }: IEnv) => (serviceMessage: IServiceMessage) => (
    <React.Fragment key={key}>
      <Section icon='notes'>
        <Typography>{serviceMessage.text}</Typography>
      </Section>
      <Divider />
    </React.Fragment>
  )),
  payoutTask: new Reader(({ key, classes }: IEnv) => (payoutTask: IPayoutTask) => {
    const { assetType, orderDate, payoutStatus, payoutSum } = payoutTask;
    const SmallDivider = () => <Divider light={true} classes={{ root: classes.divider }} />;
    const payoutTaskStatusClasses = { root: classes.payoutTaskStatus };
    const payoutTextClasses = { root: classes.text };
    const payoutSecurityClasses = { container: classes.text };
    return (
      <React.Fragment key={key}>
        <Section icon='swap_horiz' alignItems='flex-start'>
          <Grid container={true} direction='column'>
            <Grid container={true} alignItems='center' direction='row' wrap='nowrap' justify='space-between'>
              <Grid item={true}>
                {assetType &&
                  <Typography variant='subtitle2'>
                    <Translate id={`App.BCSActivityCard.payoutType.${assetType}`} />
                  </Typography>
                }
              </Grid>
              <Grid item={true}>
                <Grid container={true} alignItems='center' direction='row'>
                  {orderDate &&
                    <Typography variant='caption'>{formatDateTime(orderDate)}</Typography>
                  }
                  {payoutStatus && <div className={payoutTaskStatusClasses.root}>
                    <BCSChip
                      type={payoutStatus}
                      label={<Translate id={`enum.PayoutStatus.${payoutStatus}`} />}
                    />
                  </div>}
                </Grid>
              </Grid>
            </Grid>
            {(assetType || orderDate || payoutStatus) && <SmallDivider />}
            <Grid container={true} direction='column'>
              <Typography variant='caption'>Договор: {payoutTask.agreementNumber}</Typography>
              <Typography variant='h2' classes={payoutTextClasses}>
                {payoutSum && formatMoney(payoutSum)}
              </Typography>

              {assetType === AssetType.Security &&
                <Grid
                  container={true}
                  justify='space-between'
                  direction='row'
                  wrap='nowrap'
                  spacing={16}
                  classes={payoutSecurityClasses}
                >
                  <Grid item={true}>
                    <Typography variant='body1'>
                      {payoutTask.securityName}
                    </Typography>
                  </Grid>
                  <Grid item={true}>
                    <Typography variant='h3'>
                      {payoutTask.securityAmount}&nbsp;шт.
                    </Typography>
                  </Grid>
                </Grid>
              }
            </Grid>
          </Grid>
        </Section>
        <Divider />
      </React.Fragment>
    );
  }),
  email: new Reader(({ key }: IEnv) => (email: IEmail) => (
    <React.Fragment key={key}>
      <Section icon='attach_file'>
        <CustomMarkupView message={email.messageText}>
          <Translate id='App.ActivityDetails.openEmail' />
        </CustomMarkupView>
      </Section>
      <Divider />
    </React.Fragment>
  )),
  sms: new Reader(({ key }: IEnv) => (sms: ISms) => (
    <React.Fragment key={key}>
      <Section icon='notes'>
        <Typography>{sms.messageText}</Typography>
      </Section>
      <Divider />
    </React.Fragment>
  )),
  webportalNews: new Reader(({ key }: IEnv) => (webportalNews: IWebportalNews) => (
    <React.Fragment key={key}>
      <Section icon='attach_file'>
        <CustomMarkupView message={webportalNews.messageText}>
          <Translate id='App.ActivityDetails.openNews' />
        </CustomMarkupView>
      </Section>
      <Divider />
    </React.Fragment>
  )),
};

const renderAdditionalData = (data: IAdditionalActivityData, classes: Record<string, string>) => {
  const ownProps = Object.keys(data);
  const components = ownProps.map((key, i) => ComponentMap[key].run({ key: i, classes })(data[key]));

  return <>{components}</>;
};

const clientComeText = (isClientHasCome: boolean) => (
  <span>
    <Translate id={`App.ActivityDetails.${isClientHasCome ? 'clientHasCome' : 'clientHasNotCome'}`} />.
  </span>
);

export class ActivityDetails extends React.PureComponent<ActivityDetailsProps> {

  private renderDescriptionBlock = () => {
    const { activity, classes } = this.props;
    const { activityType } = activity;
    const description = path(['additionalData', activity.activityType, 'description'], activity);
    const conTactResultClassName = classNames({ [classes.contactResultTitle]: !!description });
    const contactResult = path<string>(['additionalData', activityType, 'contactResult'], activity);
    const isClientHasCome = !!path<boolean>(['additionalData', ActivityType.Appointment, 'isClientHasCome'], activity);

    return (contactResult || description) && (
      <>
        <Section icon='notes' alignItems='flex-start'>
          {contactResult &&
            <Typography className={conTactResultClassName} variant='h3'>
              {activityType === ActivityType.Appointment && clientComeText(isClientHasCome)} {contactResult}
            </Typography>
          }
          {description && <Typography variant='body1'>{description}</Typography>}
        </Section>
        <Divider />
      </>
    );
  }

  private renderPayouTaskInfo = () => {
    const { activity, classes } = this.props;
    const payoutType = path<string>(['additionalData', activity.activityType, 'payoutType'], activity);
    const payoutReasonDetail = path<string>(['additionalData', activity.activityType, 'payoutReasonDetail'], activity);
    const payoutReason = path<string>(['additionalData', activity.activityType, 'payoutReason'], activity);
    const product = path<string>(['additionalData', activity.activityType, 'product'], activity);
    const payoutTypeClasses = { root: classes.payoutType };
    const isPayoutText = !!(payoutReasonDetail || payoutReason);

    return exceptionMap[activity.state] && (
      <>
        <Section icon='info_outlined'>
          {PayoutTypeMap[payoutType] ? (
            <Typography classes={payoutTypeClasses} variant='h3'>
              <Translate id={`enum.PayoutType.${payoutType}`} />
            </Typography>
          ) :
            <Typography variant='subtitle1' classes={payoutTypeClasses}>
              <Translate id='App.ActivityDetails.payoutTypeMissing' />
            </Typography>
          }
          {payoutType === PayoutType.ExternalPayout &&
            <Typography variant={isPayoutText ? 'body1' : 'body2'}>
              {payoutReasonDetail || payoutReason || <Translate id='App.ActivityDetails.payoutReasonMissing' />}
            </Typography>
          }
          {payoutType === PayoutType.InternalPayout &&
            <Typography variant={product ? 'body1' : 'body2'}>
              {product || <Translate id='App.ActivityDetails.productMissing' />}
            </Typography>
          }
        </Section>
        <Divider />
      </>
    );
  }

  renderClientInfo = () => {
    const { activity, classes } = this.props;
    const phoneNumber = path<string>(['additionalData', activity.activityType, 'phoneNumber'], activity);
    const clientTitleClasses = { root: classes.clientTitle };
    const cleintInfoWrapperClasses = { container: classes.cleintInfoWrapper };

    return (
      <>
        <Section icon='info'>
          <Grid container={true} classes={cleintInfoWrapperClasses} justify='space-between'>
            <Grid item={true}>
              <Grid container={true} direction='column'>
                <Grid item={true}>
                  <Typography classes={clientTitleClasses} variant='body1'>Клиент</Typography>
                </Grid>
                <Grid item={true}>
                  <Link to={`${ClientRouteMap.Dashboard}/${activity.pfpId}`}>{activity.clientFullName}</Link>
                </Grid>
              </Grid>
            </Grid>
            {phoneNumber &&
              <Grid item={true}>
                <Grid container={true} direction='column'>
                  <Grid item={true}>
                    <Typography classes={clientTitleClasses} variant='body1'>Номер</Typography>
                  </Grid>
                  <Grid item={true}>
                    <Typography variant='body1'>
                      {formatPhoneNumber(phoneNumber)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            }
          </Grid>
        </Section>
        <Divider />
      </>
    );
  }

  render() {
    const { activity, classes } = this.props;
    const rootClasses = { container: classes.root };

    return (
      <Grid container={true} direction='column' classes={rootClasses}>
        <BCSActivityCard model={success(resource(activity))} />
        <Divider />
        {activity.clientFullName && this.renderClientInfo()}
        {activity.activityType === ActivityType.PayoutTask && this.renderPayouTaskInfo()}
        {this.renderDescriptionBlock()}
        {renderAdditionalData(activity.additionalData, classes)}

        {activity.activityType !== ActivityType.ServiceMessage &&
          <>
            <Section icon='person'>
              <Typography variant='body1'>{activity.ownerFullName}</Typography>
            </Section>
            <Divider />
          </>
        }
        <Section>
          <Typography variant='caption'>
            Создана  {activity.createdByFullName}  {formatDateTime(activity.createDate)}
          </Typography>
        </Section>
      </Grid>
    );
  }
}

export default compose<ActivityDetailsProps, ActivityDetailsOutProps>(
  withStyles(styles),
)(ActivityDetails);
