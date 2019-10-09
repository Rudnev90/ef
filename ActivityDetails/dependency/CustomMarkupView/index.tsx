import * as React from 'react';

import { BcsIconButton } from '@bcs/library';
import { Grid, Icon, StyleRulesCallback, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { compose } from 'recompose';

const styles: StyleRulesCallback = (theme: Theme) => ({
  iconButton: {
    borderRadius: '50%',
    marginRight: theme.spacing.unit,
    backgroundColor: blueGrey['100'],
  },
  icon: {
    color: blueGrey['400'],
  },
});

export interface ICustomMarkupViewProps {
  message: string;
}

export type CustomMarkupViewProps = ICustomMarkupViewProps & WithStyles<typeof styles, true>;

export class CustomMarkupView extends React.Component<CustomMarkupViewProps> {

  public handleClick = () => {
    const tabMarkupView = window.open('about:blank', '_blank').document;
    tabMarkupView.write(this.props.message);
    tabMarkupView.close();
  }

  render() {
    const { classes } = this.props;
    const iconButtonClasses = { root: classes.iconButton };
    const iconClasses = { root: classes.icon };
    return (
      <Grid container={true} direction='row' alignItems='center' wrap='nowrap'>
        <BcsIconButton
          classes={iconButtonClasses}
          color='primary'
          size='small'
          variant='text'
          onClick={this.handleClick}
        >
          <Icon classes={iconClasses} fontSize='small'>open_in_new</Icon>
        </BcsIconButton>
        <Typography variant='subtitle1'>{this.props.children}</Typography>
      </Grid>
    );
  }
}

export default compose<
  CustomMarkupViewProps,
  ICustomMarkupViewProps & Partial<WithStyles<typeof styles>>
>(
  withStyles(styles),
)(CustomMarkupView);
