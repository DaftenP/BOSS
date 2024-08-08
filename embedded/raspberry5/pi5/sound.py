import pygame
import os

class SoundPlayer:
    def __init__(self):
        # Initialize pygame mixer
        pygame.mixer.init()

        # Define relative paths
        self.base_path = os.path.abspath(os.path.dirname(__file__))
        self.alert_path = os.path.join(self.base_path, "../pi5/sound/alert.mp3")
        self.check_path = os.path.join(self.base_path, "../pi5/sound/check.mp3")

    def load_music(self, file_path):
        """Load a music file."""
        try:
            pygame.mixer.music.load(file_path)
        except pygame.error as e:
            print(f"Error loading sound: {e}")

    def play_music(self):
        """Play loaded music if not already playing."""
        try:
            if not pygame.mixer.music.get_busy():
                pygame.mixer.music.play()
        except pygame.error as e:
            print(f"Error playing sound: {e}")

    def play_alert_sound(self):
        """Load and play alert sound."""
        self.load_music(self.alert_path)
        self.play_music()

    def play_check_sound(self):
        """Load and play check sound."""
        self.load_music(self.check_path)
        self.play_music()


if __name__ == "__main__":
    # Example usage
    sound_player = SoundPlayer()
    sound_player.play_alert_sound()
    pygame.time.wait(1000)  # Wait for 2 seconds before playing the next sound
    sound_player.play_check_sound()
