import { Emotion, FormGroup } from "./types";

import { EmotionEntryClass } from './types/EmotionEntry.type';
import { Emotions } from "./data";
import { Form } from "./form";
import { StorageService } from "./services";

class App {
  private form = new Form(document.querySelector('.details') as HTMLElement);
  private selectedEmotion: Emotion | null = null;

  constructor() {
    const parent = document.querySelector('form .emotions');
    parent && Promise.all(
      Emotions
        .sort((a, b) =>
          a.parentId && b.parentId
            ? a.parentId - b.parentId
            : a.parentId
              ? a.parentId - b.id
              : a.id - b.id
        )
        .map(this.renderEmotionButton.bind(this))
      ).then((radioButtons) => {
        const fragment = document.createDocumentFragment();
        radioButtons.forEach((button) => fragment.appendChild(button));
        parent.appendChild(fragment);
      })
      .catch(console.error);

    const form = document.querySelector('form#Home') as HTMLFormElement;
    form.addEventListener('submit', this.onEmotionSubmit.bind(this));

    this.form.formElement.addEventListener(
      'emotion-entry', this.onFormSubmit.bind(this) as EventListener
    );

    const moreButton = document.querySelector('button.more') as HTMLButtonElement;
    moreButton.addEventListener('click', this.toggleMore.bind(this));

    const addInfoButton = document.querySelector('button.add-info') as HTMLButtonElement;
    addInfoButton.addEventListener('click', this.showMoreInfo.bind(this));

    void this.updateHistory();

    document.addEventListener('click', (event) => {
      if (
        event.target !== moreButton
        && (event.target as HTMLElement)?.closest('button') !== moreButton
      ) {
        this.closeMoreButton();
      }
    });

    // chrome.storage.onChanged.addListener((changes, namespace) => {
    //   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    //     console.log(
    //       `Storage key "${key}" in namespace "${namespace}" changed.`,
    //       `Old value was "${oldValue}", new value is "${newValue}".`
    //     );
    //   }
    // });
  }

  closeMoreButton() {
    const addInfoButton = document.querySelector('button.add-info') as HTMLButtonElement;
    const moreButton = document.querySelector('button.more') as HTMLButtonElement;
    moreButton.classList.remove('expanded');
    addInfoButton.tabIndex = -1;
  }

  createHistoryItem(timestamp: Date, emotion: Emotion): Promise<HTMLLIElement> {
    return new Promise((resolve, reject) => {
      const item = document.createElement('li');
      const text = document.createElement('span');
      const date = document.createElement('span');
      text.textContent = emotion.name;
      text.classList.add('text');
      date.textContent = timestamp.toLocaleString();
      date.classList.add('date');
      this.getSvg(emotion.id)
        .then((svg) => {
          item.appendChild(
            svg
          );
          item.appendChild(text);
          item.appendChild(date);
          resolve(item);
        })
        .catch(error => {
          console.log(error);
          item.appendChild(text);
          item.appendChild(date);
          resolve(item);
        });
    });
  }

  getSvg(id: number) {
    return fetch(`./assets/${id}.svg`)
      .then((response) => response.text())
      .then((data) => {
        const svg = new DOMParser().parseFromString(data, 'image/svg+xml').documentElement
        if (svg.nodeName === 'svg') {
          return svg;
        }
        return Promise.reject('Invalid SVG');
      });
  }

  onEmotionSubmit(event: SubmitEvent) {
    event.preventDefault();
    // this.saveEmotion();
    this.form.submit();
  }

  onFormSubmit(event: CustomEvent<FormGroup[]>) {
    this.saveEmotion(event.detail);
  }

  openMoreButton() {
    const addInfoButton = document.querySelector('button.add-info') as HTMLButtonElement;
    const moreButton = document.querySelector('button.more') as HTMLButtonElement;
    moreButton.classList.add('expanded');
    addInfoButton.tabIndex = 0;
    addInfoButton.focus();
  }

  renderEmotionButton(emotion: Emotion): Promise<HTMLLabelElement> {
    return new Promise((resolve, reject) => {
      const radio = document.createElement('input');
      const label = document.createElement('label');
      radio.required = true;
      radio.type = 'radio';
      radio.name = 'emotion';
      radio.value = emotion.id.toString();

      const currentGroupIndex = Emotions.filter(e => e.parentId === emotion.parentId)
        .findIndex(e => e.id === emotion.id);

      label.classList.add(
        'emotion',
        `row-${emotion.parentId ? 2 : 1}`,
        `row-item-${currentGroupIndex + 1}`,
        emotion.parentId ? 'hidden' : 'visible'
      );
      label.textContent = emotion.name;
      label.appendChild(radio);
      radio.addEventListener('click', this.selectEmotion.bind(this));

      this.getSvg(emotion.id)
        .then((svg) => {
          label.appendChild(
            svg
          );
          resolve(label);
        })
        .catch(error => {
          console.log(error);
          resolve(label);
        });
    });

  }

  saveEmotion(form?: FormGroup[]) {
    if (this.selectedEmotion === null) { return; }

    const emotionEntry = new EmotionEntryClass(this.selectedEmotion, form);
    StorageService.saveEmotion(emotionEntry.emotionEntry)
      .then(() => new Promise((resolve) => setTimeout(resolve, 200)))
      .then(() => {
        const form = document.querySelector('form') as HTMLFormElement;
        form.reset();
        form.querySelector('label')?.focus();
        form.closest('main')?.scrollTo(0, 0);
        this.setSelectedEmotion(null);
        this.showEmotionsById(0);

        this.form.reset();
    
        const emotions = document.querySelector('.emotions') as HTMLElement;
        emotions.classList.remove('hidden');
        
        void this.updateHistory();
      })
      .catch(console.error);

    // const formData = new FormData(event.target as HTMLFormElement);
    // const emotionData: {[key: string]: string | number} = {};
    // formData.forEach((value, key) => emotionData[key] = (value as string | number) || '');    

    // if (chrome.storage) {
    //   const emotion: { [key: string]: (Emotion | null) & any } = {};
    //   emotion[`${Date.now()}`] = {
    //     ...this.selectedEmotion,
    //     ...emotionData
    //   };
    //   chrome.storage.local.set(emotion, () => {
    //     console.log('Emotion saved:', this.selectedEmotion);
    //     window.close();
    //   });
    // } else {
    //   localStorage.setItem(Date.now().toString(), JSON.stringify({
    //     ...this.selectedEmotion,
    //     ...emotionData
    //   }));
    //   setTimeout(() => {
    //     const form = document.querySelector('form') as HTMLFormElement;
    //     form.reset();
    //     this.setSelectedEmotion(null);
    //     this.showEmotionsById(0);

    //     const details = document.querySelector('.details') as HTMLElement;
    //     details.classList.add('hidden');
    
    //     const emotions = document.querySelector('.emotions') as HTMLElement;
    //     emotions.classList.remove('hidden');
        
    //     void this.updateHistory();
    //   }, 200)
    // }
  }

  selectEmotion(event: MouseEvent) {
    const target = event.currentTarget as HTMLButtonElement;
    const id = target.value || '';

    if (id === '') { return; }

    this.setSelectedEmotion(Emotions.find(e => e.id.toString() === id) || null);

    this.form.enable();

    if (!this.selectedEmotion?.parentId) {
      this.showEmotionsById(Number(id));
    } else {
      document.querySelector(
        `.emotion:has(input[value="${this.selectedEmotion.parentId}"])`
      )?.classList.add('parent');
    }
  }

  setSelectedEmotion(emotion: Emotion | null) {
    const currentEmotion = document.querySelector('.current-emotion') as HTMLElement;
    const saveEmotionButton = document.querySelectorAll<HTMLButtonElement>('button.save-emotion');

    this.selectedEmotion = emotion;
    currentEmotion.textContent = this.selectedEmotion?.name || '?';
    saveEmotionButton.forEach((button) => button.disabled = !this.selectedEmotion?.name);

    this.form.updateFieldValue('emotionalResponse', this.selectedEmotion?.name || '');
  }

  showEmotionsById(id: number) {
    const visibleIds = Emotions
      .filter(e => !e.parentId || e.parentId === id)
      .map(e => e.id);

    const childElements: NodeListOf<HTMLSpanElement> = document.querySelectorAll('label.emotion');
    childElements.forEach((element: HTMLSpanElement) => {
      element.classList.remove('parent');
      const elementId = Number(element.querySelector('input')?.value);
      if (visibleIds.some(e => e === elementId)) {
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
      }
    });
  }

  showMoreInfo() {
    const triggerInput = document.querySelector('input[name="trigger"]') as HTMLInputElement;
    triggerInput.focus();
  }

  toggleMore() {
    const moreButton = document.querySelector('button.more') as HTMLButtonElement;

    if (moreButton.classList.contains('expanded')) {
      this.closeMoreButton();
    } else {
      this.openMoreButton();
    }
  }

  async updateHistory() {
    const historyList = document.querySelector('.history-list') as HTMLElement;
    historyList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    await StorageService.getEmotionHistory()
      .then((items) => Object.keys(items)
        .map(key => ({
          emotionEntry: items[key],
          timestamp: new Date(parseInt(key, 10))
        }))
        .filter(item => item.timestamp instanceof Date && !isNaN(item.timestamp.getTime()))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .map((item) => this.createHistoryItem(item.timestamp, item.emotionEntry.emotion))
      ).then(items => Promise.all(items))
      .then(items => {
        items.forEach(item => fragment.appendChild(item))
        historyList.appendChild(fragment);
      })
      .catch(console.error);
  }
}

new App();