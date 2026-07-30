import { NativeAudio } from "@capacitor-community/native-audio";
import { LocalNotifications } from "@capacitor/local-notifications";

class AlarmService {
  async init() {
    try {
      await NativeAudio.preload({
        assetId: "rest_sound",
        assetPath: "public/sounds/alarm.wav",
        audioChannelNum: 1,
        isUrl: false,
      });
      console.log("Áudio carregado com sucesso!");

      await LocalNotifications.createChannel({
        id: "flowmodoro_alarme_v1",
        name: "Alarme de Descanso",
        description: "Toca o alarme quando o descanso acaba",
        importance: 5,
        sound: "alarm.wav",
        vibration: true,
        visibility: 1,
      });
      console.log("Canal de notificação criado com sucesso!");
    } catch (error) {
      console.error("Erro ao carregar áudio:", error);
    }
  }

  async playLoop() {
    try {
      await NativeAudio.loop({
        assetId: "rest_sound",
      });
    } catch (error) {
      console.error("Erro ao tocar áudio:", error);
    }
  }

  async stop() {
    try {
      await NativeAudio.stop({
        assetId: "rest_sound",
      });
    } catch (error) {
      console.error("Erro ao parar áudio:", error);
    }
  }
}

export default new AlarmService();
