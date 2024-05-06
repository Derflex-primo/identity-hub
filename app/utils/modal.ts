const modal_style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '5px',
  p: 4,
  outline: 'none',
  '&:focus': {
    outline: 'none'
  },
  '&:focus-visible': {
    outline: 'none'
  },
  '@media (min-width: 600px)': {
      width: 800,
      borderRadius: '10px'
  },
  '@media (min-width: 300px) and (max-width: 385px)': {
      marginTop: '30px',   
  }
};

export default modal_style;
