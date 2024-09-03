import { Emotions } from "./Emotions";
import { FormGroup } from "../types";

const emotionOptions = Emotions.map(emotion => ({ value: emotion.id, label: emotion.name, parentId: emotion.parentId }));

export const FormGroups: FormGroup[] = [
  {
    name: 'Activating Event',
    fields: [
      {
        name: 'trigger',
        type: 'text',
        value: '',
        label: 'Trigger',
        placeholder: 'What triggered this emotion?'
      }
    ]
  }, {
    name: 'Beliefs',
    fields: [
      {
        name: 'beliefs',
        type: 'text',
        value: '',
        label: 'What did you believe?',
        placeholder: 'What were your thoughts at this time?'
      }
    ]
  }, {
    name: 'Consequences',
    fields: [
      {
        name: 'physicalFeelings',
        type: 'text',
        value: '',
        label: 'Physical Feelings',
        placeholder: 'What were your physical feelings at this time?'
      }, {
        name: 'emotionalResponse',
        type: 'multiselect',
        options: emotionOptions.filter(emotion => !emotion.parentId)
          .map(option => ({
            ...option,
            options: emotionOptions.filter(child => child.parentId === option.value)
          })),
        value: [],
        label: 'Emotional Response',
        placeholder: 'What were your emotions at this time?',
        required: true
      }
    ]
  }, {
    name: 'Disputation',
    fields: [
      {
        name: 'hotThought',
        type: 'text',
        value: '',
        label: 'Hot Thought',
        placeholder: 'What was your hot thought?'
      }, {
        name: 'evidenceSupporting',
        type: 'text',
        value: '',
        label: 'Evidence Supporting',
        placeholder: 'What evidence supports your hot thought?'
      }, {
        name: 'evidenceAgainst',
        type: 'text',
        value: '',
        label: 'Evidence Against',
        placeholder: 'What evidence is against your hot thought?'
      }, {
        name: 'unhelpfulThinking',
        type: 'text',
        value: '',
        label: 'Unhelpful Thinking Styles',
        placeholder: 'What unhelpful thinking styles are present?'
      } , {
        name: 'alternativeThought',
        type: 'text',
        value: '',
        label: 'Alternative Thought',
        placeholder: 'What is an alternative thought?'
      }
    ]
  }, {
    name: 'Exchange',
    fields: [
      {
        name: 'newBelief',
        type: 'text',
        value: '',
        label: 'New Belief',
        placeholder: 'What is your new belief?'
      }
    ]
  }
];