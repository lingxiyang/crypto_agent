/**
 * src/components/Characters/index.jsx
 * create and display characters
 *
 * created by lansane on 7/16/23
 */

// Characters
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import GroupsIcon from '@mui/icons-material/Groups';
import './style.css';

const Characters = ({
  isMobile,
  characterGroups,
  selectedCharacter,
  setSelectedCharacter,
  isPlaying,
  characterConfirmed,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openLibraryDialog, setOpenLibraryDialog] = useState(false);

  const handleCharacterSelection = character => {
    setSelectedCharacter(character);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenLibraryDialog = () => {
    setOpenLibraryDialog(true);
  };

  const handleCloseLibraryDialog = () => {
    setOpenLibraryDialog(false);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ marginBottom: 5 }}
      className='main-container'
    >
      {characterGroups.map(
        (character, index) =>
          ((!characterConfirmed && character.source === 'default') ||
            (selectedCharacter &&
              character.character_id === selectedCharacter.character_id)) && (
            <Grid item xs={isMobile ? 12 : 6} key={index}>
              <Button
                variant='outlined'
                onClick={() => handleCharacterSelection(character)}
                sx={{
                  width: '100%',
                  backgroundColor:
                    selectedCharacter &&
                    character.character_id === selectedCharacter.character_id
                      ? '#35394A'
                      : '#1B2134',
                  borderColor:
                    selectedCharacter &&
                    character.character_id === selectedCharacter.character_id
                      ? '#A7BFFF'
                      : '#1B2134',
                  '&:hover': {
                    backgroundColor: '#35394A',
                    borderColor: '#617CC2',
                  },
                  display: 'flex',
                  justifyContent: 'left',
                  textTransform: 'none',
                }}
              >
                <Avatar
                  alt={character.name}
                  src={character.image_url}
                  sx={{ marginRight: 1 }}
                />
                <Typography
                  variant='body1'
                  sx={{
                    color: 'white',
                    fontFamily: 'Prompt, sans-serif',
                  }}
                >
                  {character.name}
                </Typography>
              </Button>
            </Grid>
          )
      )}

      
    </Grid>
  );
};

export default Characters;
