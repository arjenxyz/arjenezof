import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4a5d49",
          color: "#f7f5f0",
          fontSize: 280,
          fontFamily: "Georgia, serif",
          fontWeight: 600,
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
