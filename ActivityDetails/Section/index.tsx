import * as React from 'react';

import { Grid, Icon, StyleRulesCallback, Theme, WithStyles, withStyles } from '@material-ui/core';
import { GridDirection, GridItemsAlignment } from '@material-ui/core/Grid';
import { compose } from 'recompose';

export interface ISectionProps {
  icon?: string;
  direction?: GridDirection;
  alignItems?: GridItemsAlignment;
}

const styles: StyleRulesCallback = (theme: Theme) => ({
  iconWrapper: {
    paddingTop: 4 * theme.spacing.unit,
    paddingRight: 6 * theme.spacing.unit,
    paddingBottom: 4 * theme.spacing.unit,
    paddingLeft: 6 * theme.spacing.unit,
    minWidth: 120,
  },
  icon: {
    color: '#6d8591',
  },
  contentWrapper: {
    paddingTop: 4 * theme.spacing.unit,
    paddingRight: 4 * theme.spacing.unit,
    paddingBottom: 4 * theme.spacing.unit,
    width: '100%',
  },
});

export type SectionProps = ISectionProps & WithStyles<typeof styles, true>;

export class Section extends React.PureComponent<SectionProps> {
  render() {
    const {
      alignItems = 'center',
      icon,
      children,
      classes,
      direction = 'row' } = this.props;
    const iconWrapperClasses = { item: classes.iconWrapper };
    const iconClasses = { root: classes.icon };
    const contentClasses = { item: classes.contentWrapper };

    return (
      <Grid
        container={true}
        direction={direction}
        wrap='nowrap'
        alignItems={alignItems}
      >
        <Grid item={true} classes={iconWrapperClasses}>
          {icon && <Icon classes={iconClasses}>{icon}</Icon>}
        </Grid>
        <Grid
          item={true}
          classes={contentClasses}
        >
          {children}
        </Grid>
      </Grid>
    );
  }
}

export default compose<
  SectionProps,
  ISectionProps & Partial<WithStyles<typeof styles>>
>(
  withStyles(styles),
)(Section);
