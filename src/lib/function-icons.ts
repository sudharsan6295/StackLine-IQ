import {
  Code2,
  Lightbulb,
  FlaskConical,
  Server,
  TrendingUp,
  Megaphone,
  Headset,
  LineChart,
  Landmark,
  Users,
  Scale,
  Bot,
  Palette,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/** Maps a BusinessFunction's `icon` field (functions.json) to its component. */
export const functionIconMap: Record<string, LucideIcon> = {
  Code2,
  Lightbulb,
  FlaskConical,
  Server,
  TrendingUp,
  Megaphone,
  Headset,
  LineChart,
  Landmark,
  Users,
  Scale,
  Bot,
  Palette,
  ShieldCheck,
};

export function getFunctionIcon(iconName: string): LucideIcon {
  return functionIconMap[iconName] ?? Bot;
}
