import clsx from "clsx";
import { motion } from "framer-motion";
import { isNative } from "../../../../consts/platform";

const FormContainer = ({
  children,
  className,
  direction,
  onSubmit,
}: {
  children: React.ReactNode;
  className?: string;
  direction: -1 | 1;
  onSubmit?: () => void;
}) => {
  const enableHeavyAnimations = !isNative;

  if (enableHeavyAnimations) {
    return (
      <motion.form
        onSubmit={onSubmit}
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
      </motion.form>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      style={
        {
          "--slide-from": `${direction * 100}%`,
          "--slide-to": `${direction * -100}%`,
        } as React.CSSProperties
      }
      className={clsx(
        "flex flex-col justify-center flex-1",
        "animate-slide-in",
        className,
      )}
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
    </form>
  );
};

export default FormContainer;
