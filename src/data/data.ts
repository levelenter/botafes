import marker0 from "./maker0";
import marker1 from "./maker1";
import marker2 from "./maker2";
import marker3 from "./maker3";
import marker4 from "./maker4";
import marker5 from "./maker5";

export type MakerData = {
  marker: string;
  title: string;
  avatarPos: string;
  avatarRot: string;
  label: "速度" | "サイズ";
  video: string | null;
  description: string;
  startIndex: number;
  speeds: number[];
  action: (speed: number) => void;
};
export const data: MakerData[] = [
  marker0,
  marker1,
  marker2,
  marker3,
  marker4,
  marker5,
];
