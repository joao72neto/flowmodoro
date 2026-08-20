import clsx from "clsx";
import { motion } from "framer-motion";

const FormContainer = ({
  children,
  className,
  direction,
}: {
  children: React.ReactNode;
  className?: string;
  direction: -1 | 1;
}) => {
  return (
    <motion.div
      initial={{ x: `${direction * 100}%` }}
      animate={{ x: 0 }}
      exit={{ x: `${direction * -100}%` }}
      className={clsx("flex flex-col justify-center gap-8 flex-1", className)}
    >
      {children}
    </motion.div>
  );
};

export default FormContainer;
