<template>
  <div>
    <header>
      <h1>Добро пожаловать в чат</h1>
    </header>
    <main>
      <div id="msg-border">
        <div id="messages">
          <template v-for="(message, index) in messages">
            <p v-if="isTextMessage(message)" :key="'text-' + index">
              {{ getMessageDisplay(message) }}
            </p>
            <p v-else-if="isImageMessage(message)" :key="'image-' + index">
              <span v-if="message.message">{{ getMessageDisplay(message) }}</span>
              <img :src="message.data" alt="Sent Image" style="max-width: 100%;">
            </p>
          </template>
        </div>
      </div>
      <input type="file" id="imageInput" @change="handleImageChange" class="file-input">
      <span v-if="isFileSelected">Файл выбран: {{ imageFile?.name }}</span>
      <input type="text" id="message" v-model="message" placeholder="Введи сообщение, бро">
      <button v-if="message.length !== 0 || isFileSelected" class="sendSMS" @click="sendMessage">Отправить</button>
      <button v-else disabled class="sendSMS">Отправить</button>
    </main>
    <div ref="modalts" id="modal">
      <div id="modal__content">
        <h1 class="modal__title">Введи никнейм не меньше 4 символов</h1>
        <input type="text" v-model="nick">
        <button v-if="nick.length >= 4" @click="confirmNick">Подтвердить</button>
        <button v-else disabled>Подтвердить</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface TextMessage {
  type: 'text';
  nick: string;
  message: string;
}

interface ImageMessage {
  type: 'image';
  nick: string;
  message?: string;
  data: string;
}

export default defineComponent({
  data() {
    return {
      ws: null as WebSocket | null,
      nick: '',
      message: '',
      messages: [] as (TextMessage | ImageMessage)[],
      imageFile: null as File | null,
      isFileSelected: false,
    };
  },
  methods: {
    confirmNick() {
      const port = 1234;
      //Сообщение о подключении к чату
      if (this.nick) {
        this.ws = new WebSocket(`ws://localhost:${port}`);
        this.ws.onopen = () => {
          const joinMessage: TextMessage = {
            type: 'text',
            nick: this.nick,
            message: `${this.nick} присоединился к чату`,
          };
          this.ws?.send(JSON.stringify(joinMessage));
        };

        this.ws.onmessage = (event) => {
          const receivedMessages: (TextMessage | ImageMessage)[] = JSON.parse(event.data);
          this.messages = receivedMessages;
        };
      }

      const modal = this.$refs.modalts as HTMLDivElement;
      if (modal) {
        modal.style.display = 'none';
      }
    },
    handleImageChange(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      this.imageFile = (inputElement.files || [])[0];
      this.isFileSelected = true;
    },
    sendMessage() {
      if ((this.message || this.imageFile) && this.ws && this.nick) {
        if (this.imageFile) {
          const reader = new FileReader();
          reader.onload = () => {
            const imageMessage: ImageMessage = {
              type: 'image',
              nick: this.nick,
              message: this.message,
              data: reader.result as string,
            };
            if(this.ws){this.ws.send(JSON.stringify(imageMessage));}
            this.imageFile = null;
            this.isFileSelected = false;
          };
          reader.readAsDataURL(this.imageFile);
        } else {
          const textMessage: TextMessage = {
            type: 'text',
            nick: this.nick,
            message: this.message,
          };
          this.ws.send(JSON.stringify(textMessage));
          this.message = '';
        }
      }
    },
    getMessageDisplay(message: TextMessage | ImageMessage): string {
      return message.type === 'text'
        ? message.nick === this.nick
          ? `(You): ${message.message}`
          : `${message.nick}: ${message.message}`
        : message.type === 'image'
        ? message.nick === this.nick
          ? `(You): Image`
          : `${message.nick}: Image`
        : '';
    },
    isTextMessage(message: TextMessage | ImageMessage): message is TextMessage {
      return message.type === 'text';
    },
    isImageMessage(message: TextMessage | ImageMessage): message is ImageMessage {
      return message.type === 'image';
    },
  },
});
</script>

<style>
#modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 5vh;
}
.file-input {
  color: transparent;
}
#modal__content {
  display: block;
  width: 100%;
  max-width: 60vh;
  padding: 5vh;
  background: #f9f9f9;
  position: relative;
  box-shadow: 0 5px 15px black;
}

.modal__title {
  font-size: 1.8rem;
  margin: 0 0 15px;
}

.modal__description {
  font-size: 1.125rem;
}

header {
  text-align: center;
}

main {
  margin: auto;
  width: 75vh;
}

#msg-border {
  border: 1px solid #ccc;
  height: 50vh;
  scroll-behavior: auto;
  overflow-y: scroll;
}

#messages {
  margin: 2vh;
}

#messages p {
  max-width: 80%;
  word-wrap: break-word;
  margin-bottom: 8px;
}

#msg-border,
#sendSMS {
  margin-top: 0.2vh;
}

#message {
  width: 62vh;
  height: 5vh;
  margin: auto;
}

.sendSMS {
  width: 12vh;
  height: 6vh;
}
</style>
