import { PiSunBold, PiMoonBold } from "react-icons/pi";
import { useTheme } from "../contexts/theme.context";
import IconButton from "../../features/home/components/buttons/IconButton";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      icon={
        theme === "light" ? (
          <PiMoonBold
            size={25}
            className="transition-transform duration-300 hover:rotate-12"
          />
        ) : (
          <PiSunBold
            size={25}
            className="transition-transform duration-300 hover:rotate-12 text-primary"
          />
        )
      }
      onClick={toggleTheme}
      title={
        theme === "light" ? "Mudar para modo escuro" : "Mudar para modo claro"
      }
    />
  );
};

export default ThemeToggle;
