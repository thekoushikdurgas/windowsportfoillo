export const playSound = (soundFile: string) => {
  try {
    const audio = new Audio(soundFile);
    // Set volume to a reasonable level to avoid being too loud.
    audio.volume = 0.5;
    audio.play().catch(error => {
      // Autoplay was prevented. This is common in browsers and can be ignored for UI sounds.
      console.log(`Could not play sound ${soundFile} due to autoplay policy:`, error);
    });
  } catch (error) {
    console.error(`Error playing sound ${soundFile}:`, error);
  }
};
