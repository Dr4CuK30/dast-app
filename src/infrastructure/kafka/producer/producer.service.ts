import { Injectable } from '@nestjs/common';
import { KafkaTopicsEnum } from '../enums/topics.enum';
import { Kafka } from 'kafkajs';
import { StartActiveScanDto, StartSpiderScanDto } from '../dtos/kafka.dto';

@Injectable()
export class KafkaProducerService {
  private kafka: Kafka;
  constructor() {
    const kafkaHost = process.env.KAFKA_HOST;
    const kafkaPort = process.env.KAFKA_PORT;
    this.kafka = new Kafka({
      clientId: 'dast-producer',
      brokers: [`${kafkaHost}:${kafkaPort}`],
    });
  }

  sendSpiderEvent(data: StartSpiderScanDto) {
    this.sendMessage(KafkaTopicsEnum.SPIDER, data);
  }

  sendAscanEvent(data: StartActiveScanDto) {
    this.sendMessage(KafkaTopicsEnum.ASCAN, data);
  }

  sendAjaxSpiderEvent(data: StartSpiderScanDto) {
    this.sendMessage(KafkaTopicsEnum.AJAX_SPIDER, data);
  }

  private async sendMessage(topic: KafkaTopicsEnum, data: object) {
    const producer = this.kafka.producer();
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }],
    });
    await producer.disconnect();
  }
}
