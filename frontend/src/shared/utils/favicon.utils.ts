export const updateFaviconWithTime = ({
  time,
  color,
  textColor,
}: {
  time: string;
  color: string;
  textColor?: string;
}) => {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(16, 16, 16, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = textColor || "#ffffff";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(time, 16, 16);

  const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
  if (link) {
    link.href = canvas.toDataURL("image/png");
  }
};

export const resetFavicon = () => {
  const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
  if (link) {
    link.href = "/flowmodoro-icon.svg";
  }
};
