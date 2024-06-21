import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../App";
import Slider from "@react-native-community/slider";

const Seeker = () => {
  const { color, currentSong, playerHelpers }: any = useContext(AppContext);
  const [progress, setProgress] = useState(0);
  const [thumbVisible, setThumbVisible] = useState(false);
  useEffect(() => {
    const interval = setInterval(async () => {
      if (currentSong) {
        playerHelpers.getSeekPosition().then((r: number) => {
          if (r) setProgress(r);
          else setProgress(0);
        });
      }
    }, 200);

    return () => clearInterval(interval);
  }, [currentSong]);

  const handleSlidingStart = () => {
    setThumbVisible(true);
  };

  const handleSlidingComplete = async (value: any) => {
    setThumbVisible(false);
    playerHelpers.setSeekPosition(value);
  };

  return (
    <Slider
      style={{ width: "100%", height: 4 }}
      minimumValue={0}
      maximumValue={1}
      thumbTintColor={thumbVisible ? color.accent : "transparent"}
      onSlidingStart={handleSlidingStart}
      onSlidingComplete={handleSlidingComplete}
      maximumTrackTintColor={color.secondary}
      minimumTrackTintColor={color.accent}
      value={progress}
    />
  );
};

export default Seeker;
