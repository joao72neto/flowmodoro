import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-neutral-100">
      <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full -rotate-90"
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-neutral-60"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-primary"
            strokeDasharray={2 * Math.PI * 44}
            initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{
              duration: 1.55,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>

        <motion.div
          className="absolute h-16 w-16 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.15, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.img
          src="/flowmodoro-icon.svg"
          alt="Flowmodoro Logo"
          width={44}
          height={44}
          className="relative drop-shadow-sm"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-col items-center gap-1"
      >
        <span className="text-lg font-medium tracking-wide text-neutral-10">
          Iniciando...
        </span>
        <p className="text-sm text-neutral-20">Preparando o sistema</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
