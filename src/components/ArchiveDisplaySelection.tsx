import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FontAwesomeSvgIcon from "./FontAwesomeSvgIcon";

export const ArchiveDisplaySelection: React.FC<{
  showArchived: boolean;
  onToggle: () => void;
}> = ({ showArchived, onToggle }) => {
  return (
    <Tooltip title={showArchived ? "Hide archived" : "Show archived"}>
      <IconButton onClick={onToggle} color="primary">
        <FontAwesomeSvgIcon icon={showArchived ? faEye : faEyeSlash} />
      </IconButton>
    </Tooltip>
  );
};
