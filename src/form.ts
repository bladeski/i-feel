import { Field, FormGroup } from "./types";

import { FormGroups } from "./data";

export class Form {
  formElement: HTMLFormElement;

  constructor(parentElement: HTMLElement) {
    this.formElement = document.createElement('form');
    FormGroups.forEach((formGroup: FormGroup) => {
      const formGroupElement = this.createFormGroupElement(formGroup);
      this.formElement.appendChild(formGroupElement);
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';

    const checkmark = document.createElement('span');
    checkmark.textContent = '✔';
    checkmark.classList.add('check');
    submitButton.appendChild(checkmark);

    const submitButtonLabel = document.createElement('span');
    submitButtonLabel.textContent = 'Save';
    submitButton.appendChild(submitButtonLabel);

    submitButton.classList.add('save-emotion');
    this.formElement.appendChild(submitButton);
    parentElement.appendChild(this.formElement);

    this.formElement.addEventListener('submit', this.onSubmitForm.bind(this));

    this.disable();
  }

  disable() {
    this.formElement.querySelectorAll('input').forEach((input: HTMLInputElement) => {
      input.disabled = true;
    });
    this.formElement.querySelectorAll('button').forEach((button: HTMLButtonElement) => {
      button.disabled = true;
    });
  }

  enable() {
    this.formElement.querySelectorAll('input').forEach((input: HTMLInputElement) => {
      input.disabled = false;
    });
    this.formElement.querySelectorAll('button').forEach((button: HTMLButtonElement) => {
      button.disabled = false;
    });
  }

  reset() {
    this.formElement.reset(); 
    this.disable();
  }

  submit() {
    this.onSubmitForm();
  }

  updateFieldValue(fieldName: string, value: string) {
    const input = this.formElement.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement;
    input.value = value;
  }

  private createFieldElement(field: Field) {
    const label = document.createElement('label');

    const span = document.createElement('span');
    span.textContent = field.label || '';
    label.appendChild(span);

    const input = document.createElement('input');
    input.type = field.type;
    input.name = field.name;
    input.value = field.value as string;
    input.placeholder = field.placeholder || field.label;
    input.required = field.required || false;
    label.appendChild(input);

    return label;
  }

  private createFormGroupElement(formGroup: FormGroup) {
    const formGroupElement = document.createElement('div');
    formGroupElement.classList.add('form-group');
    formGroupElement.dataset.name = formGroup.name;

    const title = document.createElement('h2');
    title.textContent = formGroup.name;
    formGroupElement.appendChild(title);

    formGroup.fields.map(this.createFieldElement.bind(this))
      .forEach(fieldElement => formGroupElement.appendChild(fieldElement));

    return formGroupElement;
  }

  private onSubmitForm(event?: Event) {
    event?.preventDefault();
    const formData = new FormData(this.formElement);
    const form = Array.from(formData.keys()).map(key => ({
      name: key,
      value: formData.get(key)
    }));

    const formGroups: FormGroup[] = FormGroups.map(group => ({
      ...group,
      fields: group.fields.map(field => ({
        ...field,
        value: form.find(formField => formField.name === field.name)?.value as string || field.value
      }))
    }));
    
    const emotionEntryEvent = new CustomEvent<FormGroup[]>('emotion-entry', { detail: formGroups });
    this.formElement.dispatchEvent(emotionEntryEvent);
  }
}