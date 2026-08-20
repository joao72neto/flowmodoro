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
      className={clsx("flex flex-col justify-center flex-1", className)}
    >
      <div
        className={clsx(
          "flex flex-col justify-center gap-8 bg-neutral-100 p-8 rounded-2xl",
          "shadow-[8px_15px_20px_rgba(0,0,0,0.30)]",
          "md:p-0 md:bg-transparent md:shadow-none",
        )}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default FormContainer;
