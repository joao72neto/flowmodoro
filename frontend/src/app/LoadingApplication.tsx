import { useEffect, useState } from "react";
import { GiSandsOfTime } from "react-icons/gi";

const getLoadingMessage = (seconds: number) => {
  if (seconds < 30) return "Preparando tudo pra você...";
  if (seconds < 60) return "Carregando a experiência...";
  if (seconds < 90) return "Quase lá, só mais um instante...";
  if (seconds < 120) return "Ainda trabalhando nisso...";
  return "Está demorando mais que o esperado, mantendo a conexão ativa...";
};

const LoadingApplication = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-neutral-100 flex flex-col items-center justify-center z-50 p-4">
      <div className="flex flex-col items-center max-w-sm text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-danger/20 blur-3xl rounded-full animate-pulse" />
          <GiSandsOfTime
            size={80}
            className="text-primary animate-spin-slow relative z-10"
          />
        </div>

        <h1 className="text-2xl font-bold text-neutral-10 mb-4">
          Acordando o Servidor
        </h1>

        <p className="text-neutral-40 mb-6 leading-relaxed">
          A API está hospedada em um servidor gratuito que entra em repouso após
          inatividade. Isso pode levar cerca de{" "}
          <span className="text-primary font-semibold text-nowrap">
            1 a 2 minutos
          </span>
          .
        </p>

        <div className="h-6 mb-6 flex items-center justify-center w-full">
          <p className="text-sm font-medium text-neutral-20 animate-pulse text-center">
            {getLoadingMessage(seconds)}
          </p>
        </div>

        <div className="w-full bg-neutral-80/50 h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full animate-loading-bar" />
        </div>

        <div className="flex items-center justify-between w-full mt-4">
          <p className="text-xs text-neutral-40 italic">
            Agradeço a sua paciência! 🎉
          </p>
          <span className="text-xs font-mono text-neutral-40 font-semibold">
            {seconds}s
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingApplication;
