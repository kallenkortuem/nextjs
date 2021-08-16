import React from 'react';
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Typography variant="caption">
        © Copyright {new Date().getFullYear()} fiddlestats.com. Fiddlestats isn&apos;t endorsed by
        Riot Games and doesn&apos;t reflect the views or opinions of Riot Games
        or anyone officially involved in producing or managing Riot Games
        properties. Riot Games, and all associated properties are
        trademarks or registered trademarks of Riot Games, Inc.
      </Typography>
    </Typography>
  );
}
