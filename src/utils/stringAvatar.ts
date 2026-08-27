import { AvatarProps } from "@mui/material";
import { User } from "firebase/auth";

// Always called with a plain style-object literal (never the function/array
// forms SxProps<Theme> also allows), so it can be safely spread below.
type SxObject = Record<string, unknown>;

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }

  return color;
}

export default function stringAvatar(
  user: User,
  sx?: SxObject
): Pick<AvatarProps, "src" | "sx" | "children"> {
  if (!user.email) return { sx };
  if (user.photoURL) return { src: user.photoURL, sx };
  return {
    sx: {
      ...sx,
      bgcolor: stringToColor(user.email),
      fontWeight: 500,
    },
    children: `${user.email[0].toUpperCase()}`,
  };
}
