import {
  Lightbulb,
  Ruler,
  Hammer,
  FlaskConical,
  Rocket,
  Megaphone,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export const phaseIconMap: Record<string, LucideIcon> = {
  "ideation-discovery": Lightbulb,
  "requirements-design": Ruler,
  build: Hammer,
  "test-qa": FlaskConical,
  "release-operate": Rocket,
  "go-to-market-sales": Megaphone,
  "support-maintenance": LifeBuoy,
};

export function getPhaseIcon(phaseId: string): LucideIcon {
  return phaseIconMap[phaseId] ?? Lightbulb;
}
