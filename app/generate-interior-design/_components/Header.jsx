"use client";

import { Building } from "lucide-react";
import { motion } from "framer-motion";
import { FeatureIcon } from "@/components/feature-icons";

export function Header() {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };
  return (
    <motion.div className="mb-8 flex items-center" variants={itemVariants}>
      <FeatureIcon icon={Building} size="lg" gradient="blue" className="mr-4" />
      <div>
        <h1 className="text-3xl font-bold heading-font">
          Generate Interior Design
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-generated interior concepts to match your mood, theme, or budget.
          Your room, reimagined by AI.
        </p>
      </div>
    </motion.div>
  );
}
