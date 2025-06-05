import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

@Controller("tts")
export class TextToSpeechController {
  private client: TextToSpeechClient;

  constructor() {
    this.client = new TextToSpeechClient();
  }

  @Post()
  async convertTextToSpeech(@Body("text") text: string) {
    if (!text) {
      throw new HttpException("El texto es requerido", HttpStatus.BAD_REQUEST);
    }

    const request = {
      input: { text },
      voice: { languageCode: "es-MX", ssmlGender: "NEUTRAL" as const },
      audioConfig: { audioEncoding: "MP3" as const },
    };

    try {
      const result = await (this.client.synthesizeSpeech as any)(request);
      const response = result[0];
      if (!response.audioContent) {
        throw new HttpException(
          "No se pudo generar el audio",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      
      return { audioContent: response.audioContent.toString("base64") };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Error al generar audio",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
