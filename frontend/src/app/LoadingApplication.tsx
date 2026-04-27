import { GiSandsOfTime } from "react-icons/gi";

const LoadingApplication = () => {
  return (
    <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center z-50 p-4">
      <div className="flex flex-col items-center max-w-sm text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-danger/20 blur-3xl rounded-full animate-pulse" />
          <GiSandsOfTime
            size={80}
            className="text-danger animate-spin-slow relative z-10"
          />
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">
          Acordando o Servidor
        </h1>

        <p className="text-neutral-400 mb-6 leading-relaxed">
          A API está hospedada em um servidor gratuito que entra em repouso após
          inatividade. Isso pode levar de{" "}
          <span className="text-danger font-semibold text-nowrap">
            50 a 120 segundos
          </span>
          .
        </p>

        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div className="bg-danger h-full animate-loading-bar" />
        </div>

        <p className="text-xs text-neutral-500 mt-4 italic">
          Agradeço a sua paciência! 🎉
        </p>
      </div>
    </div>
  );
};

export default LoadingApplication;
