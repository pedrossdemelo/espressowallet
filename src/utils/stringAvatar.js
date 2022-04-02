function stringToColor(string) {
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

export default function stringAvatar(user, sx) {
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
