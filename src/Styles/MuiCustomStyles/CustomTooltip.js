import React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';


const CustomTooltip = styled(({ className, ...props }) => (

    <Tooltip {...props} classes={{ popper: className }} />

  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
    //   color: theme.palette.common.black,
      color: '#434851',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#434851', // Your custom background color
      color: 'white', // Your custom text color
      fontSize: 14, // Your custom font size
      fontWeight: '400', // Custom font weight
      boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)', // Your custom box shadow
    },
  }));

  export default CustomTooltip;