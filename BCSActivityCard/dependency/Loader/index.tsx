import * as React from 'react';

import { Paper, StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core';
import classNames from 'classnames';
import { compose } from 'recompose';

import stylesCSS from '../../style.scss';

const styles: StyleRulesCallback = (theme) => ({
  rootPaper: {
    overflow: 'hidden',
    width: '100%',
    borderRadius: theme.spacing.unit / 2,
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing.unit * 4,
    backgroundColor: theme.palette.secondary.contrastText,
  },
  fakeIcon: {
    maxWidth: 48,
    minWidth: 48,
    maxHeight: 48,
    minHeight: 48,
    backgroundColor: '#cfd8dc',
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
  fakeTitle: {
    maxWidth: 148,
    maxHeight: 24,
    minHeight: 24,
    backgroundColor: '#b0bec5',
  },
  centerBottom: {
    display: 'flex',
    alignItems: 'center',
  },
  fakeDate: {
    maxWidth: 88,
    minWidth: 88,
    maxHeight: 16,
    minHeight: 16,
    backgroundColor: '#cfd8dc',
  },
  right: {},
  fakeChip: {
    maxWidth: 60,
    minWidth: 60,
    maxHeight: 32,
    minHeight: 32,
    backgroundColor: '#cfd8dc',
  },
});

export type ActivityTabLoaderProps = WithStyles<typeof styles, true>;
export type ActivityTabLoaderOuterProps = Partial<WithStyles<typeof styles, true>>;

export class ActivityTabLoader extends React.Component<ActivityTabLoaderProps> {
  render() {
    const { classes } = this.props;
    const paperClasses = {
      root: classes.rootPaper,
    };
    const wrapperClasses = {
      main: classes.root,
      left: classes.left,
      center: classes.center,
      centerTop: classes.centerTop,
      centerBottom: classes.centerBottom,
      right: classes.right,
    };
    const notificationMessageClasses = {
      root: classes.notificationMessage,
    };
    const animatedIconClasses = classNames({
      [classes.fakeIcon]: true,
      [stylesCSS.animated]: true,
    });
    const animatedTitleClasses = classNames({
      [classes.fakeTitle]: true,
      [stylesCSS.animated]: true,
    });
    const animatedDataClasses = classNames({
      [classes.fakeDate]: true,
      [stylesCSS.animated]: true,
    });
    const animatedChipClasses = classNames({
      [classes.fakeChip]: true,
      [stylesCSS.animated]: true,
    });

    return (
      <Paper classes={paperClasses}>
        <section className={wrapperClasses.main}>
          <div className={wrapperClasses.left}>
            <div className={animatedIconClasses} />
          </div>
          <div className={wrapperClasses.center}>
            <div className={wrapperClasses.centerTop}>
              <div className={animatedTitleClasses} />
            </div>
            <div className={wrapperClasses.centerBottom}>
              <div className={notificationMessageClasses.root}>
                <div className={animatedDataClasses} />
              </div>
            </div>
          </div>
          <div className={wrapperClasses.right}>
            <div className={animatedChipClasses} />
          </div>
        </section>
      </Paper>
    );
  }
}

export default compose<ActivityTabLoaderProps, ActivityTabLoaderOuterProps>(
  withStyles(styles),
)(ActivityTabLoader);
