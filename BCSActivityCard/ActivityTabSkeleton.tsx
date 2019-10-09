import * as React from 'react';

import { Paper, StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import classNames from 'classnames';

import stylesCSS from './style.scss';

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
    backgroundColor: blueGrey[100],
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
    maxWidth: 482,
    maxHeight: 24,
    minHeight: 24,
    borderRadius: 4,
    backgroundColor: blueGrey[200],
  },
  centerBottom: {
    display: 'flex',
    alignItems: 'center',
  },
  fakeDate: {
    maxWidth: 192,
    minWidth: 192,
    maxHeight: 16,
    minHeight: 16,
    borderRadius: 4,
    backgroundColor: blueGrey[50],
  },
  right: {},
  fakeChip: {
    maxWidth: 102,
    minWidth: 102,
    maxHeight: 32,
    minHeight: 32,
    borderRadius: 4,
    backgroundColor: blueGrey[100],
  },
});

export interface IActivityTabSkeleton extends WithStyles<typeof styles> { }

class ActivityTabSkeleton extends React.Component<IActivityTabSkeleton> {
  render() {
    const { classes } = this.props;
    const paperClasses = {
      root: classes.rootPaper,
    };
    const wrapperClasses = {
      main: classes.root,
      left: classes.left,
      center: classes.center,
      ceterTop: classes.centerTop,
      ceterBottom: classes.centerBottom,
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
            <div className={wrapperClasses.ceterTop}>
              <div className={animatedTitleClasses} />
            </div>
            <div className={wrapperClasses.ceterBottom}>
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

export default withStyles(styles)(ActivityTabSkeleton);
