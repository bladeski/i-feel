import { Emotion } from "./Emotion.type"
import { FormGroup } from "./FormGroup.type";

export class EmotionEntryClass {
  emotion: Emotion;
  form?: FormGroup[];

  get emotionEntry(): EmotionEntryType {
    return {
      emotion: this.emotion,
      form: this.form || []
    }
  }

  constructor(emotion: Emotion, form?: FormGroup[]) {
    this.emotion = emotion;
    this.form = form;
  }


}

export type EmotionEntryType = {
  emotion: Emotion;
  form: FormGroup[];
}