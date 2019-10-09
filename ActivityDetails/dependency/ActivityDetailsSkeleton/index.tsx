import * as React from 'react';

import { Divider, Grid, StyleRulesCallback, Theme, withStyles, WithStyles } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import classNames from 'classnames';
import { compose } from 'recompose';

import stylesCSS from '../../../../style/skeleton.scss';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    width: '64vw',
  },
  titleLine: {
    width: 380,
    height: 24,
    backgroundColor: blueGrey[400],
    marginBottom: theme.spacing.unit,
    borderRadius: theme.spacing.unit * 0.5,
  },
  lineOne: {
    width: 288,
    height: 16,
    backgroundColor: blueGrey[100],
    borderRadius: theme.spacing.unit * 0.5,
  },
  lineTwo: {
    width: 580,
    height: 16,
    backgroundColor: blueGrey[100],
    marginBottom: theme.spacing.unit,
    borderRadius: theme.spacing.unit * 0.5,
  },
  lineThree: {
    width: 400,
    height: 16,
    backgroundColor: blueGrey[100],
    borderRadius: theme.spacing.unit * 0.5,
  },
  circle: {
    borderRadius: '50%',
    width: 48,
    height: 48,
    backgroundColor: blueGrey[100],
  },
  square: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 24,
    height: 24,
    backgroundColor: blueGrey[100],
    borderRadius: theme.spacing.unit * 0.5,
  },
  container: {
    paddingTop: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    paddingLeft: theme.spacing.unit * 4,
  },
  leftSide: {
    marginRight: theme.spacing.unit * 4,
  },
});

export type ActivityDetailsSkeletonProps = WithStyles<typeof styles>;

export type ActivityDetailsSkeletonOutProps = Partial<WithStyles<typeof styles>>;

export const ActivityDetailsSkeleton: React.FunctionComponent<ActivityDetailsSkeletonProps> = (props) => {
  const { classes } = props;
  const circleClases = { root: classNames(classes.circle, stylesCSS.animated) };
  const squareClases = { root: classNames(classes.square, stylesCSS.animated) };
  const titleLineClases = { root: classNames(classes.titleLine, stylesCSS.animated) };
  const lineOneClases = { root: classNames(classes.lineOne, stylesCSS.animated) };
  const lineTwoClases = { root: classNames(classes.lineTwo, stylesCSS.animated) };
  const lineThreeClases = { root: classNames(classes.lineThree, stylesCSS.animated) };
  const containerClasses = { container: classes.container };
  const leftSideClasses = { item: classes.leftSide };
  const rootClasses = { container: classes.root };

  return (
    <Grid classes={rootClasses} data-bcs-id='activity-details-skeleton' container={true} direction='column'>
      <Grid item={true}>
        <Grid container={true} classes={containerClasses}>
          <Grid item={true} classes={leftSideClasses}>
            <div className={circleClases.root} />
          </Grid>
          <Grid item={true}>
            <Grid container={true} direction='column'>
              <Grid item={true}>
                <div className={titleLineClases.root} />
              </Grid>
              <Grid item={true}>
                <div className={lineOneClases.root} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item={true}>
        <Divider />
      </Grid>
      <Grid item={true}>
        <Grid container={true} classes={containerClasses}>
          <Grid item={true} classes={leftSideClasses}>
            <div className={squareClases.root} />
          </Grid>
          <Grid item={true}>
            <Grid container={true} direction='column'>
              <Grid item={true}>
                <div className={lineTwoClases.root} />
              </Grid>
              <Grid item={true}>
                <div className={lineThreeClases.root} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item={true}>
        <Divider />
      </Grid>
      <Grid item={true}>
        <Grid container={true} classes={containerClasses} alignItems='center'>
          <Grid item={true} classes={leftSideClasses}>
            <div className={squareClases.root} />
          </Grid>
          <Grid item={true}>
            <div className={lineThreeClases.root} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default compose<ActivityDetailsSkeletonProps, ActivityDetailsSkeletonOutProps>(
  withStyles(styles),
)(ActivityDetailsSkeleton);
