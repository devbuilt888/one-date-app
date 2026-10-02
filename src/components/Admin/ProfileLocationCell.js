import React from 'react';
import { Typography } from '@mui/material';
import { getDisplayLocation } from '../../utils/reverseGeocode';

const ProfileLocationCell = ({ profile, resolvedLabels, resolving = false }) => {
  const { area, coordinates } = getDisplayLocation(profile, resolvedLabels);

  if (!area && !coordinates) {
    return <Typography variant="body2">—</Typography>;
  }

  return (
    <>
      {area && (
        <Typography variant="body2" fontWeight={500}>
          {area}
        </Typography>
      )}
      {coordinates && (
        <Typography variant="caption" color="text.secondary" display="block">
          {coordinates}
        </Typography>
      )}
      {!area && coordinates && resolving && (
        <Typography variant="caption" color="text.secondary" display="block">
          Looking up area…
        </Typography>
      )}
    </>
  );
};

export default ProfileLocationCell;
