import { faArrowUp91 } from "@fortawesome/free-solid-svg-icons/faArrowUp91";
import { faArrowUp19 } from "@fortawesome/free-solid-svg-icons/faArrowUp19";
import { faSort } from "@fortawesome/free-solid-svg-icons/faSort";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeSvgIcon } from "./FontAwesomeSvgIcon";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const SortOrders = {
  priority: {
    description: "Manual priority",
    icon: faSort,
  } as const,
  lastPrayedDesc: {
    description: "Last prayed (desc)",
    icon: faArrowUp91,
  } as const,
  lastPrayedAsc: {
    description: "Last prayed (asc)",
    icon: faArrowUp19,
  } as const,
} as const;

export type SortOrder = keyof typeof SortOrders;

export const SortOrderSelection: React.FC<{
  order: SortOrder;
  onChange: (newOrder: SortOrder) => void;
}> = ({ order, onChange }) => {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const handleMenuClose = (newOrder?: SortOrder) => {
    setAnchorElement(null);
    if (newOrder) {
      onChange(newOrder);
    }
  };

  return (
    <>
      <Tooltip title="Order by">
        <IconButton
          onClick={(e) => setAnchorElement(e.currentTarget)}
          color="default"
        >
          <FontAwesomeSvgIcon icon={SortOrders[order].icon} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="sort-order-menu"
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElement)}
        onClose={() => handleMenuClose()}
      >
        {(Object.keys(SortOrders) as SortOrder[]).map((item) => (
          <MenuItem key={item} onClick={() => handleMenuClose(item)}>
            <ListItemIcon>
              <FontAwesomeSvgIcon icon={SortOrders[item].icon} />
            </ListItemIcon>
            <ListItemText>{SortOrders[item].description}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
